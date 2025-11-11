export type KysymysTyyppi = {
  kysymys_id: number;
  kysymystyyppi: string;
  kysymysteksti: string;
  vastaus: string[]; // element collection in backend is a list of strings
};

export type KyselyTyyppi = {
  kysely_id: number;
  nimi: string;
  kuvaus: string;
  kysymykset: KysymysTyyppi[];
};