// src/data/phoneCountries.ts
export interface Country {
  code: string;
  name: string;
  flag: string;
  prefix: string;
  pattern: RegExp;
  format: string;
  placeholder: string;
}

export const countries: Country[] = [
  {
    code: "PE",
    name: "Perú",
    flag: "🇵🇪",
    prefix: "+51",
    pattern: /^\+51\s\d{3}\s\d{3}\s\d{3}$/,
    format: "xxx xxx xxx",
    placeholder: "232 231 123",
  },
  {
    code: "MX",
    name: "México",
    flag: "🇲🇽",
    prefix: "+52",
    pattern: /^\+52\s\d{2}\s\d{4}\s\d{4}$/,
    format: "xx xxxx xxxx",
    placeholder: "55 1234 5678",
  },
  {
    code: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    prefix: "+57",
    pattern: /^\+57\s\d{3}\s\d{3}\s\d{4}$/,
    format: "xxx xxx xxxx",
    placeholder: "300 123 4567",
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    prefix: "+54",
    pattern: /^\+54\s\d{2}\s\d{4}\s\d{4}$/,
    format: "xx xxxx xxxx",
    placeholder: "11 2345 6789",
  },
];
