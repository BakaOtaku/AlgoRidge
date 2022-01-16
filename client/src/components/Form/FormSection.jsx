import React, { useState } from "react";
import { Container, Grid, Tab, Tabs } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { TabPanel, TabContext } from "@material-ui/lab";

import FormERC20 from "./ERC20/index";
// import Liquidity from "../Liquidity/index";

const FormSection = ({ label }) => {
  const classes = useStyles();

  const [value, setValue] = useState(1);

  const handleTabs = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.formSection}>
      <Container className={classes.container}>
        <Grid container spacing={3} justify="center">
          <Grid item xs={12} sm={8} md={6}>
            <div className={classes.outerFormContainer}>
              <TabContext value={value}>
                <Tabs
                  value={value}
                  onChange={handleTabs}
                  className={classes.tabBar}
                  indicatorColor="primary"
                  TabIndicatorProps={{ style: { height: "5px" } }}>
                  <Tab
                    label={label}
                    className={classes.tab}
                    value={1}
                  />
                </Tabs>

                <TabPanel value={1} style={{ padding: "0" }}>
                  {/* {label === "ERC20 Transfer" ? <FormERC20 /> : <Liquidity />} */}
                  <FormERC20 />
                </TabPanel>
              </TabContext>
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  formSection: {
    // backgroundColor: "#F4F7F9",
    padding: "30px 0 90px",

    [theme.breakpoints.down("xs")]: {
      paddingBottom: '50px',
      backgroundImage: 'none',
    }
  },

  //   for outer form container
  outerFormContainer: {
    backgroundColor: "#191F2A",
    minHeight: "200px",
    filter: "drop-shadow(0px 2px 24px rgba(0, 0, 0, 0.1))",
    position: "relative",
    // top: "-70px",
    zIndex: 1,
    borderRadius: "16px",
    overflow: "hidden",

    [theme.breakpoints.down("xs")]: {
      borderRadius: '8px',
    }
  },
  tabBar: {
    backgroundColor: "#191F2A",
    height: "70px",
    borderBottom: "1px solid rgba(130,71,229,0.4)",
    display: "flex",
    padding: "0 26px",

    [theme.breakpoints.down("xs")]: {
      padding: "0 14px",
    }
  },

  //   for tab bar
  tab: {
    marginRight: "20px",
    color: "#fff",
    lineHeight: "70px",
    fontWeight: "500",
    cursor: "pointer",
    fontSize: "16px",
    textTransform: "none",
    padding: "0",
    minWidth: "auto",

    "&:hover": {
      color: "#fff",
    },
  },

  //   for switch bar
  switchBar: {
    backgroundColor: "#fff",
    height: "70px",
    borderBottom: "1px solid #E8E8E8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 26px",
    transition: "0.3s ease",

    "& .active": {
      fontSize: "20px",
      transition: "0.3s ease",
    },

    "& .inactive": {
      fontSize: "13px",
      color: "#6E798F",
      transition: "0.3s ease",

      "&:hover": {
        color: "#000000",
        transition: "0.3s ease",
      },
    },

    "& h3": {
      fontSize: "20px",
      maxWidth: "200px",
      // backgroundColor: "red",
      cursor: "pointer",
      width: "35%",

      "&:nth-of-type(2)": {
        textAlign: "right",
      },
    },
  },
  switchIcon: {
    height: "40px",
    width: "40px",
    borderRadius: "20px",
    backgroundColor: "rgba(117, 51, 226, 0.1)",
    color: "#7533E2",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "0.3s ease",
    cursor: "pointer",

    "& svg": {
      transition: "0.3s ease",
    },

    "&.rotate": {
      "& svg": {
        transform: "rotateZ(180deg)",
        transition: "0.3s ease",
      },
    },
  },

  flexV: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    position: "relative",
    top: "-70px",
    left: "0",
  },
}));

export default FormSection;
