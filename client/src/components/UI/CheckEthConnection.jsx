import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useWeb3Context } from "../../contexts/Web3Context";

const CheckEthConnection = () => {
  const classes = useStyles();
  const { providerChainId } = useWeb3Context();

  return (
    <>
      {providerChainId !== 5 && (
        <div className={classes.msgContainer}>
          <div className={classes.msg}>
            <p className={classes.title}>Message</p>
            <p className={classes.text}>
              To bridge ETH to Algo you need to switch to Eth Mainnet or Goerli Testnet.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.msgStyle,
}));

export default CheckEthConnection;
