import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { Kysely } from "../types";
import { Link, NavLink } from "react-router-dom";

export default function Kyselylista() {
  const [kyselyt, setKyselyt] = useState<Kysely[]>([]);

  useEffect(() => {
    fetchKyselyt();
  }, []);

  const fetchKyselyt = () => {
    fetch("http://127.0.0.1:8080/api/kyselyt") // paikallinen testi
    // fetch("https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt") // rahtiversio
      .then((vastaus) => {
        if (!vastaus.ok) {
          throw new Error("Virhe hakiessa kyselyjä: " + vastaus.statusText);
        }
        return vastaus.json();
      })
      .then((data) => {
        setKyselyt(data); // backend returns a plain list
      })
      .catch((virhe) => console.error(virhe));
  };

  const sarakkeet: GridColDef[] = [
    {
      field: "nimi",
      headerName: "Nimi",
      minWidth: 220,
      flex: 1,
    },

    {
      field: "kuvaus",
      headerName: "Kuvaus",
      minWidth: 250,
      flex: 2,
    },

    {
      field: "alkupvm",
      headerName: "Alkamisajankohta",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "loppupvm",
      headerName: "Päättymisajankohta",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "vastaa",
      headerName: "",
      minWidth: 190,
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            component={Link}
            to={`/kyselyt/${params.row.kysely_id}`}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#189bb8ff", marginLeft: 1, marginRight: 1 }}
          >
            Vastaa kyselyyn
          </Button>
        </>
      ),
    },

    {
      field: "tulosraportti",
      headerName: "",
      minWidth: 190,
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      align: "center",
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            component={Link}
            to={`/tulosraportti/${params.row.kysely_id}`}
            variant="contained"
            size="small"
            sx={{ backgroundColor: "#189bb8ff", marginLeft: 1, marginRight: 1}}
          >
            Avaa raportti
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: 600, width: "85%", margin: "auto", textAlign: "center" }}>

        <Button component={NavLink} to="/uusikysely" variant="contained" sx={{ backgroundColor: "#18b89e", marginBottom: 3 }}>
          Luo uusi kysely
        </Button>

        <DataGrid rows={kyselyt} columns={sarakkeet} getRowId={(row) => row.kysely_id} getRowHeight={() => 'auto'} rowSelection={false}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              lineHeight: '1.4rem',
              alignItems: 'flex-start',
              padding: '12px 14px',
            },
          }} />
      </div>
    </>
  );
}
