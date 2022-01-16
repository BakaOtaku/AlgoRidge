import React from "react";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { SwapHoriz } from "@material-ui/icons";

const SwitchIcon = ({ swapVertical, toggleForm, setToggleForm }) => {
  const classes = useStyles();
  return (
    <div
      className={`${classes.switchIcon} ${swapVertical && "vertical"} ${
        toggleForm && "rotate"
      }`}
      onClick={() => {
        toggleForm ? setToggleForm(false) : setToggleForm(true);
      }}
    >
      <SwapHoriz />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  switchIcon: {
    height: "40px",
    width: "40px",
    borderRadius: "20px",
    backgroundColor: "#555A9B",
    color: "#CDF0EA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s ease",
    cursor: "pointer",
    margin: "24px auto -6px auto",

    "&:hover": {
      opacity: 0.7,
    },

    "& svg": {
      transition: "0.3s ease",
    },

    "&.rotate": {
      "& svg": {
        transform: "rotate(180deg)",
        transition: "0.3s ease",
      },
    },

    "&.vertical": {
      "& svg": {
        transform: "rotate(90deg)",
      },

      "&.rotate": {
        "& svg": {
          transform: "rotate(270deg)",
        },
      },
    },
  },
}));

export default SwitchIcon;
