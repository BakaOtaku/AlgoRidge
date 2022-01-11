const mnemonic = "during transfer welcome cram kitten bronze sorry blush empty acoustic manual keep draw jungle inner merry debate antenna range arrange burden drama bubble absorb patrol"
const approvalSource = `
#pragma version 5
txn ApplicationID
int 0
==
<<<<<<< HEAD
bnz main_l24
=======
<<<<<<< HEAD
bnz main_l26
txn OnCompletion
int OptIn
==
bnz main_l25
txn OnCompletion
int CloseOut
==
bnz main_l24
txn OnCompletion
int UpdateApplication
==
bnz main_l23
txn OnCompletion
int DeleteApplication
==
bnz main_l22
=======
bnz main_l22
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
bnz main_l20
=======
bnz main_l18
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
txn OnCompletion
int NoOp
==
bnz main_l7
err
main_l7:
txna ApplicationArgs 0
byte "AddBot"
==
<<<<<<< HEAD
bnz main_l19
=======
&&
<<<<<<< HEAD
bnz main_l21
txna ApplicationArgs 0
byte "addliquidity"
b==
bnz main_l20
txna ApplicationArgs 0
byte "removeliquidity"
b==
bnz main_l19
txna ApplicationArgs 0
byte "useBridge"
b==
bnz main_l18
txna ApplicationArgs 0
byte "releasePayment"
b==
bnz main_l17
txna ApplicationArgs 0
byte "setupdev"
b==
bnz main_l14
err
main_l14:
byte "bot"
txna Accounts 1
app_global_put
byte "admin"
txn Sender
app_global_put
txn Sender
log
callsub sub4
int 1
==
bnz main_l16
int 0
return
main_l16:
int 1
return
main_l17:
byte "bot"
app_global_get
txn Sender
==
=======
bnz main_l17
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
app_global_get
txn Sender
==
=======
app_local_get
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
callsub sub3
=======
<<<<<<< HEAD
callsub sub3
int 1
return
main_l18:
txn NumAppArgs
int 2
==
assert
txna ApplicationArgs 1
txn Sender
txna ApplicationArgs 2
callsub sub7
return
main_l19:
txn Sender
txna ApplicationArgs 1
callsub sub6
return
main_l20:
int 0
byte "assetID"
app_global_get
callsub sub5
return
main_l21:
txna Accounts 1
log
byte "bot"
txna Accounts 1
app_global_put
int 1
return
main_l22:
int 0
return
main_l23:
int 0
=======
callsub sub2
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
callsub sub6
return
main_l18:
=======
callsub sub4
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
return
main_l24:
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
int 0
byte "assetID"
app_global_get
callsub sub5
return
<<<<<<< HEAD
main_l19:
byte "thisishere"
log
=======
<<<<<<< HEAD
main_l25:
int 1
return
main_l26:
=======
main_l17:
txn Sender
byte "admin"
app_local_get
assert
txna Accounts 1
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
int 0
return
main_l23:
int 1
return
main_l24:
=======
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
int 1
return
sub0: // getAssetId
byte "assetID"
app_global_get
retsub
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
=======
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
=======
sub1: // inner_asset_transfer
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
sub3: // inner_payment_txn
=======
sub2: // inner_payment_txn
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
sub4: // setup_application
byte "assetID"
int 1
callsub sub1
app_global_put
int 1
retsub
sub5: // lp_deposit_in_pool
store 4
<<<<<<< HEAD
=======
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
load 14
byte "bridgedeposit"
load 13
app_local_put
load 14
byte "latesttimestamp"
global LatestTimestamp
app_local_put
load 14
byte "bridgereciever"
load 15
app_local_put
int 1
retsub
`
=======
sub3: // lp_deposit_in_pool
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18
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
<<<<<<< HEAD
retsub
`
=======
retsub`
>>>>>>> 7ba566ff8207a003e00d10345c6ea90a8ad5faed
>>>>>>> 7f56e90d69392027abfc226f54603561c99c9f18

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