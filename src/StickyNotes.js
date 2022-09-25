/* global chrome */
import React, { useEffect useState } from "react";
import styled from "styled-components";
import "./App.css";
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


const StickyNotes = () => {
  const wurl = window.location.href;
  const [isAmazon, setIsAmazon] = useState(true)
  const [purl, setUrl] = useState("")

  useEffect(() => {
    if (wurl.includes("https://www.amazon.in/gp/buy/")) {
      setIsAmazon(true)
    }
  }, [wurl]);


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
        {/* {signature !== null && <><h1 style={{ margin: 0 }}>&#10004;</h1><h3>Success</h3></>} */}
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