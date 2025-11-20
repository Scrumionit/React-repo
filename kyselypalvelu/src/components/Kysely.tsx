import { useState, useEffect } from "react";
import type { KyselyTyyppi } from "../types";
import { Button, IconButton, TextField } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function UusiKysely() {
    const { id } = useParams<{ id: string }>();
    const [kysely, setKysely] = useState<KyselyTyyppi | null>(null);
    const [vastaukset, setVastaukset] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchKysely(id);
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
                            value={vastaukset[k.kysymys_id] ?? ""}
                            onChange={(e) =>
                                setVastaukset((prev) => ({
                                    ...prev,
                                    [k.kysymys_id]: e.target.value,
                                }))
                            }
                        />
                    </div>
                ))
            ) : (
                <p><i>Ei kysymyksiä tässä kyselyssä.</i></p>
            )}

            <br />
            {saveError && <div style={{ color: "#b00020" }}>Tallennus epäonnistui: {saveError}</div>}
            <Button onClick={async () => {
                if (!kysely) return;
                setSaveError(null);
                setSaving(true);

                try {
                    // Send each answer to the per-question endpoint expected by backend
                    const promises = kysely.kysymykset.map((k) => {
                        const text = vastaukset[k.kysymys_id] ?? "";
                        const url = `http://127.0.0.1:8080/api/kyselyt/${kysely.kysely_id}/kysymykset/${k.kysymys_id}/vastaukset`;
                        return fetch(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ vastausteksti: text }),
                        }).then((r) => {
                            if (!r.ok) throw new Error(`Virhe ${r.status} kysymys ${k.kysymys_id}`);
                            return r.json();
                        });
                    });

                    await Promise.all(promises);
                    alert("Vastaukset tallennettu.");
                    navigate("/kyselyt");
                } catch (err: unknown) {
                    console.error(err);
                    const msg = err instanceof Error ? err.message : String(err);
                    setSaveError(msg || "Tuntematon virhe");
                } finally {
                    setSaving(false);
                }
            }} variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 2, marginBottom: 5 }} disabled={saving}>
                {saving ? "Tallennetaan…" : "Tallenna vastaukset"}
            </Button>

        </div>
    );
}
