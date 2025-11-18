import { useState, useEffect } from "react";
import type { KyselyTyyppi, VastausTyyppi } from "../types";
import { NavLink, useParams } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Tulosraportti() {
    const { id } = useParams<{ id: string }>();
    const [kysely, setKysely] = useState<KyselyTyyppi | null>(null);
    const [vastaukset, setVastaukset] = useState<VastausTyyppi[]>([]);

    useEffect(() => {
        if (id) {
            fetchKysely(id);
            fetchVastaukset(id);
        }
    }, [id]);

    const fetchKysely = (id: string) => {
        fetch(`http://127.0.0.1:8080/api/kyselyt/${id}`) // lokaalisti testatessa
            // fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}`) // rahtiversio
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

    const fetchVastaukset = (id: string) => {
        fetch(`http://127.0.0.1:8080/api/kyselyt/${id}/vastaukset`) // lokaalisti testatessa
            // fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}/vastaukset`) // rahtiversio
            .then((vastaus) => {
                if (!vastaus.ok) {
                    throw new Error("Virhe hakiessa vastauksia: " + vastaus.statusText);
                }
                return vastaus.json();
            })
            .then((data) => {
                setVastaukset(data);
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
                gap: 10,
            }}>
                <h2>Hups!</h2>
                <p>Kyselyä ei valitettavasti löytynyt. <a href="/kyselyt">Palaa listaukseen</a>.</p>
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

            <h2>Kyselyn <b>{kysely.nimi}</b> tulosraportti</h2>

            {kysely.kysymykset && kysely.kysymykset.length > 0 ? (
                kysely.kysymykset.map((k, index) => (
                    <div key={k.kysymys_id}>
                        <p>
                            <b>Kysymys {index + 1}:</b> {k.kysymysteksti}
                        </p>

                        {vastaukset.length > 0 ? (
                            <ul>
                                {vastaukset
                                    .filter(v => v.kysymys_id === k.kysymys_id)
                                    .map((vastaus, vIndex) => (
                                        <li key={vIndex}>{vastaus.vastausteksti}</li>
                                    ))}
                            </ul>
                        ) : (
                            <p>Ei vastauksia tähän kysymykseen.</p>
                        )}

                    </div>
                ))
            ) : (
                <p>Kyselyssä ei ole kysymyksiä.</p>
            )}

            <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginBottom: 3 }}>
                Palaa kyselyihin
            </Button>
        </div>
    );
}