import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// images
import avaxIcon from "../../images/avax.png";
import algoIcon from "../../images/algo.png";

const TokenInput = ({ editable, name, chain, value, onChange, noChain }) => {
  const classes = useStyles();
  // console.log(noChain);
  if (noChain) {
    return (
      <>
        <div className={classes.tokenInputContainer}>
          <input
            type="number"
            value={value}
            onChange={onChange}
            required
            placeholder="0.0"
            name={name}
            id={name}
            onWheel={(event) => event.currentTarget.blur()}
          />
        </div>
      </>
    )
  }

  return (
    <>
      <div className={classes.tokenInputContainer}>
        {editable ? (
          <input
            type="number"
            value={value}
            onChange={onChange}
            required
            placeholder={chain === "avalanche" ? "0.0 xAlgo" : "0.0 Algo"}
            name={name}
            id={name}
            onWheel={(event) => event.currentTarget.blur()}
          />
        ) : (
          <input
            type="number"
            value={value}
            onChange={onChange}
            readOnly
            placeholder={chain === "avalanche" ? "0.0 xAlgo" : "0.0 Algo"}
            name={name}
            id={name}
          />
        )}
        <div className={classes.chainIndicator}>
          <div className="block">
            <div
              className="chain-icon"
              style={{
                backgroundImage: `url(${chain === "avalanche" ? avaxIcon : algoIcon
                  })`,
              }}
            ></div>
            <p className="chain-name">
              on {chain === "avalanche" ? "Avalanche" : "Algorand"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  tokenInputContainer: {
    width: "100%",
    backgroundColor: "#0D121C",
    borderRadius: "6px",
    padding: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",

    "& input": {
      width: "100%",
      border: 0,
      outline: 0,
      backgroundColor: "transparent",
      fontSize: "20px",
      fontWeight: "700",
      color: "white",
      paddingLeft: "5px",
      textAlign: "left",
      lineHeight: "40px",

      //   hide arrows
      "-moz-appearance": "textfield",

      "&::-webkit-outer-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
      "&::-webkit-inner-spin-button": {
        "-webkit-appearance": "none",
        margin: 0,
      },
    },

    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",

      "& input": {
        //  backgroundColor:'#191F2A',
        border: "1px solid #292F3A",
        padding: "0 10px",
        borderRadius: "5px",
        marginBottom: "10px",
        fontSize: "16px",
        height: "42px",
        lineHeight: "42px",
      },
    },
  },

  chainIndicator: {
    "& .block": {
      display: "flex",
      padding: "6px 10px",
      borderRadius: "5px",
      backgroundColor: "#292F3A",

      "& .chain-icon": {
        width: "30px",
        height: "30px",
        borderRadius: "15px",
        marginRight: "10px",
        backgroundSize: "cover",
      },

      "& .chain-name": {
        fontSize: "16px",
        fontWeight: "600",
        color: "white",
        margin: 0,
        lineHeight: "30px",
        whiteSpace: "nowrap",
      },
    },
  },
}));

export default TokenInput;
