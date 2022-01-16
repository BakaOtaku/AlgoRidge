import React from "react";
import { NavLink } from "react-router-dom";

import { Container, Typography, Grid, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Roadmap from "./Roadmap";

const Details = () => {
  const classes = useStyles();

  return (
    <section className={classes.details}>
      <Container className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={7}>
            <Typography variant="h1" className={classes.title}>
              AlgoRidge
            </Typography>
            <Typography variant="subtitle1" className={classes.text}>
              Cross Chain Oracle based bridge for asset transfers between Avalanche and Algorand.
            </Typography>

            <div className={classes.btnContainer}>
              <NavLink to="/bridge" style={{ display: "flex", textDecoration: 'none' }}>
                <Button type="submit" className={`${classes.btn} ${classes.filled}`}>
                  Bridge Assets
                </Button>
              </NavLink>
              <NavLink to="/liquidity" style={{ display: "flex", textDecoration: 'none' }}>
                <Button type="submit" className={`${classes.btn}`}>
                  Add Liquidity
                </Button>
              </NavLink>
            </div>
          </Grid>

          <Grid item xs={12} sm={5}>
            <div className={classes.graphicContainer}>
              <img src="logo.svg" alt="graphic" className={classes.graphic} />
            </div>
          </Grid>
        </Grid>
        <Roadmap />
      </Container>

    </section>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  details: {
    minHeight: "70vh",
    padding: "70px 0",
    position: "relative",
    overflow: "hidden",

    "@media (max-width:959px)": {
      paddingBottom: "120px",
    },
  },
  title: {
    marginBottom: 20,
    fontSize: 70,
    fontWeight: "700",
    background: "linear-gradient(90deg, #12ECB8 -2.21%, #00B4ED 92.02%)",
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
  text: {
    fontSize: 22,
    fontWeight: "400",
    color: "#BDC2FF",
    fontFamily: 'Inter,sans-serif',
    lineHeight: 1.4,
    marginBottom: 40,
  },
  graphicContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  graphic: {
    width: "94%",
    "@media (max-width:959px)": {
      float: "none",
    },
    "@media (max-width:599px)": {
      display: "block",
      margin: "auto",
    },
    "@media (max-width:340px)": {
      display: "block",
      margin: "auto",
    },
  },
  // button
  btnContainer: {
    display: "flex",
    margin: "30px auto",
    zIndex: 10
  },
  btn: {
    height: "44px",
    lineHeight: "44px",
    padding: "10px 20px",
    border: "1px solid #BDC2FF",
    borderRadius: "4px",
    fontFamily: 'Inter,sans-serif',
    display: "inline-flex",
    textTransform: 'inherit',
    fontWeight: 400,
    fontSize: 16,
    position: "relative",
    color: "#fff",

    "&:first-child": {
      marginRight: "14px",
    },
    "&:hover": {
      backgroundColor: "inherit"
    },
  },
  filled: {
    background: "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",

    "&:hover": {
      background: "linear-gradient(90deg, #0063FF -2.21%, #9100FF 89.35%)",
    },
  },
}));

export default Details;
