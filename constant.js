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
callsub sub2
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
callsub sub5
return
main_l15:
txn Sender
txna ApplicationArgs 1
callsub sub4
return
main_l16:
int 0
byte "assetID"
app_global_get
callsub sub3
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
int 1
return
sub0: // getAssetId
byte "assetID"
app_global_get
retsub
sub1: // inner_asset_transfer
store 7
store 6
store 5
store 4
itxn_begin
int axfer
itxn_field TypeEnum
load 4
itxn_field XferAsset
load 6
itxn_field AssetSender
load 5
itxn_field AssetAmount
load 7
itxn_field AssetReceiver
itxn_submit
retsub
sub2: // inner_payment_txn
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
sub3: // lp_deposit_in_pool
store 3
store 2
load 2
gtxns Amount
int 0
>
bz sub3_l2
load 3
load 2
gtxns Amount
global CurrentApplicationAddress
load 2
gtxns Sender
callsub sub1
sub3_l2:
int 1
retsub
sub4: // remove_lp_from_pool
store 9
store 8
load 8
callsub sub0
asset_holding_get AssetBalance
store 10
store 11
load 10
load 11
load 9
>
&&
bnz sub4_l2
int 0
b sub4_l3
sub4_l2:
callsub sub0
load 9
load 8
global CurrentApplicationAddress
callsub sub1
load 9
load 8
callsub sub2
int 1
sub4_l3:
retsub
sub5: // use_transfer_bridge
store 14
store 13
store 12
load 13
byte "bridgedeposit"
load 12
app_local_put
load 13
byte "latesttimestamp"
global LatestTimestamp
app_local_put
load 13
byte "bridgereciever"
load 14
app_local_put
int 1
retsub`

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