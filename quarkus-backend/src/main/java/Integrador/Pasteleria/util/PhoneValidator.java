package Integrador.Pasteleria.util;

import java.util.*;

/**
 *validación de teléfono
 *validar número de teléfono para un país específico
 */
public class PhoneValidator {

    public static class CountryPhoneRule {
        public final String countryCode;
        public final String countryName;
        public final String dialingCode;
        public final int digitCount;
        public final String[] startsWith;

        public CountryPhoneRule(String countryCode, String countryName, String dialingCode, 
                               int digitCount, String... startsWith) {
            this.countryCode = countryCode;
            this.countryName = countryName;
            this.dialingCode = dialingCode;
            this.digitCount = digitCount;
            this.startsWith = startsWith;
        }
    }

    private static final Map<String, CountryPhoneRule> PHONE_RULES = new HashMap<>();

    static {
        PHONE_RULES.put("PE", new CountryPhoneRule("PE", "Perú", "+51", 9, "9"));
        PHONE_RULES.put("MX", new CountryPhoneRule("MX", "México", "+52", 10, "1", "3"));
        PHONE_RULES.put("CL", new CountryPhoneRule("CL", "Chile", "+56", 9, "9"));
        PHONE_RULES.put("CO", new CountryPhoneRule("CO", "Colombia", "+57", 10, "3"));
        PHONE_RULES.put("AR", new CountryPhoneRule("AR", "Argentina", "+54", 10, "9"));
    }

    /**
     * validar número de teléfono para un país específico
     * @param phoneNumber Número de teléfono con código de país (ejemplo: "+51987654321")
     * @param countryCode Código de país (ejemplo: "PE")
     * @return ValidationResult con bandera válida y mensaje de error si es inválido
     */
    public static ValidationResult validatePhoneNumber(String phoneNumber, String countryCode) {
        if (phoneNumber == null || phoneNumber.trim().isEmpty()) {
            return new ValidationResult(false, "El teléfono no puede estar vacío");
        }

        if (countryCode == null || countryCode.trim().isEmpty()) {
            return new ValidationResult(false, "El país no puede estar vacío");
        }

        CountryPhoneRule rule = PHONE_RULES.get(countryCode.toUpperCase());
        if (rule == null) {
            return new ValidationResult(false, "País no soportado");
        }

        //Eliminar caracteres no numéricos excepto "+"
        String cleanedPhone = phoneNumber.replaceAll("[^\\d+]", "");

        // Verificar si comienza con el código de país correcto
        if (!cleanedPhone.startsWith(rule.dialingCode)) {
            return new ValidationResult(false, 
                String.format("El teléfono debe comenzar con %s", rule.dialingCode));
        }

        // Extraer dígitos después del código de país
        String digitsOnly = cleanedPhone.replace(rule.dialingCode, "");

        // Verificar cantidad de dígitos
        if (digitsOnly.length() != rule.digitCount) {
            return new ValidationResult(false,
                String.format("%s requiere exactamente %d dígitos", rule.countryName, rule.digitCount));
        }

        // Verificar si comienza con dígito(s) válido(s)
        boolean startsWithValid = false;
        for (String prefix : rule.startsWith) {
            if (digitsOnly.startsWith(prefix)) {
                startsWithValid = true;
                break;
            }
        }

        if (!startsWithValid) {
            return new ValidationResult(false,
                String.format("El número debe comenzar con %s", String.join(" o ", rule.startsWith)));
        }

        return new ValidationResult(true, null);
    }

    /**
     * Clase de resultado para la validación de teléfono
     */
    public static class ValidationResult {
        public final boolean valid;
        public final String error;

        public ValidationResult(boolean valid, String error) {
            this.valid = valid;
            this.error = error;
        }
    }
}
