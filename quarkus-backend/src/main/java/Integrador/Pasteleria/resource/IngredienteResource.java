package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.IngredienteDTO;
import Integrador.Pasteleria.service.IngredienteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/ingredientes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class IngredienteResource {

    @Inject
    IngredienteService ingredienteService;

    @GET
    public List<IngredienteDTO> list() {
        return ingredienteService.findAll();
    }

    @POST
    public Response create(IngredienteDTO dto) {
        IngredienteDTO created = ingredienteService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, IngredienteDTO dto) {
        IngredienteDTO updated = ingredienteService.update(id, dto);
        if (updated != null) {
            return Response.ok(updated).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        boolean deleted = ingredienteService.delete(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
