package Integrador.Pasteleria.service;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class EmailService {

    @Inject
    Mailer mailer;

    @ConfigProperty(name = "quarkus.mailer.from")
    String fromEmail;

    public void sendContactEmail(String nombre, String apellido, String email, String telefono, String asunto,
            String mensaje) {
        String subject = "Nuevo Mensaje de Contacto: " + asunto;
        String body = String.format("""
                Has recibido un nuevo mensaje de contacto desde la web:

                Nombre: %s %s
                Email: %s
                Teléfono: %s
                Asunto: %s

                Mensaje:
                %s
                """, nombre, apellido, email, telefono != null ? telefono : "N/A", asunto, mensaje);

        // Send to self (or configured admin email)
        // For now, we send to the 'from' email as it's likely the business email
        mailer.send(Mail.withText(fromEmail, subject, body).setReplyTo(email));
    }
}
