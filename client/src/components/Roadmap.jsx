import React from 'react';
import { makeStyles } from "@material-ui/core/styles";

const Roadmap = () => {
  const classes = useStyles();

  return (
    <div className={classes.rules}>
      <h1>Roadmap</h1>
      <em>Our future plans for this project</em>
      <div className={classes.rulesList}>
        <div className={classes.rulesListOne}>
          <div className={classes.rulesListOneNum}>1</div>
          <img src="img/chainlink.svg" alt="chainlink" className={classes.rulesListOneLogo} />
          <p>Integration with Chainlink as a decentralized oracle provider to get price feed while bridging Algorand Avalanche.</p>
        </div>

        <div className={classes.rulesListOne}>
          <div className={classes.rulesListOneNum}>2</div>
          <img src="img/stable.svg" alt="stable" className={classes.rulesListOneLogo} />
          <p>Implement bridge transfer for stable coins like USDT and USDC between Algorand and Avalanche.</p>
        </div>

        <div className={classes.rulesListOne}>
          <div className={classes.rulesListOneNum}>3</div>
          <img src="img/terra.svg" alt="terra" className={classes.rulesListOneLogo} />
          <p>Create Cosmwasm contracts and interaction with band protocol to implement UST bridge between Algorand and Terra.</p>
        </div>
      </div>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.mui,
  ...theme.overrides.formStyle,
  rules: {
    fontSize: 18,
    color: "#fff",
    maxWidth: 1080,
    margin: 'auto',
    marginBottom: 20
  },
  rulesList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    margin: '20px 0',
    fontSize: 16,
    marginTop: 40,


    "@media (max-width:800px)": {
      gridTemplateColumns: '1fr',
    },
  },
  rulesListOne: {
    // backgroundColor: '#EDF1F2',
    borderTop: '1px solid #292929',
    padding: '30px 10px',
    textAlign: 'center',
    position: 'relative',
  },
  rulesListOneNum: {
    position: 'absolute',
    width: 32,
    height: 32,
    top: -16,
    padding: 3,
    left: 'calc(50% - 16px)',
    background: '#555A9B',
    borderRadius: '50%',
    border: '1px solid #E1E8EE',
  },
  rulesListOneLogo: {
    height: 120,
  },
}));


export default Roadmap;
