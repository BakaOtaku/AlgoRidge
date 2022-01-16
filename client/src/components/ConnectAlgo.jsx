import React, { useState } from "react";
import Blockies from "react-blockies";

import { useAlgoContext } from "../contexts/MyAlgoContext";
import { makeStyles } from "@material-ui/core/styles";

const truncateAddress = (address) => {
  return address.slice(0, 6) + "..." + address.slice(-4);
};

const ConnectAlgo = () => {
  const classes = useStyles();
  const { connectAlgo, algoAddress, disconnect } = useAlgoContext();
  const [showLogout, setShowLogout] = useState(false);

  const toggleLogoutButton = () => {
    showLogout ? setShowLogout(false) : setShowLogout(true);
  };

  const disconnectWallet = () => {
    disconnect();
    setShowLogout(false);
  };

  return (
    <div className={classes.walletBtnContainer}>
      <button
        className={classes.walletBtn}
        onClick={algoAddress ? toggleLogoutButton : connectAlgo}
      >
        <Blockies
          className={`${classes.img} ${algoAddress ? "green" : "red"}`}
          seed={algoAddress ? algoAddress : ""}
        />
        <div>{algoAddress ? truncateAddress(algoAddress) : "Connect MyAlgo"}</div>
      </button>
      {showLogout && (
        <div onClick={disconnectWallet} className={classes.logout}>
          Logout
        </div>
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  walletBtnContainer: {
    display: "flex",
    position: "relative",
  },
  walletBtn: {
    background: "#e3e3e3",
    cursor: "pointer",
    border: 0,
    outline: "none",
    borderRadius: "18px",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px 0 8px",
    display: "flex",
    alignItems: "center",

    "@media (max-width:599px)": {
      padding: 0,
    },

    "&:hover": {
      backgroundColor: "#000",
      color: "white",
    },

    "& div": {
      "@media (max-width:599px)": {
        margin: 0,
        display: "none",
      },
    },
  },
  img: {
    borderRadius: "12px",
    marginRight: 5,
    height: "24px !important",
    width: "24px !important",

    "&.green": {
      borderColor: "green",
    },

    "&.red": {
      borderColor: "red",
    },

    "@media (max-width:599px)": {
      marginRight: 0,
      height: "36px !important",
      width: "36px !important",
      borderRadius: "20px",
      border: "2px solid",
    },
  },
  logout: {
    position: "absolute",
    backgroundColor: "#e3e3e3",
    color: "black",
    width: "100%",
    height: "36px",
    lineHeight: "36px",
    padding: "0 18px",
    borderRadius: "18px",
    top: "40px",
    right: "0",
    cursor: "pointer",
    textAlign: "center",
    fontWeight: "600",

    "&:hover": {
      color: "white",
      backgroundColor: "#000",
    },

    [theme.breakpoints.down("xs")]: {
      width: "auto",
    },
  },
}));

export default ConnectAlgo;
