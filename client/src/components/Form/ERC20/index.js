import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

// components
import AvaToAlgo from "./AvaToAlgo";
import AlgoToAva from "./AlgoToAva";

const FormERC20 = () => {
  const classes = useStyles();

  const [toggleForm, setToggleForm] = useState(false);

  return (
    <div className={classes.cover}>
      {toggleForm ? (
        <AlgoToAva toggleForm={toggleForm} setToggleForm={setToggleForm} />
      ) : (
        <AvaToAlgo toggleForm={toggleForm} setToggleForm={setToggleForm} />
      )}
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
}));

export default FormERC20;
