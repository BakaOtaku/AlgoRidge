import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../components/Navbar";
import FormSection from "../components/Liquidity/FormSection";
import Footer from "../components/Footer";
import mainBg from "../images/northern-lights-bg.png";

const Liquidity = () => {
  const classes = useStyles();

  return (
    <div className={classes.bgCover}>
      <Navbar />
      <FormSection />
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

export default Liquidity;
