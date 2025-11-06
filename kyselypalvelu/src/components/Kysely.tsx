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
        <div style={{ textAlign: "center" }}>
            <h2>Kyselyn Nimi</h2>
            <br />
            <h3>Kyselyn kuvaus</h3>
            <br />

            <p><b>Kysymysteksti 1</b></p>
            <TextField
                id="outlined-multiline-static"
                label="Anna vastaus"
                multiline
                rows={3}
                sx={{ width: "40%" }}
            />

            <p><b>Kysymysteksti 2</b></p>
            <TextField
                id="outlined-multiline-static"
                label="Anna vastaus"
                multiline
                rows={3}
                sx={{ width: "40%" }}
            />

            <br />
            <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 6}}>
                Tallenna vastaukset
            </Button>

        </div>
    );
}
