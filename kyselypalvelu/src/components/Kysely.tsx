import { useState, useEffect } from "react";
import type { KyselyTyyppi } from "../types";

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
    <>
        <h2>Tässä on Kysely</h2>
    </>
  );
}
