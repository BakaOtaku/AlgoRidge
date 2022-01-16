import React, { useCallback, useContext, useState } from 'react';
import algosdk from "algosdk";
import MyAlgoConnect from '@randlabs/myalgo-connect';

export const AlgoContext = React.createContext({});
export const useAlgoContext = () => useContext(AlgoContext);
// algosdk client init
const baseServer = 'https://testnet-algorand.api.purestake.io/ps2'
const token = {
  'X-API-Key': 'bUemI5ZIty4XI3s7hxZ785dUdxvWhV9wJXOySBK8'
}
const algodClient = new algosdk.Algodv2(token, baseServer, "");
const appId = 59547068;
const myAlgoConnect = new MyAlgoConnect();

export const AlgoProvider = ({ children }) => {
  const [algoAddress, setAlgoAddress] = useState('');

  const connectAlgo = useCallback(async () => {
    try {
      console.log("connecting myalgo..")
      const mac = await myAlgoConnect.connect();
      const senderAddress = await mac[0].address;
      console.log(mac);
      setAlgoAddress(senderAddress);
    } catch (error) {
      console.error(error);
    };
  }, []);

  const disconnect = useCallback(async () => {
    setAlgoAddress('');
  }, []);

  return (
    <AlgoContext.Provider
      value={{
        appId,
        algodClient,
        myAlgoConnect,
        connectAlgo,
        disconnect,
        algoAddress,
      }}
    >
      {children}
    </AlgoContext.Provider>
  );
};