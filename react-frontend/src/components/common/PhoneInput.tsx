import type { FC, ChangeEvent } from "react";
import { useState, useMemo } from "react";
import { countries, type Country } from "../../data/phoneCountries";

interface Props {
  value: string; // +51 232 231 123
  onChange: (raw: string) => void;
  required?: boolean;
}

export const PhoneInput: FC<Props> = ({
  value,
  onChange,
  required = false,
}) => {
  const [open, setOpen] = useState(false);

  // país actual (por defecto Perú)
  const [selected, setSelected] = useState<Country>(
    () => countries.find((c) => c.code === "PE") ?? countries[0]
  );

  // derivar prefix del value si ya existe
  useMemo(() => {
    const prefix = value.split(" ")[0];
    const country = countries.find((c) => c.prefix === prefix);
    if (country) setSelected(country);
  }, [value]);

  // formatear mientras escribe
  const handleType = (e: ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, ""); // solo números
    const parts: string[] = [];
    let idx = 0;
    const format = selected.format.split(" ");

    for (const chunk of format) {
      const len = chunk.length;
      if (idx >= digits.length) break;
      parts.push(digits.slice(idx, idx + len));
      idx += len;
    }
    const formatted = parts.join(" ");
    onChange(`${selected.prefix} ${formatted}`.trim());
  };

  // elegir país
  const pickCountry = (c: Country) => {
    setSelected(c);
    setOpen(false);
    onChange(`${c.prefix} `);
  };

  // placeholder dinámico
  const placeholder = selected.placeholder;

  return (
    <div className="relative w-full">
      <label className="block text-sm text-white/80 mb-1">
        Teléfono <em className="text-red-500">*</em>
      </label>
      <div className="flex items-center gap-2">
        {/* Selector de país */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-3 py-2 bg-white/20 border border-white/30 rounded-lg hover:bg-white/30 transition"
          title="Cambiar país"
        >
          <span className="text-lg leading-none">{selected.flag}</span>
          <span className="text-white text-sm">{selected.prefix}</span>
          <svg
            className="w-4 h-4 text-white/70"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Input de número */}
        <input
          type="tel"
          value={value.replace(selected.prefix, "").trim()}
          onChange={handleType}
          placeholder={placeholder}
          required={required}
          className="flex-1 px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg
                     placeholder-white/50 text-white
                     focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />
      </div>

      {/* Dropdown */}
      {open && (
        <ul className="absolute z-10 mt-2 w-64 max-h-60 overflow-auto bg-black/80 backdrop-blur-md border border-white/20 rounded-lg shadow-xl">
          {countries.map((c) => (
            <li key={c.code}>
              <button
                type="button"
                onClick={() => pickCountry(c)}
                className="w-full flex items-center gap-3 px-4 py-2 text-white hover:bg-white/10 transition"
              >
                <span className="text-lg">{c.flag}</span>
                <span className="flex-1 text-left text-sm">{c.name}</span>
                <span className="text-xs text-white/60">{c.prefix}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
