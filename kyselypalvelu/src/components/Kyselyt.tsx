import { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import type { GridRowParams } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { KyselyTyyppi } from "../types";
import { Link } from "react-router-dom";

export default function Kyselylista() {
  const [kyselyt, setKyselyt] = useState<KyselyTyyppi[]>([]);

  useEffect(() => {
    fetchKyselyt();
  }, []);

  const fetchKyselyt = () => {
    fetch("http://127.0.0.1:8080/api") // selvitetään backendistä kun valmis
      .then((vastaus) => {
        if (!vastaus.ok) {
          throw new Error("Virhe hakiessa kyselyjä: " + vastaus.statusText);
        }
        return vastaus.json();
      })
      .then((data) => {
        setKyselyt(data._embedded.kyselyt); // selvitetään backendistä kun valmis
      })
      .catch((virhe) => console.error(virhe));
  };

  const sarakkeet: GridColDef[] = [
    {
      field: "otsikko",
      headerName: "Otsikko",
    },

    {
      field: "kuvaus",
      headerName: "Kuvaus",
    },

    {
      field: "alkuaika",
      headerName: "Alkamisajankohta",
    },

    {
      field: "loppuaika",
      headerName: "Päättymisajankohta",
    },

    {
      field: "actions",
      type: "actions",
      headerName: "Muokkaa ",
      getActions: (params: GridRowParams) => [],
    },
  ];

  return (
    <>
      <div style={{ height: 600, width: "fit-content", margin: "auto" }}>
        <DataGrid rows={kyselyt} columns={sarakkeet} />
        <Button
          key="open"
          variant="contained"
          size="small"
          component={Link}
          to={`/kysely`} // ✅ dynamic route
        >
          Uusi kysely
        </Button>
        ,
      </div>
    </>
  );
}
