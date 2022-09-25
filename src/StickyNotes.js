/* global chrome */
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";
import "./App.css";

import { localMode } from "./constants";
import { Cluster, clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { encodeURL, createQR, createQROptions, findTransactionSignature, findReference } from '@solana/pay';
import QRCodeStyling from "@solana/qr-code-styling";
import BigNumber from 'bignumber.js';
import * as ALQRCode from "algorand-qrcode";

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


const SOLTOINR = 0.00025

const StickyNotes = () => {
  const wurl = window.location.href;
  const [isAmazon, setIsAmazon] = useState(true)
  const [purl, setUrl] = useState("")
  const [solConnection, setSolConnection] = useState()
  const [reference, setReference] = useState()
  const [signature, setSignature] = useState(null)
  useEffect(() => {
    if (wurl.includes("https://www.amazon.in/gp/buy/")) {
      setIsAmazon(true)
    }
  }, [wurl]);

  useEffect(() => {
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    setSolConnection(connection)
  }, [])

  useEffect(() => {
    if (signature !== null) {
      const inp = document.getElementsByClassName("pmts-claim-code")
      const input = inp[0]
      input.setAttribute('value', 'JKR7-VF67MF-6UDV');
      setTimeout(() => {
        const coup = document.getElementsByName("ppw-claimCodeApplyPressed")
        coup[0].click()
      }, 500)

    }
  }, [signature])

  useEffect(() => {
    if (signature !== null) return;
    let changed = false;

    const interval = setInterval(async () => {
      let ssignature
      try {
        ssignature = await findReference(solConnection, reference, { finality: 'confirmed' });
        if (!changed) {
          clearInterval(interval);
          setSignature(ssignature.signature);
          //   navigate("/confirmed", { replace: true });
        }
      } catch (error) {
        // If the RPC node doesn't have the transaction signature yet, try again
        if (!(error)) {
          console.error(error);
        }
      }
    }, 250);

    return () => {
      changed = true;
      clearInterval(interval);
    };
  }, [reference, signature, solConnection]);

  const payWithSol = () => {
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

    const canvas = document.getElementById("canvas");


    ALQRCode.toCanvas(
      canvas,
      {
        wallet: "MK7VI35QRIJOD27AUBR5XKXOJJCAZMNSQGMA64DKGXLR6LX4PLO33OHV6E",
        amount: 1 * 0.25
      },
      function (error) {
        if (error) console.error(error);
        console.log("success!");
      }
    );

    setUrl("gsfdgd")
  }

  return (
    <>
      {/* {isAmazon && */}
      <Container>
        {signature !== null && <><h1 style={{ margin: 0 }}>&#10004;</h1><h3>Success</h3></>}
        <canvas id="canvas"></canvas>
        {/* {purl === "" && <StyledButton onClick={payWithSol}>Pay with ALGO</StyledButton>} */}
        {purl === "" && <StyledButton onClick={payWithSol}>Pay with ALGO</StyledButton>}
        {/* {!signature && <QRCode url={purl} />} */}
      </Container>
      {/* } */}
    </>
  );
};

export default StickyNotes;


const QRCode = ({ url }) => {
  const MIN_WIDTH = 200;
  const [size, setSize] = useState(() =>
    typeof window === "undefined"
      ? MIN_WIDTH
      : Math.min(window.screen.availWidth, MIN_WIDTH),
  );
  useLayoutEffect(() => {
    const listener = () =>
      setSize(Math.min(window.screen.availWidth, MIN_WIDTH));

    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  const options = useMemo(
    () => createQROptions(url, size, "transparent",),
    [url, size],
  );

  const qr = useMemo(() => new QRCodeStyling(), []);
  useLayoutEffect(() => qr.update(options), [qr, options]);

  const ref = useRef(null);
  useLayoutEffect(() => {
    if (ref.current) {
      qr.append(ref.current);
    }
  }, [ref, qr]);

  return <div ref={ref} className="flex w-full justify-center" />;
};