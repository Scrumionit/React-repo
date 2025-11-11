/*import React, { useState } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function UusiKysely() {
  const [kysymykset, setKysymykset] = useState([""]);
  const handleLisaaKysymys = () => {
    setKysymykset((prev) => [...prev, ""]); // add empty field
  };
  const handleChange = (index: number, value: string) => {
    const updated = [...kysymykset];
    updated[index] = value;
    setKysymykset(updated);
  };

  return (
    <>
      <div
        style={{
          height: 600,
          width: "fit-content",
          margin: "auto",
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h2>Uusi kysely</h2>
        <TextField
          id="otsikko"
          label="Otsikko"
          style={{ width: "fit-content" }}
        />
        <FormControl fullWidth>
          <InputLabel id="kysymyksen-tyyppi-label">Kyselyn tyyppi</InputLabel>
          <Select
            labelId="kysymyksen-tyyppi-label"
            id="kysymyksen-tyyppi"
            //value={age}
            label="Age"
          //onChange={handleChange}
          >
            <MenuItem value={"avoin"}>Avoin</MenuItem>
            <MenuItem value={"monivalinta"}>Monivalinta</MenuItem>
          </Select>
        </FormControl>
        <TextField
          id="kuvaus"
          label="Kuvaus"
          style={{ width: "fit-content" }}
        />
        {kysymykset.map((q, index) => (
          <TextField
            id="kysymys"
            key={index}
            label={`Kysymys ${index + 1}`}
            value={q}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
        <Button
          variant="contained"
          sx={{ backgroundColor: "#189bb8ff", marginTop: 4 }}
          onClick={handleLisaaKysymys}
        >
          Lisää kysymys
        </Button>

        <br />
        <Button component={NavLink} to="/kyselyt"
          variant="contained"
          sx={{ backgroundColor: "#18b89e", marginTop: 2 }}
        >
          Tallenna kysely
        </Button>

      </div>
    </>
  );
}
*/

import React, { useState } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { NavLink } from "react-router-dom";

export default function UusiKysely() {
  const [kysymykset, setKysymykset] = useState([{ text: "", type: "" }]);

  const handleLisaaKysymys = () => {
    setKysymykset((prev) => [...prev, { text: "", type: "" }]);
  };

  const handleTextChange = (index: number, value: string) => {
    const updated = [...kysymykset];
    updated[index].text = value;
    setKysymykset(updated);
  };

  const handleTypeChange = (index: number, value: string) => {
    const updated = [...kysymykset];
    updated[index].type = value;
    setKysymykset(updated);
  };

  return (
    <>
      <div
        style={{
          height: 600,
          width: "fit-content",
          margin: "auto",
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h2>Uusi kysely</h2>

        <TextField
          id="otsikko"
          label="Otsikko"
          style={{ width: "fit-content" }}
        />

        <TextField
          id="kuvaus"
          label="Kuvaus"
          style={{ width: "fit-content" }}
        />

        {kysymykset.map((q, index) => (
          <div
            key={index}
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <TextField
              label={`Kysymys ${index + 1}`}
              value={q.text}
              onChange={(e) => handleTextChange(index, e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel id={`kysymys-tyyppi-${index}`}>
                Kysymyksen tyyppi
              </InputLabel>
              <Select
                labelId={`kysymys-tyyppi-${index}`}
                value={q.type}
                label="Kysymyksen tyyppi"
                onChange={(e) =>
                  handleTypeChange(index, e.target.value as string)
                }
              >
                <MenuItem value={"avoin"}>Avoin</MenuItem>
                <MenuItem value={"monivalinta"}>Monivalinta</MenuItem>
              </Select>
            </FormControl>
          </div>
        ))}

        <Button
          variant="contained"
          sx={{ backgroundColor: "#189bb8ff", marginTop: 4 }}
          onClick={handleLisaaKysymys}
        >
          Lisää kysymys
        </Button>

        <br />

        <Button
          component={NavLink}
          to="/kyselyt"
          variant="contained"
          sx={{ backgroundColor: "#18b89e", marginTop: 2 }}
        >
          Tallenna kysely
        </Button>
      </div>
    </>
  );
}
