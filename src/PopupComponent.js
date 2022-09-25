/* global chrome */
import React, { useState, useEffect } from "react";
import styled from "styled-components";

import { localMode } from "./constants";

// const sampleNotesShape = { "someUrl": [{ note: "some text", x: 100, y: 100 }] };

const ListNoMarker = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const UrlP = styled.p`
  background: papayawhip;
  margin: 0.5em;
  padding: 0.5em;
  overflow: scroll;
`;

const UrlEntry = ({ entry }) => {
  const [open, setOpen] = useState(false);
  const url = entry[0];
  const notes = entry[1];

  return (
    <li onClick={() => setOpen(!open)}>
      <UrlP>
        <b>{url}</b>
      </UrlP>
      {notes && (
        <ul style={open ? { display: "inherit" } : { display: "none" }}>
          {notes.map((note) => (
            <li>{note.note}</li>
          ))}
        </ul>
      )}
    </li>
  );
};

export const PopupComponent = () => {
  const [notes, setNotes] = useState([]);

  // get notes to display in popup.html
  useEffect(() => {
    if (!localMode) {
      chrome.storage.local.get((items) => {
        setNotes(items);
      });
    }
  }, []);

  const handleUpdateValue = () => {
    const pay = document.getElementsByTagName("td")[6].textContent
    const buy = pay.match(/(\d+)/);

    console.log("Total Amount to pay by ASOL:", buy[0])

    const input = document.getElementById("pp-kj4BWa-123")
    input.value = "sadkdf-gsadg-hdsag-dsgsad"

    const coup = document.getElementsByName("ppw-claimCodeApplyPressed")

    coup[0].click()
    console.log("Done....")
  }

  return (
    <div>
      <h3>Hello from sticky notes!</h3>
      <p>
        Press{" "}
        <strong>
          <i>Shift</i>
        </strong>
        + click to make a new note.
      </p>
      <h4>Your notes:</h4>
      <button onClick={handleUpdateValue}>ADD VALUE</button>
      {notes && (
        <ListNoMarker>
          {Object.entries(notes).map((entry) => (
            <UrlEntry entry={entry} />
          ))}
        </ListNoMarker>
      )}
    </div>
  );
};
