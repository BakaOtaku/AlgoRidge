import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, LinearProgress, Grid } from "@material-ui/core";

import TokenInput from "../TokenInput";
import SwitchIcon from "../../UI/SwitchIcon";
import Input from "../Input";
import ErrorBox from "../../UI/ErrorBox";
import ResultModal from "../../UI/ResultModal";

import Web3 from "web3";
import { useWeb3Context } from "../../../contexts/Web3Context";
import erc20_abi from "../../../utils/erc20.json";
import bridge_abi from "../../../utils/bridge.json";
import { bridge_contract, erc20_contract } from "../../../utils/constants";

const AvaToAlgo = ({ toggleForm, setToggleForm }) => {
  const classes = useStyles();
  const { inj_provider, account } = useWeb3Context();

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
  const [tx2, setTx2] = useState("");

  const deposit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const web3 = new Web3(inj_provider);
      setProgress(10);
      const erc20 = new web3.eth.Contract(erc20_abi, erc20_contract);
      const txhash = await erc20.methods.approve(bridge_contract, '10000000000000000000000000000000000').send({ from: account });
      console.log({ transactionHash: txhash.transactionHash });
      setTx1(txhash.transactionHash);
      setProgress(60);
      const bridge = new web3.eth.Contract(bridge_abi, bridge_contract);
      const txhash2 = await bridge.methods.usebridge(amount, recieverAddr).send({ from: account });
      console.log({ transactionHash: txhash2.transactionHash });
      setTx2(txhash2.transactionHash);
      setProgress(100);
      setLoading(false);
      openModal();
    } catch (e) {
      setLoading(false);
      setError(e.message.substr(0, 70));
      console.error(e);
    }
  };

  return (
    <>
      <ResultModal
        avaToAlgo
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          url: "https://testnet.snowtrace.io/tx/",
          addressOne: tx1,
          addressTwo: tx2,
        }}
      />
      <form className={classes.formContainer} onSubmit={deposit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h3 className={classes.inputTitle}>From Avalanche</h3>
            <div className={classes.inputSection}>
              <Input
                type="text"
                placeholder="KGMTN55Y7LS..."
                value={recieverAddr}
                onChange={(e) => setRecieverAddr(e.target.value)}
                id="address"
                label="Receiver address on algo chain"
              />
              <TokenInput
                editable
                name="ava-to-algo"
                chain="avalanche"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </Grid>

          <SwitchIcon
            swapVertical
            toggleForm={toggleForm}
            setToggleForm={setToggleForm}
          />

          <Grid item xs={12}>
            <h3 className={classes.inputTitle}>To Algorand</h3>
            <div className={classes.inputSection}>
              <TokenInput name="algo-to-ava" chain="algo" value={amount} />
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

export default AvaToAlgo;
