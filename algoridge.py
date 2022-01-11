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
        Assert(Gtxn[fund_txn_index].type_enum() == TxnType.Payment),
        # you can calculate the min balance you need here ... I just sent 400k to have enough for playing around
        Assert(Gtxn[fund_txn_index].amount() >= Int(400000)),
        Assert(Gtxn[app_call_txn_index].type_enum() == TxnType.ApplicationCall),
        Assert(Gtxn[app_call_txn_index].on_completion() == OnComplete.NoOp),
        # if the application is yet to be created the application ID will be 0
        Assert(Gtxn[app_call_txn_index].application_id() != Int(0)),
        # the correct amount of application_args are specified since the call whould later fail elsewhise anyways
        Assert(Gtxn[app_call_txn_index].application_args.length() == Int(8)),
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
            # TxnField.note: Bytes("TUT_ITXN_AC"),
            TxnField.type_enum: TxnType.AssetConfig,
            TxnField.config_asset_clawback: Global.current_application_address(),
            TxnField.config_asset_reserve: Global.current_application_address(),
            TxnField.config_asset_default_frozen: Int(1),
            TxnField.config_asset_metadata_hash: call_parameters[0],
            TxnField.config_asset_name: call_parameters[1],
            TxnField.config_asset_unit_name: Bytes("bridge-lp"),
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
    fixed_license_price = Btoi(Gtxn[1].application_args[6])
    refund_period = Btoi(Gtxn[1].application_args[7])
    return Seq(
        # initiate Global State
        App.globalPut(GlobalState.Variables.ASSET_ID, asset_id),
        Int(1))


@Subroutine(TealType.uint64)
def lp_deposit_in_pool(payment_txn_index: TealType.uint64, asset_id: TealType.uint64):
    """ perform the operation to buy licenses """
    # first transaction in thr group should be the buy payment
    deposit_tx = Gtxn[payment_txn_index]
    deposit_amount_sent = deposit_tx.amount()

    return Seq(
        #  check if the payment is enough to buy even 1 unit
        If(deposit_amount_sent > Int(0)).Then(
            # if so transfer the bought units
            inner_asset_transfer(
                asset_id,
                deposit_amount_sent,
                Global.current_application_address(),
                deposit_tx.sender())
        ),
        # update local state
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
        Int(1)
    )


def approval_program():
    handle_optin = Return(Int(0))

    handle_closeout = Return(Int(0))

    handle_updateapp = Return(Int(0))

    handle_deleteapp = Return(Int(0))

    setup_stuff = Seq([
        App.localPut(Txn.accounts[1], Bytes("bot"), Int(1)),
        App.localPut(Txn.sender(), Bytes("admin"), Int(1)),
        If(And(is_valid_setup_call(Int(0), Int(1)), setup_application()) == Int(1)).Then(
            Approve()).Else(Reject())
    ])

    setup_dev= Seq(
        [

        ]
    )

    is_admin = App.localGet(Txn.sender(), Bytes("admin"))
    is_bot = App.localGet(Txn.sender(), Bytes("bot"))

    new_bot = Txn.accounts[1]
    change_bot = Seq(
        [
            Assert(is_admin),
            App.localPut(new_bot, Bytes("bot"), Int(1)),
            Return(Int(1))
        ]
    )

    deposit_lp_in_pool = lp_deposit_in_pool(Int(0), App.globalGet(GlobalState.Variables.ASSET_ID))

    withdraw_lp_from_pool = remove_lp_from_pool(Txn.sender(), Txn.application_args[1])

    # send micro algo here to do stuff
    transfer_bridge = Seq(
        [
            Assert(Txn.application_args.length() == Int(2)),
            use_transfer_bridge(Txn.application_args[1], Txn.sender(), Txn.application_args[2]),
            # Int(1)
        ]
    )

    release_amount = Btoi(Txn.application_args[1])
    release_address = Txn.accounts[1]
    release_payment = Seq(
        [
            Assert(is_bot),
            Assert(Le(release_amount, Balance(Global.current_application_address()))),
            inner_payment_txn(release_amount, release_address),
            Return(Int(1))
        ]
    )

    handle_noop = Cond(
        # [And(
        #     BytesEq(Txn.application_args[0], Bytes("setup"))
        # ), setup_dev],
        [And(
            Global.group_size() == Int(1),
            Txn.application_args[0] == Bytes("AddBot")
        ), change_bot],
        [And(
            BytesEq(Txn.application_args[0], Bytes("addliquidity"))
        ), Return(deposit_lp_in_pool)],
        [And(
            BytesEq(Txn.application_args[0], Bytes("removeliquidity"))
        ), Return(withdraw_lp_from_pool)],
        [
            And(
                BytesEq(Txn.application_args[0],Bytes("useBridge"))
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
            ), setup_stuff
        ],
    )

    program = Cond(
        [Txn.application_id()==Int(0),Return(Int(1))],
        [Txn.on_completion() == OnComplete.OptIn, handle_optin],
        [Txn.on_completion() == OnComplete.CloseOut, handle_closeout],
        [Txn.on_completion() == OnComplete.UpdateApplication, handle_updateapp],
        [Txn.on_completion() == OnComplete.DeleteApplication, handle_deleteapp],
        [Txn.on_completion() == OnComplete.NoOp, handle_noop]
        # [Txn.application_args[0] == Bytes("setup"), Return(setup_stuff)],
        # # [Txn.application_args[0] == Bytes("AddBot"), change_bot],
        # [Txn.application_args[0] == Bytes("addliquidity"), Return(deposit_lp_in_pool)],
        # [Txn.application_args[0] == Bytes("removeliquidity"),Return(withdraw_lp_from_pool)],
        # [Txn.application_args[0] == Bytes("useBridge"), Return(transfer_bridge)],
        # [Txn.application_args[0] == Bytes("releasePayment"), release_payment]
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