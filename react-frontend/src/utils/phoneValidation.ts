/**
 *validación de números de teléfono por país
 *Definiciones de reglas de validación telefónica por país
 */

export interface CountryPhoneRule {
    countryCode: string;
    countryName: string;
    dialingCode: string; //ejemplo: "+51"
    digitCount: number; //total de dígitos sin el código de país
    startsWith: string[]; // lista de dígitos con los que debe comenzar el número después del código de país
}

export const PHONE_RULES: Record<string, CountryPhoneRule> = {
    PE: {
        countryCode: "PE",
        countryName: "Perú",
        dialingCode: "+51",
        digitCount: 9,
        startsWith: ["9"],
    },
    MX: {
        countryCode: "MX",
        countryName: "México",
        dialingCode: "+52",
        digitCount: 10,
        startsWith: ["1", "3"],
    },
    CL: {
        countryCode: "CL",
        countryName: "Chile",
        dialingCode: "+56",
        digitCount: 9,
        startsWith: ["9"],
    },
    CO: {
        countryCode: "CO",
        countryName: "Colombia",
        dialingCode: "+57",
        digitCount: 10,
        startsWith: ["3"],
    },
    AR: {
        countryCode: "AR",
        countryName: "Argentina",
        dialingCode: "+54",
        digitCount: 10,
        startsWith: ["9"],
    },
};

/**
 * Obtener regla de país por código de marcación (ejemplo: "+51" -> PE)
 */
export const getCountryByDialingCode = (dialingCode: string): string | null => {
    const entry = Object.entries(PHONE_RULES).find(
        ([, rule]) => rule.dialingCode === dialingCode
    );
    return entry ? entry[0] : null;
};

/**
 * Validar número de teléfono para un país específico
 * @param phoneNumber - Número de teléfono con código de país (ejemplo: "+51987654321")
 * @param countryCode - Código de país (ejemplo: "PE")
 * @returns { valid: boolean, error?: string }
 */
export const validatePhoneNumber = (
    phoneNumber: string,
    countryCode: string
): { valid: boolean; error?: string } => {
    const rule = PHONE_RULES[countryCode.toUpperCase()];

    if (!rule) {
        return { valid: false, error: "País no soportado" };
    }

    //Eliminar caracteres no numéricos
    const cleanedPhone = phoneNumber.replace(/[^\d+]/g, "");

    // Verificar si comienza con el código de país correcto
    if (!cleanedPhone.startsWith(rule.dialingCode)) {
        return {
            valid: false,
            error: `El teléfono debe comenzar con ${rule.dialingCode}`,
        };
    }

    // Extraer dígitos después del código de país
    const digitsOnly = cleanedPhone.replace(rule.dialingCode, "");

    // Verificar cantidad de dígitos
    if (digitsOnly.length !== rule.digitCount) {
        return {
            valid: false,
            error: `${rule.countryName} requiere exactamente ${rule.digitCount} dígitos`,
        };
    }

    // Verificar si comienza con dígito(s) válido(s)
    const startsWithValid = rule.startsWith.some((digit) =>
        digitsOnly.startsWith(digit)
    );

    if (!startsWithValid) {
        return {
            valid: false,
            error: `El número debe comenzar con ${rule.startsWith.join(" o ")}`,
        };
    }

    return { valid: true };
};

/**
 * Formatear número de teléfono con código de país (elimina espacios, guiones, etc.)
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/[^\d+]/g, "");
};
