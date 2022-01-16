import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
// material ui
import { AppBar, Container } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
// components
import ConnectWallet from "./ConnectEth";
import ConnectAlgo from "./ConnectAlgo";

const Navbar = () => {
  const classes = useStyles();

  // to toggle the menu
  const [openMenu, setOpenMenu] = useState(false);
  const menuItemContainerRef = useRef(null);
  const toggleMenu = (state) => {
    state
      ? menuItemContainerRef.current.classList.add("open")
      : menuItemContainerRef.current.classList.remove("open");
    setOpenMenu(state);
  };

  return (
    <AppBar position="static" classes={{ root: classes.nav }}>
      <Container className={classes.container}>
        <div className={classes.flexContainer}>

          <NavLink to="/" style={{ display: "flex" }}>
            <img src="logo.svg" alt="logo" className={classes.logo} />
          </NavLink>

          <div className={classes.rightSec}>
            <div className={classes.menuItemContainer} ref={menuItemContainerRef}>
              <NavLink exact to="/bridge" className="menuItem active">Bridge</NavLink>
              <NavLink exact to="/liquidity" className="menuItem active">Liquidity</NavLink>
            </div>

            <div className={classes.walletConnects}>
              <ConnectWallet />
              <ConnectAlgo />
            </div>

            <MenuIcon
              className={classes.menuIcon}
              onClick={() => {
                openMenu ? toggleMenu(false) : toggleMenu(true);
              }}
            />
          </div>

        </div>
      </Container>
    </AppBar>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  nav: {
    height: "70px",
    boxShadow: "none",
    background: 'inherit',
    marginBottom: "40px",
    borderBottom: "1px solid",
    position: "relative",
  },
  flexContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    height: "40px",
    "@media (max-width:599px)": {
      height: "30px",
    },
  },
  rightSec: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    maxWidth: "500px",
    width: "100%",
    "@media (max-width:599px)": {
      maxWidth: 150,
      justifyContent: "flex-end",
    },
  },
  menuItemContainer: {
    "@media (max-width:599px)": {
      display: "flex",
      flexDirection: "column",
      position: "absolute",
      backgroundColor: "#292F3A",
      width: "100%",
      top: "70px",
      left: 0,
      padding: 0,
      height: 0,
      overflow: "hidden",
      transition: "all 0.5s ease",
    },

    "&.open": {
      padding: "20px 0",
      height: "auto",
      transition: "all 0.5s ease",
    },

    "& .menuItem": {
      marginRight: "30px",
      fontSize: "16px",
      textDecoration: "none",
      lineHeight: "36px",
      fontFamily: 'Inter,sans-serif',
      fontWeight: 400,

      "&.active": {
        color: "#fff",
      },

      "&:hover": {
        textDecoration: "underline",
      },

      "@media (max-width:599px)": {
        margin: 0,
        color: "black",
        textAlign: "center",
        lineHeight: "50px",
      },
    },
  },
  walletConnects: {
    maxWidth: "300px",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  },
  menuIcon: {
    display: "none",
    "@media (max-width:599px)": {
      display: "block",
      // color: "white",
      marginLeft: "20px",
      marginTop: "6px",
    },
  },
}));

export default Navbar;