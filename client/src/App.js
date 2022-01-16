import React from 'react';
import { Switch, Route } from "react-router-dom";

import Home from './pages/Home';
import Bridge from './pages/Bridge';
import Liquidity from './pages/Liquidity';

const App = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/bridge" component={Bridge} />
        <Route exact path="/liquidity" component={Liquidity} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
