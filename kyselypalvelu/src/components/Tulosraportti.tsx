import { useState, useEffect } from "react";
import type { Kysely, Vastaus } from "../types";
import { NavLink, useParams } from "react-router-dom";
import { Button, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Tulosraportti() {
    const { id } = useParams<{ id: string }>();
    const [kysely, setKysely] = useState<Kysely | null>(null);
    const [vastaukset, setVastaukset] = useState<Vastaus[]>([]);
    const [kyselyLoading, setKyselyLoading] = useState(true);
    const [vastauksetLoading, setVastauksetLoading] = useState(true);
    const [kyselyError, setKyselyError] = useState<string | null>(null);
    const [vastauksetError, setVastauksetError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchKysely(id);
            fetchVastaukset(id);
        }
    }, [id]);

    // Hakee yksittäisen kyselyn backendistä
    const fetchKysely = (id: string) => {
        setKyselyLoading(true);
        setKyselyError(null);
        fetch(`http://127.0.0.1:8080/api/kyselyt/${id}`) // lokaalisti testatessa
        // fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}`) // rahtiversio
            .then((vastaus) => {
                if (!vastaus.ok) {
                    throw new Error("Virhe hakiessa kyselyä: " + vastaus.status + " " + vastaus.statusText);
                }
                return vastaus.json();
            })
            .then((data) => {
                setKysely(data);
            })
            .catch((virhe) => {
                console.error(virhe);
                const msg = virhe instanceof Error ? virhe.message : String(virhe);
                setKyselyError(msg);
            })
            .finally(() => setKyselyLoading(false));
    };

    // Hakee vastaukset kyseiselle kyselylle backendistä
    const fetchVastaukset = (id: string) => {
        setVastauksetLoading(true);
        setVastauksetError(null);
        fetch(`http://127.0.0.1:8080/api/kyselyt/${id}/vastaukset`) // lokaalisti testatessa
        // fetch(`https://spring-repo-scrumionit-kyselypalvelu.2.rahtiapp.fi/api/kyselyt/${id}/vastaukset`) // rahtiversio
            .then((vastaus) => {
                if (!vastaus.ok) {
                    // don't throw hard — handle 404 or missing endpoint gracefully
                    throw new Error("Virhe hakiessa vastauksia: " + vastaus.status + " " + vastaus.statusText);
                }
                return vastaus.json();
            })
            .then((data) => {
                console.debug("Raw fetched vastaukset:", data);
                // save as-is; rendering will read either `kysymys_id` or nested `kysymys`
                setVastaukset(data as Vastaus[]);
            })
            .catch((virhe) => {
                console.error(virhe);
                const msg = virhe instanceof Error ? virhe.message : String(virhe);
                setVastauksetError(msg);
                setVastaukset([]); // ensure UI still renders
            })
            .finally(() => setVastauksetLoading(false));
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

    // Näyttää varsinaisen tulosraportin
    return (
        <div style={{
            width: "70%",
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

            {/* Kyselyn nimi ja tulosraportin otsikko */}
            <h2>Kyselyn "<b>{kysely.nimi}</b>" tulosraportti</h2>

            {/* Näyttää mahdolliset virheilmoitukset */}
            {kyselyError && <div style={{ color: "#b00020" }}>Kyselyn latauksessa virhe: {kyselyError}</div>}
            {vastauksetError && <div style={{ color: "#b00020" }}>Vastauksia ei voitu ladata: {vastauksetError}</div>}

            {/* Käy läpi kaikki kysymykset ja näyttää niihin liittyvät vastaukset */}
            {kysely.kysymykset && kysely.kysymykset.length > 0 ? (
                // Järjestää kysymykset kysymys_id:n mukaan jotta ne näkyisivät samassa järjestyksessä kuin kyselyssä
                ([...kysely.kysymykset] as typeof kysely.kysymykset)
                    .slice()
                    .sort((a, b) => (a.kysymys_id ?? 0) - (b.kysymys_id ?? 0))
                    .map((k, index) => {
                        // suodattaa vastaukset: backend voi palauttaa joko kysymys_id:n tai sisäkkäisen kysymys-objektin
                        const filtered = vastaukset
                            .filter((v) => {
                                const asObj = v as unknown as Record<string, unknown>;
                                const kysIdRaw = asObj["kysymys_id"] ?? (asObj["kysymys"] as Record<string, unknown> | undefined)?.["kysymys_id"] ?? (asObj["kysymys"] as Record<string, unknown> | undefined)?.["id"];
                                let qid: number | null = null;
                                if (typeof kysIdRaw === "number") qid = kysIdRaw;
                                else if (typeof kysIdRaw === "string" && /^\d+$/.test(kysIdRaw)) qid = Number(kysIdRaw);
                                return qid === k.kysymys_id;
                            })
                            .slice()
                            .sort((a, b) => {
                                const aaRaw = (a as unknown as Record<string, unknown>)["vastaus_id"];
                                const bbRaw = (b as unknown as Record<string, unknown>)["vastaus_id"];
                                const aa = typeof aaRaw === "number" ? aaRaw : (typeof aaRaw === "string" && /^\d+$/.test(aaRaw) ? Number(aaRaw) : 0);
                                const bb = typeof bbRaw === "number" ? bbRaw : (typeof bbRaw === "string" && /^\d+$/.test(bbRaw) ? Number(bbRaw) : 0);
                                return aa - bb;
                            });

                        {/* Näyttää yksittäisen kysymyksen ja siihen liittyvät vastaukset */}
                        return (
                            <div key={k.kysymys_id}>
                                <p>
                                    <b>Kysymys {index + 1}:</b> {k.kysymysteksti}
                                </p>

                                {vastauksetLoading ? (
                                    <p>Ladataan vastauksia…</p>
                                ) : filtered.length > 0 ? (
                                    <ul>
                                        {filtered.map((vastaus, vIndex) => {
                                            const o = vastaus as unknown as Record<string, unknown>;
                                            const text = typeof o["vastausteksti"] === "string" ? o["vastausteksti"] as string : (typeof o["teksti"] === "string" ? o["teksti"] as string : String(o["vastausteksti"] ?? ""));
                                            return (<li key={vIndex}>{text}</li>);
                                        })}
                                    </ul>
                                ) : (
                                    <p><i>Ei vastauksia tähän kysymykseen.</i></p>
                                )}
                            </div>
                        );
                    })
            ) : (
                // Jos kyselyssä ei ole kysymyksiä
                <p>Kyselyssä ei ole kysymyksiä.</p>
            )}

            <Button component={NavLink} to="/kyselyt" variant="contained" sx={{ backgroundColor: "#18b89e", marginTop: 3, marginBottom: 4 }}>
                Palaa kyselyihin
            </Button>
        </div>
    );
}