const mnemonic = "stuff wasp toddler cave sunny key regret fatigue anger warm health false pluck gadget fiction member benefit because top alert trim tomorrow ordinary able bonus"

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
gtxna 0 ApplicationArgs 0
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
int 1
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
callsub sub2
int 1
return
main_l16:
gtxn 1 Amount
txn Sender
gtxna 0 ApplicationArgs 1
callsub sub5
return
main_l17:
txn Sender
txna ApplicationArgs 1
callsub sub4
return
main_l18:
int 1
byte "assetID"
app_global_get
callsub sub3
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
load 3
load 2
gtxns Amount
global CurrentApplicationAddress
load 2
gtxns Sender
callsub sub1
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
load 14
log
load 12
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
const abi = `
[
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
`

module.exports = {
	mnemonic,
	approvalSource,
	clearSource,
	abi
};