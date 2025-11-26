package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.RecetaDTO;
import Integrador.Pasteleria.service.RecetaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/recetas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class RecetaResource {

    @Inject
    RecetaService recetaService;

    @GET
    public List<RecetaDTO> list() {
        return recetaService.findAll();
    }

    @POST
    public Response create(RecetaDTO dto) {
        RecetaDTO created = recetaService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
