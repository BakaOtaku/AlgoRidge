import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const Input = ({ type, placeholder, value, onChange, id, label }) => {
  const classes = useStyles();
  return (
    <div className={classes.input}>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        placeholder={placeholder && placeholder}
        value={value}
        onChange={onChange}
        id={id}
      />
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  button: {
    ...theme.overrides.formStyle.btnDarkMode,
  },
  input: {
    backgroundColor: "#0D121C",
    padding: '20px 15px 10px',
    marginBottom:'5px',
    "& label": {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#D1D2D4",
      display: "block",
      marginBottom: "12px",
    },

    "& input": {
      background: "transparent",
      fontSize: "16px",
      fontWeight: "600",
      color: "white",
      display: "block",
      border: 0,
      outline: "none",
      padding:0,
      width:'100%',
    },
  },
}));

export default Input;
