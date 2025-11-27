package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ContactDTO;
import Integrador.Pasteleria.service.EmailService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/contact")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ContactResource {

    @Inject
    EmailService emailService;

    @POST
    public Response sendContactMessage(ContactDTO contactDTO) {
        try {
            emailService.sendContactEmail(
                    contactDTO.getNombre(),
                    contactDTO.getApellido(),
                    contactDTO.getEmail(),
                    contactDTO.getTelefono(),
                    contactDTO.getAsunto(),
                    contactDTO.getMensaje());
            return Response.ok().entity("{\"message\": \"Mensaje enviado correctamente\"}").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.serverError().entity("{\"error\": \"Error al enviar el mensaje\"}").build();
        }
    }
}
