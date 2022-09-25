import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import algosdk from "algosdk";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";

const Container = styled.div`
  z-index: 2;
  margin:10px;
  position: fixed;
  bottom: 30px;
  right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const StyledButton = styled.button`
  height: 40px;
  width: 200px;
  border-radius:5px;
  border: none;
  color: white;
  background-color:black;
  font-size: medium;
  font-weight: 600;
  cursor: pointer;
`;


const StickyNotes = () => {
  const wurl = window.location.href;
  const [isAmazon, setIsAmazon] = useState(false)
  const [purl, setUrl] = useState("")
  const [acc, setAcc] = useState([])

  const [wall, setWall] = useState(false)

  useEffect(() => {
    if (wurl.includes("https://www.amazon.in/gp/buy/")) {
      setIsAmazon(true)
    }
  }, [wurl]);


  const connector = new WalletConnect({
    bridge: "https://bridge.walletconnect.org", // Required
    qrcodeModal: QRCodeModal,
  });

  useEffect(() => {
    if (wall) {

      if (!connector.connected) {
        // create new session
        connector.createSession();
      } else {
        const { accounts } = connector;
        setAcc(accounts)
        console.log(accounts)
      }

      // Subscribe to connection events
      connector.on("connect", (error, payload) => {
        if (error) {
          throw error;
        }

        // Get provided accounts
        const { accounts } = payload.params[0];
        console.log(accounts)
        setAcc(accounts)
      });

      connector.on("session_update", (error, payload) => {
        if (error) {
          throw error;
        }

        // Get updated accounts 
        const { accounts } = payload.params[0];
        console.log("hello", accounts)
      });

      connector.on("disconnect", (error, payload) => {
        if (error) {
          throw error;
        }
      });
    }

  }, [wall])

  const makeTrans = async () => {
    if (acc.length > 0 && connector.connected) {

      console.log("325235436234")
      const suggestedParams = await new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "").getTransactionParams().do();
      const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: acc[0],
        to: "3NOXG4F3X6JC7EZDU7WNII437AGE6EEFOYCGCHXOB2VURBMQFD6EMWV2SA",
        amount: 1000000,
        suggestedParams,

      });
      console.log(txn)
      const txns = [txn]
      const txnsToSign = txns.map((txn) => {
        const encodedTxn = Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64");
        return {
          txn: encodedTxn,
          message: 'Description of transaction being signed',
          // Note: if the transaction does not need to be signed (because it's part of an atomic group
          // that will be signed by another party), specify an empty singers array like so:
          // signers: [],
        };
      });

      const requestParams = [txnsToSign];

      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      const result = await connector.sendCustomRequest(request);
      const decodedResult = result.map(element => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
      });
      console.log(decodedResult)

      const { txId } = await new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
        .sendRawTransaction(decodedResult)
        .do();
      const client = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
      let lastStatus = await client.status().do();
      let lastRound = lastStatus["last-round"];
      while (true) {
        const status = await client.pendingTransactionInformation(txId).do();
        if (status["pool-error"]) {
          throw new Error(`Transaction Pool Error: ${status["pool-error"]}`);
        }
        if (status["confirmed-round"]) {
          return status["confirmed-round"];
        }
        lastStatus = await client.statusAfterBlock(lastRound + 1).do();
        lastRound = lastStatus["last-round"];
      }
    }
  }

  const payWithSol = () => {
    setWall(true)
    // const pay = document.getElementsByClassName("grand-total-price")[0]?.textContent
    // let totalSol;
    // if (pay) {
    //   const buy = pay.match(/(\d+)/);
    //   totalSol = parseFloat(buy[0]) * SOLTOINR
    //   console.log("Total Amount to pay by SOL:", buy[0])
    // } else {
    //   totalSol = 0.2
    // }

    // const recipient = new PublicKey('ANvyeaT7Ff5tzHwFikZ5Yoqj3rFNzj8jwjtQzmZus7Cy');
    // const amount = new BigNumber(totalSol);
    // const reference = new Keypair().publicKey;
    // setReference(reference)
    // const label = 'Amazon payment';
    // const message = 'Pay with Sol on Amazon';
    // const memo = '#273HDT4H';
    // const url = encodeURL({ recipient, amount, reference, label, message, memo });

    // const canvas = document.getElementById("canvas");


    // ALQRCode.toCanvas(
    //   canvas,
    //   {
    //     wallet: "MK7VI35QRIJOD27AUBR5XKXOJJCAZMNSQGMA64DKGXLR6LX4PLO33OHV6E",
    //     amount: 1 * 0.25
    //   },
    //   function (error) {
    //     if (error) console.error(error);
    //     console.log("success!");
    //   }
    // );

    // setUrl("gsfdgd")
  }

  return (
    <>
      {isAmazon &&
        <Container>
          {/* {signature !== null && <><h1 style={{ margin: 0 }}>&#10004;</h1><h3>Success</h3></>} */}
          <canvas id="canvas"></canvas>
          {/* {purl === "" && <StyledButton onClick={payWithSol}>Pay with ALGO</StyledButton>} */}
          {purl === "" && <StyledButton onClick={payWithSol}>Connect To Wallet</StyledButton>}
          {acc.length > 0 && <StyledButton onClick={makeTrans}>Pay with ALGO</StyledButton>}
          {/* {!signature && <QRCode url={purl} />} */}
        </Container>
      }
    </>
  );
};

export default StickyNotes;