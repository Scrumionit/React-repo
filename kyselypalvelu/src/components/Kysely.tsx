import { useState, useEffect } from "react";
import type { KyselyTyyppi } from "../types";
import { Button, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router";
import { useParams } from "react-router-dom";

export default function UusiKysely() {
    const { id } = useParams<{ id: string }>();
    const [kysely, setKysely] = useState<KyselyTyyppi | null>(null);

    useEffect(() => {
        if (id) {
            fetchKysely(id);
        }
    }, [id]);

    const fetchKysely = (id: string) => {
        // fetch(`http://127.0.0.1:8080/api/kyselyt/${id}`) lokaalisti testatessa
        fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}`) // rahtiversio
            .then((vastaus) => {
                if (!vastaus.ok) {
                    throw new Error("Virhe hakiessa kyselyä: " + vastaus.statusText);
                }
                return vastaus.json();
            })
            .then((data) => {
                setKysely(data);
            })
            .catch((virhe) => console.error(virhe));
    };

    if (!kysely) {
        return (
            <div style={{
                width: "50%",
                margin: "auto",
                paddingTop: 10,
                display: "flex",
                flexDirection: "column",
                gap: 10
            }}>
                <h2>Ladataan...</h2>
            </div>
        );
    }

    return (
        <div style={{
            width: "50%",
            margin: "auto",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
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

            <h2>{kysely.nimi}</h2>
            <h3>{kysely.kuvaus}</h3>

            {kysely.kysymykset && kysely.kysymykset.length > 0 ? (
                kysely.kysymykset.map((k, index) => (
                    <div key={k.kysymys_id}>
                        <p>
                            <b>Kysymys {index + 1}:</b> {k.kysymysteksti}
                        </p>
                        <TextField
                            label="Anna vastaus"
                            multiline
                            rows={3}
                            variant="outlined"
                            fullWidth
                        />
                    </div>
                ))
            ) : (
                <p><i>Ei kysymyksiä tässä kyselyssä.</i></p>
            )}

            <br />
            <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 2 }}>
                Tallenna vastaukset
            </Button>

        </div>
    );
}
