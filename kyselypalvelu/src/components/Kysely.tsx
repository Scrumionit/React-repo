import { useState, useEffect } from "react";
import type { KyselyTyyppi } from "../types";
import { Button, TextField } from "@mui/material";
import { NavLink } from "react-router";

export default function UusiKysely() {
    const [kysely, setKysely] = useState<KyselyTyyppi[]>([]);

    useEffect(() => {
        fetchKysely();
    }, []);

    const fetchKysely = () => {
        fetch("http://127.0.0.1:8080/api/kysely/id") // selvitetään backendistä kun valmis
            .then((vastaus) => {
                if (!vastaus.ok) {
                    throw new Error("Virhe hakiessa kyselyä: " + vastaus.statusText);
                }
                return vastaus.json();
            })
            .then((data) => {
                setKysely(data._embedded.kysely); // selvitetään backendistä kun valmis
            })
            .catch((virhe) => console.error(virhe));
    };

    return (
        <div style={{
          width: "50%",
          margin: "auto",
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10
        }}>
            <h2>Kyselyn Nimi</h2>
            <h3>Kyselyn kuvaus</h3>
            <br />

            <p><b>Kysymys 1:</b></p>
            <TextField
                id="outlined-multiline-static"
                label="Anna vastaus"
                multiline
                rows={3}
            />

            <p><b>Kysymys 2:</b></p>
            <TextField
                id="outlined-multiline-static"
                label="Anna vastaus"
                multiline
                rows={3}
            />

            
            <br />
            <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 2}}>
                Tallenna vastaukset
            </Button>

        </div>
    );
}
