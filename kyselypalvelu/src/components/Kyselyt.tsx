import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import type { Kysely } from "../types";
import { Link } from "react-router-dom";

export default function Kyselyt() {
  const [kyselyt, setKyselyt] = useState<Kysely[]>([]);

  useEffect(() => {
    fetchKyselyt();
  }, []);

  // Hakee kaikki kyselyt backendistä
  const fetchKyselyt = () => {
    fetch("https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt")
    //fetch("http://127.0.0.1:8080/api/kyselyt") // lokaalisti testatessa
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

  // Määrittelee sarakkeet DataGrid-komponentille
  const sarakkeet: GridColDef[] = [
    {
      field: "nimi",
      headerName: "Nimi",
      minWidth: 180,
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

    // Tilasarake (Tulossa / Aktiivinen / Päättynyt)
    {
      field: "tila",
      headerName: "Tila",
      minWidth: 120,
      flex: 0.6,
      sortable: false,
      filterable: false,
      hideable: false,
      align: "center",
      headerAlign: "center",
      
      // Määrittelee solun sisällön dynaamisesti päivämäärien perusteella
      // Näyttää "Tulossa", "Aktiivinen" tai "Päättynyt" -lipun Chip-komponentilla
      renderCell: (params: GridRenderCellParams) => {
        const now = new Date();
        const start = params.row.alkupvm ? new Date(params.row.alkupvm) : null;
        const end = params.row.loppupvm ? new Date(params.row.loppupvm) : null;

        // Määrittelee lipun tekstin ja värin oletuksena aktiiviselle tilalle
        let label = "Aktiivinen";
        let color: "success" | "warning" | "default" = "success";

        // Tarkistaa onko kysely tulossa tai päättynyt ja asettaa lipun sen mukaisesti
        if (start && start > now) {
          label = "Tulossa";
          color = "warning";
        } else if (end && end < now) {
          label = "Päättynyt";
          color = "default";
        }

        return <Chip label={label} color={color} size="small" />;
      },
    },

    // Sarake, jossa on painike kyselyyn vastaamiseen
    {
      field: "vastaa",
      headerName: "",
      minWidth: 160,
      flex: 1,
      sortable: false,
      filterable: false,
      hideable: false,
      align: "center",

      // Määrittelee solun sisällön dynaamisesti päivämäärien perusteella
      // Painike on aktiivinen vain, jos kysely on käynnissä
      renderCell: (params: GridRenderCellParams) => {
        const now = new Date();
        const start = params.row.alkupvm ? new Date(params.row.alkupvm) : null;
        const end = params.row.loppupvm ? new Date(params.row.loppupvm) : null;

        const notStarted = start && start > now;
        const finished = end && end < now;
        const isActive = !notStarted && !finished;

        // Määrittelee työkaluvihjeen (tooltip) sen mukaisesti onko kysely alkanut tai päättynyt
        // Jos kysely on aktiivinen, näyttää "Vastaa kyselyyn"
        // Jos kysely ei ole alkanut, nappi on disabled ja näyttää alkamisajan
        // Jos kysely on päättynyt, nappi on disabled ja näyttää päättymisajan
        let tooltip = "Vastaa kyselyyn";
        if (notStarted) tooltip = `Kysely alkaa ${start?.toLocaleDateString()}`;
        else if (finished) tooltip = `Kysely päättyi ${end?.toLocaleDateString()}`;
        return (
          <>
            <Tooltip title={tooltip} placement="top">
              <span>
                <Button
                  component={Link}
                  to={`/kyselyt/${params.row.kysely_id}`}
                  variant="contained"
                  size="small"
                  disabled={!isActive}
                  sx={{ backgroundColor: "#189bb8ff", marginLeft: 1, marginRight: 1 }}
                >
                  Vastaa kyselyyn
                </Button>
              </span>
            </Tooltip>
          </>
        );
      },
    },

    // Sarake, jossa on painike tulosraportin katsomiseen
    {
      field: "tulosraportti",
      headerName: "",
      minWidth: 160,
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
            sx={{ backgroundColor: "#189bb8ff", marginLeft: 1, marginRight: 1 }}
          >
            Avaa raportti
          </Button>
        </>
      ),
    },
  ];

  // Renderöi DataGrid-komponentin kyselyillä sekä "Luo uusi kysely" -painikkeen
  return (
    <>
      <div style={{ height: 600, width: "85%", margin: "auto", textAlign: "center" , paddingTop: 15 , paddingBottom: 30}}>

        {/* Kommentoitu pois uuden kyselyn luontipainike */}
        {/* <Button href="https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/uusikysely" variant="contained" sx={{ backgroundColor: "#18b89e", marginBottom: 3 }}>
          Luo uusi kysely
        </Button> */}

        <DataGrid rows={kyselyt} columns={sarakkeet} getRowId={(row) => row.kysely_id} getRowHeight={() => 'auto'} rowSelection={false}
          sx={{
            // Tekstin rivittäminen soluihin jotta pitkät kuvaukset näkyvät kokonaan
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
