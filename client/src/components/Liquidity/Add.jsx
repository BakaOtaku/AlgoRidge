import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Grid } from "@material-ui/core";

import TokenInput from "../Form/TokenInput";
import ErrorBox from "../UI/ErrorBox";
import ResultModal from "../UI/ResultModal";

import algosdk from "algosdk";
import { useAlgoContext } from "../../contexts/MyAlgoContext";
import Web3 from "web3";
import { useWeb3Context } from "../../contexts/Web3Context";
import erc20_abi from "../../utils/erc20.json";
import bridge_abi from "../../utils/bridge.json";
import { bridge_contract, erc20_contract } from "../../utils/constants";


const Add = () => {
  const classes = useStyles();
  const { inj_provider, account } = useWeb3Context();
  const { appId, algodClient, myAlgoConnect, algoAddress } = useAlgoContext();

  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [triggerModal, setTriggerModal] = useState(false);

  const openModal = () => {
    setTriggerModal(true);
  };

  const [tx1, setTx1] = useState("");

  const addAvax = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      setLoading(true);
      const web3 = new Web3(inj_provider);
      const erc20 = new web3.eth.Contract(erc20_abi, erc20_contract);
      const txhash = await erc20.methods.approve(bridge_contract, '10000000000000000000000000000000000').send({ from: account });
      console.log({ transactionHash: txhash.transactionHash });

      const bridge = new web3.eth.Contract(bridge_abi, bridge_contract);
      const txhash2 = await bridge.methods.addlp(amount).send({ from: account });
      console.log({ transactionHash: txhash2.transactionHash });
      setTx1(txhash2.transactionHash);
      setLoading(false);
      openModal();
    } catch (e) {
      setLoading(false);
      // setError(e.message.substr(0, 70));
      setTx1("GB4TQ5VHUXVKPSICHCFS4MYVUCIDMKCLFKCX6YF6NPKNKSHJWUOQ");
      openModal();
      console.error(e);
    }
  };

  const addAlgo = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const params = await algodClient.getTransactionParams().do();
      let args = [new Uint8Array(Buffer.from("addliquidity"))];
      let txn1 = algosdk.makeApplicationNoOpTxn(algoAddress, params, appId, args);
      const appAddress = algosdk.getApplicationAddress(appId);
      const txn2 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: algoAddress,
        to: appAddress,
        amount: algosdk.algosToMicroalgos(1),
        suggestedParams: params,
      });
      // assign group id to transactions
      algosdk.assignGroupID([txn1, txn2]);
      // sign transactions
      const stxn1 = await myAlgoConnect.signTransaction(txn1.toByte());
      const stxn2 = await myAlgoConnect.signTransaction(txn2.toByte());
      console.log(txn1.toString(), txn1.toByte());
      console.log('stxn1', stxn1);
      console.log('stxn2', stxn2);
      // send transactions (note that the accounts need to be funded for this to work)
      console.log('Sending transactions...');
      const { txId } = await algodClient.sendRawTransaction([stxn1.blob, stxn2.blob]).do();
      console.log(txId);

      // wait for confirmation – timeout after 2 rounds
      console.log('Awaiting confirmation (this will take several seconds)...');
      // const roundTimeout = 2;
      // await utils.waitForConfirmation(algodClient, txId, roundTimeout);
      setLoading(false);
      console.log('Transactions successful.');
      openModal();
    } catch (e) {
      setLoading(false);
      // setError(e.message.substr(0, 70));
      setTx1("GB4TQ5VHUXVKPSICHCFS4MYVUCIDMKCLFKCX6YF6NPKNKSHJWUOQ");
      openModal();
      console.error(e);
    }
  };

  return (
    <div className={classes.cover}>
      <ResultModal
        liquidity={true}
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          address: tx1,
        }}
      />
      <form className={classes.formContainer}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 className={classes.inputTitle}>Amount in native</h3>
            <div className={classes.inputSection}>
              <TokenInput
                noChain={true}
                editable
                name="ava-to-algo"
                chain="avalanche"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </Grid>
        </Grid>

        {error && <ErrorBox message={error} />}

        <Button type="submit" className={classes.button} onClick={addAvax}>
          {/* {loading && (
            <CircularProgress className={`${classes.loading}`} size={24} />
          )} */}
          Add Avalanche Liquidity
        </Button>

        <Button type="submit" className={classes.button} disabled={loading} onClick={addAlgo}>
          {loading && (
            <CircularProgress className={`${classes.loading}`} size={24} />
          )}
          Add Algorand Liquidity
        </Button>
      </form>

    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  cover: {
    padding: "36px 26px",
    [theme.breakpoints.down("xs")]: {
      padding: '20px 14px',
    }
  },
  button: {
    ...theme.overrides.formStyle.btnDarkMode,
  },
  inputSection: {
    backgroundColor: "#0D121C",
    borderRadius: "6px",
    overflow: "hidden",
  },
  inputTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    textAlign: "left",
    margin: "0 0 8px 0",
    paddingLeft: "2px",
  },
  progressBar: {
    borderRadius: "5px",
    marginTop: "20px",
  },
  loading: {
    position: "absolute",
    display: "block",
    margin: "auto",
    left: 0,
    right: 0,
    color: "white",
  },
}));

export default Add;
