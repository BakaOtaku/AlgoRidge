import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, LinearProgress, Grid } from "@material-ui/core";

import TokenInput from "../TokenInput";
import SwitchIcon from "../../UI/SwitchIcon";
import Input from "../Input";
import ErrorBox from "../../UI/ErrorBox";
import ResultModal from "../../UI/ResultModal";

import algosdk from "algosdk";
import { useAlgoContext } from "../../../contexts/MyAlgoContext";

const AlgoToAva = ({ toggleForm, setToggleForm }) => {
  const classes = useStyles();
  const { appId, algodClient, myAlgoConnect, algoAddress } = useAlgoContext();

  const [recieverAddr, setRecieverAddr] = useState("");
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [triggerModal, setTriggerModal] = useState(false);

  const openModal = () => {
    setTriggerModal(true);
  };

  const [tx1, setTx1] = useState("");

  const deposit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setProgress(10);
      const params = await algodClient.getTransactionParams().do();
      // call application with arguments
      let args = []
      args.push(new Uint8Array(Buffer.from("useBridge")))
      args.push(new Uint8Array(Buffer.from(recieverAddr)))
      // create unsigned transaction
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
      setProgress(40);
      const stxn2 = await myAlgoConnect.signTransaction(txn2.toByte());
      setProgress(60);
      console.log(txn1.toString(), txn1.toByte());
      console.log({ stxn1, stxn2 });
      // send transactions (note that the accounts need to be funded for this to work)
      console.log('Sending transactions...');
      const { txId } = await algodClient.sendRawTransaction([stxn1.blob, stxn2.blob]).do();
      console.log(txId);
      setTx1(txId);
      console.log('Awaiting confirmation (this will take several seconds)...');
      // const roundTimeout = 2;
      // await utils.waitForConfirmation(algodClient, txId, roundTimeout);
      console.log('Transactions successful.');
      setProgress(100);
      setLoading(false);
      openModal();
    } catch (e) {
      setLoading(false);
      setError(e.message);
      console.error(e);
    }
  };

  return (
    <>
      <ResultModal
        algoToAva
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          url: "https://testnet.algoexplorer.io/tx/",
          address: tx1,
        }}
      />
      <form className={classes.formContainer} onSubmit={deposit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 className={classes.inputTitle}>From Algorand</h3>
            <div className={classes.inputSection}>
              <Input
                type="text"
                placeholder="0xb48379529f05fc..."
                value={recieverAddr}
                onChange={(e) => setRecieverAddr(e.target.value)}
                id="address"
                label="Receiver address on avax chain"
              />
              <TokenInput
                editable
                name="algo-to-ava"
                chain="algo"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </Grid>

          <SwitchIcon swapVertical toggleForm={toggleForm} setToggleForm={setToggleForm} />

          <Grid item xs={12}>
            <h3 className={classes.inputTitle}>To Avalanche</h3>
            <div className={classes.inputSection}>
              <TokenInput name="ava-to-algo" chain="avalanche" value={amount} />
            </div>
          </Grid>
        </Grid>

        {error && <ErrorBox message={error} />}

        <Button type="submit" className={classes.button} disabled={loading}>
          {loading && (
            <CircularProgress className={`${classes.loading}`} size={24} />
          )}
          Bridge Token
        </Button>

        {loading && (
          <LinearProgress
            variant="determinate"
            value={progress}
            className={classes.progressBar}
          />
        )}
      </form>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
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

export default AlgoToAva;
