export type KysymysTyyppi = {
  kysymys_id: number;
  kysymystyyppi: string;
  kysymysteksti: string;
  vastaus: string[];
};

export type KyselyTyyppi = {
  kysely_id: number;
  nimi: string;
  kuvaus: string;
  kysymykset: KysymysTyyppi[];
};