import { useState, useEffect } from "react";
import type { Kysely } from "../types";
import { Button, IconButton, TextField, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Kysely() {
    const { id } = useParams<{ id: string }>();
    const [kysely, setKysely] = useState<Kysely | null>(null);
    const [vastaukset, setVastaukset] = useState<Record<number, string>>({});
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [kyselyLoading, setKyselyLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchKysely(id);
        }
    }, [id]);

    // Hakee yksittäisen kyselyn backendistä
    const fetchKysely = (id: string) => {
        setKyselyLoading(true);
        fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}`)
        //fetch(`http://127.0.0.1:8080/api/kyselyt/${id}`) // lokaalisti testatessa
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
            .catch((virhe) => console.error(virhe))
            .finally(() => setKyselyLoading(false));
    };

    // Näyttää latausilmoituksen, kun kyselyä haetaan
    if (kyselyLoading) {
        return (
            <div style={{ width: "50%", margin: "auto", paddingTop: 20, textAlign: "center" }}>
                <h3>Ladataan kyselyä…</h3>
            </div>
        );
    }

    // Näyttää virheilmoituksen, jos kyselyä ei löydy
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


      {/*Tarkistetaan onko monivalintakysymys vai avoin kysymys */}
      const onMonivalinta = (k:any) =>{
        if (k?.kysymysTyyppi != null) {
            const t = String(k.kysymysTyyppi).toLowerCase();
            return( t === "monivalinta" || t === "multiplechoice" || t.includes("monival") || t.includes("multiple") || t.includes("choice") || t.includes("valinta")
        );
        }
        //jos tyyppiä ei ole määritelty, tarkistetaan onko vaihtoehtoja
        return !!(k?.vaihtoehdot && k.vaihtoehdot.length > 0);
        };
      

    // Näyttää varsinaisen kyselyn ja vastauslomakkeen
    return (
        <div style={{
            width: "50%",
            margin: "auto",
            paddingTop: 20,
            display: "flex",
            flexDirection: "column",
            gap: 10
        }}>
            {/* Takaisin kyselylistaukseen -painike */}
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

            {/* Kyselyn nimi ja kuvaus */}
            <h2>{kysely.nimi}</h2>
            <h3>{kysely.kuvaus}</h3>


            {/* Jos kysymyksiä on, käy ne läpi ja tulosta näkyviin */}
            {kysely.kysymykset && kysely.kysymykset.length > 0 ? (
                // Lajitellaan kysymykset kysymys_id:n mukaan ja mapataan ne näkyviin jotta järjestys säilyy
                ([...kysely.kysymykset] as typeof kysely.kysymykset)
                    .slice()
                    .sort((a, b) => (a.kysymys_id ?? 0) - (b.kysymys_id ?? 0))
                    .map((k, index) => (
                        <div key={k.kysymys_id}>
                            <p>
                                <b>Kysymys {index + 1}:</b> {k.kysymysteksti}
                            </p>

                 {/* Näytetään vastausvaihtoehdot, jos kysymystyyppinä monivalinta */}
                {onMonivalinta(k) ? (
                    <>
                        {(() => {
                            const vaihtoehdot = (k.vaihtoehdot ?? []).map((ve: any) => {
                                if (ve == null) return { teksti: "" };
                                return typeof ve === "string" ? { teksti: ve } : ve;
                            });
                        {/*Palauttaa radiobutton monivalintakysymyksille*/}
                      return (
                                <FormControl component="fieldset" sx={{ marginTop: 1, marginBottom: 1 }}>
                                    <FormLabel component="legend">Valitse yksi vaihtoehto:</FormLabel>
                                    <RadioGroup
                                        value={vastaukset[k.kysymys_id] ?? ""}
                                        onChange={(e) =>
                                            setVastaukset((prev) => ({
                                                ...prev,
                                                [k.kysymys_id]: e.target.value,
                                            }))
                                        }
                                    >
                                        {vaihtoehdot.map((ve, veIndex) => (
                                            <FormControlLabel
                                                key={veIndex}
                                                value={ve.teksti}
                                                control={<Radio />}
                                                label={ve.teksti}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                              );
                        })()}
                    </>
                ) : (   
                                // Muuten (jos ei vaihtoehtoja) näytetään monirivinen tekstikenttä avoimelle vastaukselle
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
                )}
                        </div>
                    ))
            ) : (
                // Jos kyselyssä ei ole kysymyksiä
                <p><i>Ei kysymyksiä tässä kyselyssä.</i></p>
            )}

            {/* Tallennusvirheen näyttö */}
            <br />
            {saveError && <div style={{ color: "#b00020" }}>Tallennus epäonnistui: {saveError}</div>}

            {/* Tallenna vastaukset -painike */}
            <Button onClick={async () => {
                if (!kysely) return;
                setSaveError(null);
                setSaving(true);

                try {
                    {/* Lähetä jokainen vastaus erikseen */}
                    const promises = kysely.kysymykset.map((k) => {
                        const text = vastaukset[k.kysymys_id] ?? "";
                        const url = `http://127.0.0.1:8080/api/kyselyt/${kysely.kysely_id}/kysymykset/${k.kysymys_id}/vastaukset`; // lokaalisti testatessa
                        // const url = `https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${kysely.kysely_id}/kysymykset/${k.kysymys_id}/vastaukset`; // rahtiversio
                        return fetch(url, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                vastausteksti: text,
                                kysymys_id: k.kysymys_id,
                                kysely_id: kysely.kysely_id,
                            }),
                        }).then((r) => {
                            if (!r.ok) throw new Error(`Virhe ${r.status} kysymys ${k.kysymys_id}`);
                            return r.json();
                        });
                    });
                    {/* Odota, että kaikki vastaukset on lähetetty */}
                    await Promise.all(promises);
                    alert("Vastaukset tallennettu onnistuneesti! Kiitos osallistumisestasi.");
                    navigate("/kyselyt");
                } catch (err: unknown) {
                    console.error(err);
                    const msg = err instanceof Error ? err.message : String(err);
                    setSaveError(msg || "Tuntematon virhe");
                } finally {
                    setSaving(false);
                }
            {/* Napin tyylit, jos tallennus on käynnissä, nappi on disabled */}
            }} variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 2, marginBottom: 5 }} disabled={saving}>
                {saving ? "Tallennetaan…" : "Tallenna vastaukset"}
            </Button>

        </div>
    );
}
