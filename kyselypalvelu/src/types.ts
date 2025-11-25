export type Kysymys = {
  kysymys_id: number;
  kysymystyyppi: KysymysTyyppi;
  kysymysteksti: string;
  vaihtoehdot: string[];
  vastaukset: string[];
};

export type Kysely = {
  kysely_id: number;
  nimi: string;
  kuvaus: string;
  alkupvm: string;
  loppupvm: string;
  kysymykset: Kysymys[];
};

export type Vastaus = {
  vastaus_id: number;
  vastausteksti: string;
  kysymys: Kysymys; //monta vastausta voi liittyä yhteen kysymykseen
  vaihtoehto: Vaihtoehto; //valittu vaihtoehto, jos kysymystyyppi on monivalinta
};

export type KysymysTyyppi = {
  kysymystyyppi_id: number;
  nimi: string;
  kysymykset: Kysymys[];
};

export type Vaihtoehto = {
  vaihtoehto_id: number;
  teksti: string;
  kysymys: Kysymys;
};