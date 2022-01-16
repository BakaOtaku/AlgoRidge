# samplecontract.py
from pyteal import *
from pyteal import Seq


class GlobalState:
    """ wrapper class for access to predetermined Global State properties"""

    class Variables:
        """ Global State Variables """
        ASSET_ID: TealType.bytes = Bytes("assetID")


class LocalState:
    class Variables:
        Staked: TealType.bytes = Bytes("stakeamount")
        DEPOSITED: TealType.bytes = Bytes("bridgedeposit")
        RECIEVER: TealType.bytes = Bytes("bridgereciever")
        TimeStamp: TealType.bytes = Bytes("latesttimestamp")


@Subroutine(TealType.uint64)
def is_valid_setup_call(fund_txn_index: TealType.uint64, app_call_txn_index: TealType.uint64):
    """
    - validate the transactions are within security boundaries
    - validate the application create call is valid and sets up the ASA correctly
    """
    return Seq(
        # first transaction is seeding the application account
        # the correct amount of application_args are specified since the call whould later fail elsewhise anyways
        Int(1))


@Subroutine(TealType.uint64)
def getAssetId():
    """ Getter for GlobalState.ASSET_ID """
    return App.globalGet(GlobalState.Variables.ASSET_ID)


@Subroutine(TealType.uint64)
def inner_asset_creation(txn_index: TealType.uint64) -> Seq:
    """
    - returns the id of the generated asset or fails
    """
    call_parameters = Gtxn[txn_index].application_args
    asset_total = Btoi(call_parameters[3])
    decimals = Btoi(call_parameters[4])
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetConfig,
            TxnField.config_asset_clawback: Global.current_application_address(),
            TxnField.config_asset_reserve: Global.current_application_address(),
            TxnField.config_asset_default_frozen: Int(1),
            TxnField.config_asset_metadata_hash: call_parameters[0],
            TxnField.config_asset_name: Bytes("bridge-lp"),
            TxnField.config_asset_unit_name: Bytes("bridge-lp-asset"),
            TxnField.config_asset_total: asset_total,
            TxnField.config_asset_decimals: decimals,
        }),
        InnerTxnBuilder.Submit(),
        InnerTxn.created_asset_id()
    ])


@Subroutine(TealType.none)
def inner_asset_transfer(asset_id: TealType.uint64, asset_amount: TealType.uint64, asset_sender: TealType.bytes,
                         asset_receiver: TealType.bytes) -> Expr:
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            # TxnField.note: Bytes("TUT_ITXN_AT"),
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.xfer_asset: asset_id,
            TxnField.asset_sender: asset_sender,
            TxnField.asset_amount: asset_amount,
            TxnField.asset_receiver: asset_receiver
        }),
        InnerTxnBuilder.Submit()
    ])


@Subroutine(TealType.none)
def inner_payment_txn(amount: TealType.uint64, receiver: TealType.bytes) -> Expr:
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            # TxnField.note: Bytes("TUT_ITXN_PAY"),
            TxnField.type_enum: TxnType.Payment,
            TxnField.sender: Global.current_application_address(),
            TxnField.amount: amount,
            TxnField.receiver: receiver
        }),
        InnerTxnBuilder.Submit()
    ])


@Subroutine(TealType.uint64)
def setup_application():
    """ perform application setup to initiate global state and create the managed ASA"""
    asset_id = inner_asset_creation(Int(1))
    return Seq(
        [
            App.globalPut(GlobalState.Variables.ASSET_ID, asset_id),
            Int(1),
    ])


@Subroutine(TealType.uint64)
def lp_deposit_in_pool(payment_txn_index: TealType.uint64, asset_id: TealType.uint64):
    """ perform the operation to buy licenses """
    deposit_tx = Gtxn[payment_txn_index]
    deposit_amount_sent = deposit_tx.amount()

    return Seq(
        inner_asset_transfer(
            asset_id,
            deposit_amount_sent,
            Global.current_application_address(),
            deposit_tx.sender()),

        Return(Int(1)))


@Subroutine(TealType.uint64)
def remove_lp_from_pool(address_sender: TealType.bytes, withdraw_amount: TealType.uint64):
    """ handler for asset to algo logic """
    holderBalance = AssetHolding.balance(address_sender, getAssetId())

    return Seq(
        # if is refund period still active then refund
        holderBalance,
        If(And(holderBalance.hasValue(), Gt(holderBalance.value(), withdraw_amount))).Then(
            Seq(
                inner_asset_transfer(
                    getAssetId(),
                    withdraw_amount,
                    address_sender,
                    Global.current_application_address()),
                inner_payment_txn(withdraw_amount, address_sender),
                # the call gets approved
                Int(1))
            # Else the call gets rejected
        ).Else(Int(0)))


@Subroutine(TealType.uint64)
def use_transfer_bridge(amount: TealType.uint64, sender: TealType.bytes, reciever: TealType.bytes):
    return Seq(
        App.localPut(sender, LocalState.Variables.DEPOSITED, amount),
        App.localPut(sender, LocalState.Variables.TimeStamp, Global.latest_timestamp()),
        App.localPut(sender, LocalState.Variables.RECIEVER, reciever),
        Log(reciever),
        Log(Itob(amount)),
        Int(1)
    )


def approval_program():
    handle_optin = Return(Int(1))

    handle_closeout = Return(Int(0))

    handle_updateapp = Return(Int(0))

    handle_deleteapp = Return(Int(0))

    setup_stuff = Seq([
        App.globalPut(Bytes("bot"), Txn.sender()),
        App.globalPut(Bytes("admin"), Txn.sender()),
        setup_application(),

    ])

    is_admin = App.globalGet(Bytes("admin"))
    is_bot = App.globalGet(Bytes("bot"))

    new_bot = Txn.accounts[1]

    change_bot = Seq(
        [
            Assert(Txn.sender()==is_admin),
            App.globalPut(Bytes("bot"), new_bot),
            Return(Int(1))
        ]
    )

    deposit_lp_in_pool = lp_deposit_in_pool(Int(1), App.globalGet(GlobalState.Variables.ASSET_ID))

    withdraw_lp_from_pool = remove_lp_from_pool(Txn.sender(), Txn.application_args[1])

    transfer_bridge = Seq(
        [
            use_transfer_bridge(Gtxn[1].amount(), Txn.sender(), Gtxn[0].application_args[1]),
         ]
    )

    release_amount = Btoi(Txn.application_args[1])
    release_address = Txn.accounts[1]
    release_payment = Seq(
        [
            Assert(is_bot==Txn.sender()),
            Assert(Le(release_amount, Balance(Global.current_application_address()))),
            inner_payment_txn(release_amount, release_address),
            Return(Int(1))
        ]
    )

    handle_noop = Cond(
        [And(
            Txn.application_args[0] == Bytes("AddBot")
        ), change_bot],
        [And(
            BytesEq(Gtxn[0].application_args[0], Bytes("addliquidity"))
        ), Return(deposit_lp_in_pool)],
        [And(
            BytesEq(Txn.application_args[0], Bytes("removeliquidity"))
        ), Return(withdraw_lp_from_pool)],
        [
            And(
                BytesEq(Gtxn[0].application_args[0],Bytes("useBridge"))
            ),Return(transfer_bridge)
        ],
        [
            And(
                BytesEq(Txn.application_args[0],Bytes("releasePayment"))
            ),release_payment
        ],
        [
            And(
                BytesEq(Txn.application_args[0], Bytes("setupdev"))
            ), Return(setup_stuff)
        ],
    )

    program = Cond(
        [Txn.application_id()==Int(0),Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
    )
    # Mode.Application specifies that this is a smart contract
    return compileTeal(program, Mode.Application, version=5)


def clear_state_program():
    program = Return(Int(1))
    # Mode.Application specifies that this is a smart contract
    return compileTeal(program, Mode.Application, version=5)

if __name__ == "__main__":
    with open("main.teal", "w") as f:
        compiled = approval_program()
        f.write(compiled)

    with open("main_clear.teal", "w") as f:
        compiled = clear_state_program()
        f.write(compiled)

# print out the results
print(approval_program())
print(clear_state_program())