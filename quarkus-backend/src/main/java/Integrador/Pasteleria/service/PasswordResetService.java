// quarkus-backend\src\main\java\Integrador\Pasteleria\service\PasswordResetService.java
package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.PasswordResetToken;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.mailer.reactive.ReactiveMailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import io.quarkus.scheduler.Scheduled;

@ApplicationScoped
public class PasswordResetService {

    @Inject
    Mailer mailer; // Para envío síncrono
    
    @Inject
    ReactiveMailer reactiveMailer; // Para envío asíncrono

    @ConfigProperty(name = "quarkus.mailer.from")
    String mailFrom;
    
    @Scheduled(every = "10m")
    void scheduledCleanup() {
        cleanupExpiredTokens();
    }

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
            
            String subject = "Restablecimiento de Contraseña - Pastelería Chantilly";
            String htmlBody = buildEmailBody(resetLink);
            String textBody = buildTextBody(resetLink); // Versión texto plano

            reactiveMailer.send(
                Mail.withHtml(emailDestino, subject, htmlBody)
                    .setText(textBody) // Versión texto plano como fallback
                    .setFrom(mailFrom)
            ).subscribe().with(
                success -> {
                    System.out.println("✅ Email enviado exitosamente a: " + emailDestino);
                    System.out.println("🔗 Enlace de reset: " + resetLink);
                },
                failure -> {
                    System.err.println("❌ Error enviando email a " + emailDestino + ": " + failure.getMessage());
                    failure.printStackTrace();
                }
            );

        } catch (Exception e) {
            System.err.println("❌ Error crítico enviando email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String buildEmailBody(String resetLink) {
        return """
            <!DOCTYPE html>
                <html lang="es">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Restablecer Contraseña - Pastelería Chantilly</title>
                  <style>
                    body {
                      font-family: 'Arial', sans-serif;
                      color: #333;
                      margin: 0;
                      padding: 0;
                      background-color: #f9f9f9;
                    }

                    .container {
                      max-width: 600px;
                      margin: 40px auto;
                      background: #ffffff;
                      border-radius: 10px;
                      overflow: hidden;
                      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
                    }

                    .header {
                      background: #c10007;
                      color: #ffffff;
                      padding: 25px;
                      text-align: center;
                    }

                    .header h1 {
                      margin: 0;
                      font-size: 1.8em;
                      letter-spacing: 1px;
                    }

                    .content {
                      padding: 30px;
                      line-height: 1.7;
                    }

                    .content h2 {
                      color: #c10007;
                      font-size: 1.4em;
                      margin-bottom: 12px;
                    }

                    .button {
                      background: #fdc700;
                      color: #000000;
                      padding: 14px 28px;
                      text-decoration: none;
                      border-radius: 8px;
                      display: inline-block;
                      font-weight: bold;
                      margin: 18px 0;
                      transition: all 0.3s ease;
                    }

                    .button:hover {
                      background: #e5b800;
                    }

                    .token {
                      background: #f5f5f5;
                      border-left: 4px solid #fdc700;
                      padding: 12px;
                      border-radius: 6px;
                      font-family: 'Courier New', monospace;
                      word-break: break-all;
                      margin: 15px 0;
                      color: #555;
                    }

                    .warning {
                      color: #c10007;
                      font-weight: bold;
                      background: #fff4f4;
                      padding: 12px;
                      border-radius: 6px;
                      border-left: 4px solid #c10007;
                      text-align: center;
                      margin: 20px 0;
                    }

                    .footer {
                      text-align: center;
                      padding: 20px;
                      font-size: 12px;
                      color: #666;
                      background: #f0f0f0;
                    }

                    .footer p {
                      margin: 5px 0;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <h1>Pastelería Chantilly</h1>
                    </div>
                    <div class="content">
                      <h2>Restablecer tu Contraseña</h2>
                      <p>Hola,</p>
                      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
                      <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>

                      <div style="text-align: center;">
                        <a href="%s" class="button">Restablecer Contraseña</a>
                      </div>

                      <p>O copia y pega este enlace en tu navegador:</p>
                      <div class="token">%s</div>

                      <div class="warning">
                        ⚠️ <strong>ESTE ENLACE EXPIRARÁ EN 15 MINUTOS</strong>
                      </div>

                      <p>Si no solicitaste este restablecimiento, por favor ignora este correo.</p>
                      <p>Atentamente,<br><strong>El equipo de Pastelería Chantilly</strong></p>
                    </div>
                    <div class="footer">
                      <p>© 2024 Pastelería Chantilly. Todos los derechos reservados.</p>
                      <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
                    </div>
                  </div>
                </body>
                </html>

            """.formatted(resetLink, resetLink);
    }

    private String buildTextBody(String resetLink) {
        return """
            RESTABLECIMIENTO DE CONTRASEÑA - PASTELERÍA CHANTILLY
                    
            Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
                    
            Para restablecer tu contraseña, visita el siguiente enlace:
            %s
                    
            ⚠️ ESTE ENLACE EXPIRARÁ EN 15 MINUTOS
                    
            Si no solicitaste este restablecimiento, por favor ignora este email.
                    
            Atentamente,
            El equipo de Pastelería Chantilly
                    
            © 2024 Pastelería Chantilly. Todos los derechos reservados.
            """.formatted(resetLink);
    }

    public Optional<String> validateResetToken(String token) {
        PasswordResetToken resetToken = tokens.get(token);

        if (resetToken == null) {
            System.out.println("❌ Token no encontrado: " + token);
            return Optional.empty();
        }

        if (resetToken.isExpired()) {
            tokens.remove(token);
            System.out.println("❌ Token expirado: " + token);
            return Optional.empty();
        }
        
        System.out.println("✅ Token válido para: " + resetToken.email);
        return Optional.of(resetToken.email);
    }
    
    public void invalidateToken(String token) {
        tokens.remove(token);
        System.out.println("🗑️ Token removido después de su uso: " + token);
    }
    // Método para limpieza de tokens expirados
    public void cleanupExpiredTokens() {
        int initialSize = tokens.size();
        tokens.entrySet().removeIf(entry -> entry.getValue().isExpired());
        int removed = initialSize - tokens.size();
        if (removed > 0) {
            System.out.println("🧹 Tokens expirados removidos: " + removed);
        }
    }
}
