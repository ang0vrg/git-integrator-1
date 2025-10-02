// \quarkus-backend\src\main\java\Integrador\Pasteleria\service\PasswordResetService.java
package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.PasswordResetToken;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class PasswordResetService {

    @Inject
    Mailer mailer;

    private final ConcurrentHashMap<String, PasswordResetToken> tokens = new ConcurrentHashMap<>();
    private static final long EXPIRATION_MINUTES = 15;

    public String generateResetToken(String email) {
        String token = UUID.randomUUID().toString();
        Instant expiryDate = Instant.now().plus(EXPIRATION_MINUTES, ChronoUnit.MINUTES);

        PasswordResetToken resetToken = new PasswordResetToken(email, token, expiryDate);
        tokens.put(token, resetToken);

        sendResetEmail(email, token);

        return token;
    }

    private void sendResetEmail(String emailDestino, String token) {
        try {
            String resetLink = "http://localhost:5173/reset-password/" + token;
            String manualInstructions = "\n\nSi el enlace no funciona, ve a: http://localhost:5173/reset-password e ingresa este token manualmente:\n" + token;

            String subject = "Restablecimiento de Contraseña - Pastelería Chantilly";
            String body = buildEmailBody(resetLink);

            mailer.send(
                Mail.withHtml(emailDestino, subject, body)
                    .addHeader("Content-Type", "text/html; charset=UTF-8") // AGREGA esta línea
            );
            
            System.out.println("✅ Email enviado a: " + emailDestino);//Mas sencillo de leer son los iconos

        } catch (Exception e) {
            System.err.println("❌ Error enviando email: " + e.getMessage());
        }
    }

    private String buildEmailBody(String resetLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #7C5652; color: white; padding: 20px; text-align: center; }
                    .content { padding: 20px; background: #f9f9f9; }
                    .button { background: #7C5652; color: white; padding: 12px 24px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; }
                    .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                    .token { background: #eee; padding: 10px; border-radius: 3px; font-family: monospace; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Pastelería Dulce</h1>
                    </div>
                    <div class="content">
                        <h2>Restablecer tu Contraseña</h2>
                        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                        
                        <p style="text-align: center;">
                            <a href="%s" class="button">Restablecer Contraseña</a>
                        </p>
                        
                        <p>O copia y pega este enlace en tu navegador:</p>
                        <p class="token">%s</p>
                        
                        <p><strong>ALERTA!!! Este enlace expirará en 15 minutos</strong></p>
                        
                        <p>Si no solicitaste este restablecimiento, ignora este email.</p>
                    </div>
                    <div class="footer">
                        <p>© 2024 Pastelería Chantilly. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
            """.formatted(resetLink, resetLink);
    }

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
    
    public void invalidateToken(String token) {
        tokens.remove(token);
        System.out.println("Token removido después de su uso: " + token);
    }
}