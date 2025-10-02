package Integrador.Pasteleria.service;

import jakarta.enterprise.context.ApplicationScoped;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import Integrador.Pasteleria.dto.PasswordResetToken;

@ApplicationScoped
public class PasswordResetService {

    private final ConcurrentHashMap<String, PasswordResetToken> tokens = new ConcurrentHashMap<>();

    private static final long EXPIRATION_MINUTES = 15;

    /**
     * Envío de un correo con el enlace.
     * @param email El correo del usuario.
     * @return El token generado.
     */
    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(EXPIRATION_MINUTES, ChronoUnit.MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(email, token, expiryDate);
        tokens.put(token, resetToken);

        // 4. *** Simulación de Envío de Email ***
        // Se usaría un servicio de email... Quarkus Mailer
        // http://[localhost]/reset-password?token=" + token
        System.out.println("------------------------------------------------------------------------");
        System.out.println("SIMULACIÓN DE EMAIL ENVIADO:");
        System.out.println("Para: " + email);
        System.out.println("Token generado: " + token);
        System.out.println("Enlace de restablecimiento: /reset-password?token=" + token);
        System.out.println("------------------------------------------------------------------------");

        return token;
    }

    /**
     * @param token El token recibido del frontend.
     * @return Optional que contiene el email si el token es válido.
     */
    public Optional<String> validateResetToken(String token) {
        PasswordResetToken resetToken = tokens.get(token);

        if (resetToken == null) {
            return Optional.empty();
        }

        if (resetToken.isExpired()) {
            tokens.remove(token);
            return Optional.empty();
        }
        return Optional.of(resetToken.email);
    }
    
    /**
     * Esto previene que el mismo token se use varias veces.
     * @param token El token a remover.
     */
    public void invalidateToken(String token) {
        tokens.remove(token);
        System.out.println("Token removido después de su uso: " + token);
    }
}