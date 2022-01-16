import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import mainBg from "../images/northern-lights-bg.png";

const Bridge = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  bgCover: {
    backgroundColor: "#0D121C",
    backgroundImage: `url(${mainBg})`,
    backgroundSize: "cover",
  },
}));

export default Bridge;
