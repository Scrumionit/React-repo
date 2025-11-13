import { useState } from "react";
import {
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShortTextIcon from "@mui/icons-material/ShortText";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";

export default function UusiKysely() {
  const [kysymykset, setKysymykset] = useState([
    { kysymys: "", tyyppi: "", vaihtoehdot: [""] },
  ]);

  const lisaaKysymys = () => {
    setKysymykset((prev) => [
      ...prev,
      { kysymys: "", tyyppi: "", vaihtoehdot: [""] },
    ]);
  };

  const muutaKysymysTeksti = (i: number, arvo: string) => {
    const paivitetty = [...kysymykset];
    paivitetty[i].kysymys = arvo;
    setKysymykset(paivitetty);
  };

  const muutaKysymysTyyppi = (i: number, arvo: string) => {
    const paivitetty = [...kysymykset];
    paivitetty[i].tyyppi = arvo;

    // Tyhjennä vaihtoehdot jos ei monivalinta
    if (arvo !== "monivalinta") {
      paivitetty[i].vaihtoehdot = [];
    } else {
      if (paivitetty[i].vaihtoehdot.length === 0) {
        paivitetty[i].vaihtoehdot = [""];
      }
    }

    setKysymykset(paivitetty);
  };

  const muutaVaihtoehto = (qi: number, oi: number, arvo: string) => {
    const paivitetty = [...kysymykset];
    paivitetty[qi].vaihtoehdot[oi] = arvo;
    setKysymykset(paivitetty);
  };

  const lisaaVaihtoehto = (qi: number) => {
    const paivitetty = [...kysymykset];
    paivitetty[qi].vaihtoehdot.push("");
    setKysymykset(paivitetty);
  };

  const poistaVaihtoehto = (qi: number, oi: number) => {
    const paivitetty = [...kysymykset];
    paivitetty[qi].vaihtoehdot.splice(oi, 1);
    setKysymykset(paivitetty);
  };

  return (
    <div
      style={{
        width: "40vw",
        margin: "auto",
        paddingTop: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <IconButton
        component={NavLink}
        to="/kyselyt"
        sx={{
          backgroundColor: "#189bb8ff",
          color: "white",
          width: 45,
          height: 45,
          "&:hover": { backgroundColor: "#147a99" },
        }}
      >
        <ArrowBackIcon />
      </IconButton>

      <h2>Uusi kysely</h2>

      <TextField id="otsikko" label="Otsikko" />

      <TextField
        id="kuvaus"
        label="Kuvaus"
        multiline
        rows={6}
        fullWidth
        sx={{ maxWidth: 600 }}
      />
      <TextField
        id="alkamisajankohta"
        label="Alkamisajankohta"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />

      <TextField
        id="paattymisajankohta"
        label="Päättymisajankohta"
        type="datetime-local"
        InputLabelProps={{ shrink: true }}
        fullWidth
      />
      {kysymykset.map((k, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <TextField
            label={`Kysymys ${index + 1}`}
            value={k.kysymys}
            onChange={(e) => muutaKysymysTeksti(index, e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel id={`kysymys-tyyppi-${index}`}>
              Kysymyksen tyyppi
            </InputLabel>
            <Select
              labelId={`kysymys-tyyppi-${index}`}
              value={k.tyyppi}
              label="Kysymyksen tyyppi"
              onChange={(e) =>
                muutaKysymysTyyppi(index, e.target.value as string)
              }
            >
              <MenuItem value={"avoin"}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ShortTextIcon fontSize="small" />
                  Avoin
                </div>
              </MenuItem>

              <MenuItem value={"monivalinta"}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <FormatListBulletedIcon fontSize="small" />
                  Monivalinta
                </div>
              </MenuItem>
            </Select>
          </FormControl>

          {k.tyyppi === "monivalinta" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                marginLeft: 10,
              }}
            >
              <h4>Vaihtoehdot:</h4>
              {k.vaihtoehdot.map((vaihtoehto, oi) => (
                <div
                  key={oi}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <TextField
                    label={`Vaihtoehto ${oi + 1}`}
                    style={{ width: " 80%" }}
                    value={vaihtoehto}
                    onChange={(e) => muutaVaihtoehto(index, oi, e.target.value)}
                  />
                  <IconButton
                    onClick={() => poistaVaihtoehto(index, oi)}
                    size="small"
                  >
                    <DeleteIcon sx={{ color: "red" }} />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="outlined"
                onClick={() => lisaaVaihtoehto(index)}
                sx={{ width: "fit-content" }}
              >
                Lisää vaihtoehto
              </Button>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="contained"
        sx={{ backgroundColor: "#189bb8ff" }}
        onClick={lisaaKysymys}
      >
        Lisää kysymys
      </Button>

      <Button
        component={NavLink}
        to="/kyselyt"
        variant="contained"
        sx={{ backgroundColor: "#18b89e", marginTop: 3 }}
      >
        Tallenna kysely
      </Button>
    </div>
  );
}
