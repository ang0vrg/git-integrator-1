package Integrador.Pasteleria.resource;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@Path("/mail")
public class TestMailerResource {

    @Inject
    ReactiveMailer mailer;

    @ConfigProperty(name = "MAIL_TEST_RECIPIENT", defaultValue = "test@example.com")
    String testRecipient;

    // Provide a safe default so dev startup doesn't fail if the env var is not set.
    @ConfigProperty(name = "QUARKUS_MAILER_FROM", defaultValue = "no-reply@localhost")
    String mailFrom;

    @GET
    @Path("/test")
    @Produces(MediaType.TEXT_PLAIN)
    public String sendTestMail() {
        try {
            mailer.send(
                    Mail.withText(
                            testRecipient,
                            "📧 Prueba de envío con Quarkus + Gmail",
                            """
                                    ¡Hola!
                                    Este es un correo de prueba enviado desde Quarkus usando el servidor SMTP de Gmail.

                                    Si lo recibiste, la configuración funciona correctamente ✅
                                    """).setFrom(mailFrom))
                    .subscribe().with(
                            success -> System.out.println("✅ Correo enviado correctamente a: " + testRecipient),
                            failure -> failure.printStackTrace());

            return "✅ Envío iniciado. Revisa la consola y tu correo (" + testRecipient + ")";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Error enviando correo: " + e.getMessage();
        }
    }
}
