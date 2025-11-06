import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import type { KyselyTyyppi } from "../types";
import { Link, NavLink } from "react-router-dom";

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
      field: "nimi",
      headerName: "Nimi",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "kuvaus",
      headerName: "Kuvaus",
      minWidth: 200,
      flex: 2,
    },

    {
      field: "alkupvm",
      type: "date",
      headerName: "Alkamisajankohta",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "loppupvm",
      type: "date",
      headerName: "Päättymisajankohta",
      minWidth: 150,
      flex: 1,
    },

    {
      field: "_links.self.href",
      headerName: "",
      minWidth: 150,
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <Button
            component={Link}
            to={`/kysely}/${params.id}`}
            variant="contained"
            sx={{ backgroundColor: "#0079c2", marginRight: 1 }}
          >
            Avaa
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ height: 600, width: "70%", margin: "auto", textAlign: "center" }}>

        <Button component={NavLink} to="/uusikysely" variant="contained" sx={{ backgroundColor: "#18b89e", marginBottom: 3 }}>
          Luo uusi kysely
        </Button>

        <DataGrid rows={kyselyt} columns={sarakkeet} getRowId={row => row._links.self.href} getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': {
              whiteSpace: 'normal',
              wordWrap: 'break-word',
              lineHeight: '1.4rem',
              alignItems: 'flex-start',
            },
          }} />
      </div>
    </>
  );
}
