const mnemonic = "during transfer welcome cram kitten bronze sorry blush empty acoustic manual keep draw jungle inner merry debate antenna range arrange burden drama bubble absorb patrol"
const approvalSource = `
#pragma version 5
txn ApplicationID
int 0
==
bnz main_l22
txn OnCompletion
int OptIn
==
bnz main_l21
txn OnCompletion
int CloseOut
==
bnz main_l20
txn OnCompletion
int UpdateApplication
==
bnz main_l19
txn OnCompletion
int DeleteApplication
==
bnz main_l18
txn OnCompletion
int NoOp
==
bnz main_l7
err
main_l7:
global GroupSize
int 1
==
txna ApplicationArgs 0
byte "AddBot"
==
&&
bnz main_l17
txna ApplicationArgs 0
byte "addliquidity"
b==
bnz main_l16
txna ApplicationArgs 0
byte "removeliquidity"
b==
bnz main_l15
txna ApplicationArgs 0
byte "useBridge"
b==
bnz main_l14
txna ApplicationArgs 0
byte "releasePayment"
b==
bnz main_l13
err
main_l13:
txn Sender
byte "bot"
app_local_get
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
callsub sub4
int 1
return
main_l14:
txn NumAppArgs
int 2
==
assert
txna ApplicationArgs 1
txn Sender
txna ApplicationArgs 2
callsub sub8
return
main_l15:
txn Sender
txna ApplicationArgs 1
callsub sub7
return
main_l16:
int 0
byte "assetID"
app_global_get
callsub sub6
return
main_l17:
txn Sender
byte "admin"
app_local_get
assert
txna Accounts 1
byte "bot"
int 1
app_local_put
int 1
return
main_l18:
int 0
return
main_l19:
int 0
return
main_l20:
int 0
return
main_l21:
int 0
return
main_l22:
txna Accounts 1
byte "bot"
int 1
app_local_put
txn Sender
byte "admin"
int 1
app_local_put
int 0
int 1
callsub sub0
callsub sub5
&&
int 1
==
bnz main_l24
int 0
return
main_l24:
int 1
return
sub0: // is_valid_setup_call
store 1
store 0
load 0
gtxns TypeEnum
int pay
==
assert
load 0
gtxns Amount
int 400000
>=
assert
load 1
gtxns TypeEnum
int appl
==
assert
load 1
gtxns OnCompletion
int NoOp
==
assert
load 1
gtxns ApplicationID
int 0
!=
assert
load 1
gtxns NumAppArgs
int 8
==
assert
int 1
retsub
sub1: // getAssetId
byte "assetID"
app_global_get
retsub
sub2: // inner_asset_creation
store 4
itxn_begin
int acfg
itxn_field TypeEnum
global CurrentApplicationAddress
itxn_field ConfigAssetClawback
global CurrentApplicationAddress
itxn_field ConfigAssetReserve
int 1
itxn_field ConfigAssetDefaultFrozen
load 4
gtxnsa ApplicationArgs 0
itxn_field ConfigAssetMetadataHash
load 4
gtxnsa ApplicationArgs 1
itxn_field ConfigAssetName
byte "bridge-lp"
itxn_field ConfigAssetUnitName
load 4
gtxnsa ApplicationArgs 3
btoi
itxn_field ConfigAssetTotal
load 4
gtxnsa ApplicationArgs 4
btoi
itxn_field ConfigAssetDecimals
itxn_submit
itxn CreatedAssetID
retsub
sub3: // inner_asset_transfer
store 10
store 9
store 8
store 7
itxn_begin
int axfer
itxn_field TypeEnum
load 7
itxn_field XferAsset
load 9
itxn_field AssetSender
load 8
itxn_field AssetAmount
load 10
itxn_field AssetReceiver
itxn_submit
retsub
sub4: // inner_payment_txn
store 3
store 2
itxn_begin
int pay
itxn_field TypeEnum
global CurrentApplicationAddress
itxn_field Sender
load 2
itxn_field Amount
load 3
itxn_field Receiver
itxn_submit
retsub
sub5: // setup_application
byte "assetID"
int 1
callsub sub2
app_global_put
int 1
retsub
sub6: // lp_deposit_in_pool
store 6
store 5
load 5
gtxns Amount
int 0
>
bz sub6_l2
load 6
load 5
gtxns Amount
global CurrentApplicationAddress
load 5
gtxns Sender
callsub sub3
sub6_l2:
int 1
retsub
sub7: // remove_lp_from_pool
store 12
store 11
load 11
callsub sub1
asset_holding_get AssetBalance
store 13
store 14
load 13
load 14
load 12
>
&&
bnz sub7_l2
int 0
b sub7_l3
sub7_l2:
callsub sub1
load 12
load 11
global CurrentApplicationAddress
callsub sub3
load 12
load 11
callsub sub4
int 1
sub7_l3:
retsub
sub8: // use_transfer_bridge
store 17
store 16
store 15
load 16
byte "bridgedeposit"
load 15
app_local_put
load 16
byte "latesttimestamp"
global LatestTimestamp
app_local_put
load 16
byte "bridgereciever"
load 17
app_local_put
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