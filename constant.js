const mnemonic = "noodle thing just rabbit opinion never estate effort street goddess earth kidney whip rhythm sea blood abstract glory similar attend trouble mask bunker abstract rubber"
const approvalSource = `
#pragma version 5
txn ApplicationID
int 0
==
bnz main_l24
txn OnCompletion
int OptIn
==
bnz main_l23
txn OnCompletion
int CloseOut
==
bnz main_l22
txn OnCompletion
int UpdateApplication
==
bnz main_l21
txn OnCompletion
int DeleteApplication
==
bnz main_l20
txn OnCompletion
int NoOp
==
bnz main_l7
err
main_l7:
txna ApplicationArgs 0
byte "AddBot"
==
bnz main_l19
txna ApplicationArgs 0
byte "addliquidity"
b==
bnz main_l18
txna ApplicationArgs 0
byte "removeliquidity"
b==
bnz main_l17
gtxna 0 ApplicationArgs 0
byte "useBridge"
b==
bnz main_l16
txna ApplicationArgs 0
byte "releasePayment"
b==
bnz main_l15
txna ApplicationArgs 0
byte "setupdev"
b==
bnz main_l14
err
main_l14:
byte "bot"
txn Sender
app_global_put
byte "admin"
txn Sender
app_global_put
callsub sub4
return
main_l15:
byte "bot"
app_global_get
txn Sender
==
assert
txna ApplicationArgs 1
btoi
global CurrentApplicationAddress
balance
<=
assert
txna ApplicationArgs 1
btoi
txna Accounts 1
callsub sub3
int 1
return
main_l16:
txn NumAppArgs
int 2
==
assert
gtxn 1 Amount
txn Sender
gtxna 0 ApplicationArgs 1
callsub sub7
return
main_l17:
txn Sender
txna ApplicationArgs 1
callsub sub6
return
main_l18:
int 0
byte "assetID"
app_global_get
callsub sub5
return
main_l19:
byte "thisishere"
log
byte "bot"
txna Accounts 1
app_global_put
int 1
return
main_l20:
int 0
return
main_l21:
int 0
return
main_l22:
int 0
return
main_l23:
int 1
return
main_l24:
int 1
return
sub0: // getAssetId
byte "assetID"
app_global_get
retsub
sub1: // inner_asset_creation
store 2
itxn_begin
int acfg
itxn_field TypeEnum
global CurrentApplicationAddress
itxn_field ConfigAssetClawback
global CurrentApplicationAddress
itxn_field ConfigAssetReserve
int 1
itxn_field ConfigAssetDefaultFrozen
load 2
gtxnsa ApplicationArgs 0
itxn_field ConfigAssetMetadataHash
load 2
gtxnsa ApplicationArgs 1
itxn_field ConfigAssetName
byte "bridge-lp"
itxn_field ConfigAssetUnitName
load 2
gtxnsa ApplicationArgs 3
btoi
itxn_field ConfigAssetTotal
load 2
gtxnsa ApplicationArgs 4
btoi
itxn_field ConfigAssetDecimals
itxn_submit
itxn CreatedAssetID
retsub
sub2: // inner_asset_transfer
store 8
store 7
store 6
store 5
itxn_begin
int axfer
itxn_field TypeEnum
load 5
itxn_field XferAsset
load 7
itxn_field AssetSender
load 6
itxn_field AssetAmount
load 8
itxn_field AssetReceiver
itxn_submit
retsub
sub3: // inner_payment_txn
store 1
store 0
itxn_begin
int pay
itxn_field TypeEnum
global CurrentApplicationAddress
itxn_field Sender
load 0
itxn_field Amount
load 1
itxn_field Receiver
itxn_submit
retsub
sub4: // setup_application
byte "assetID"
int 1
callsub sub1
app_global_put
int 1
retsub
sub5: // lp_deposit_in_pool
store 4
store 3
load 3
gtxns Amount
int 0
>
bz sub5_l2
load 4
load 3
gtxns Amount
global CurrentApplicationAddress
load 3
gtxns Sender
callsub sub2
sub5_l2:
int 1
retsub
sub6: // remove_lp_from_pool
store 10
store 9
load 9
callsub sub0
asset_holding_get AssetBalance
store 11
store 12
load 11
load 12
load 10
>
&&
bnz sub6_l2
int 0
b sub6_l3
sub6_l2:
callsub sub0
load 10
load 9
global CurrentApplicationAddress
callsub sub2
load 10
load 9
callsub sub3
int 1
sub6_l3:
retsub
sub7: // use_transfer_bridge
store 15
store 14
store 13
load 15
log
load 13
itob
log
int 1
retsub
`

const clearSource = `
#pragma version 5
int 1
return
`

module.exports = {
  mnemonic,
  approvalSource,
  clearSource
};