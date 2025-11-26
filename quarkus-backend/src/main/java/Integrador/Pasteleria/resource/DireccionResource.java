package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.DireccionDTO;
import Integrador.Pasteleria.service.DireccionService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/direcciones")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "cliente", "administrador", "trabajador" })
public class DireccionResource {

    @Inject
    DireccionService direccionService;

    @GET
    @Path("/usuario/{idUsuario}")
    public List<DireccionDTO> findByUsuario(@PathParam("idUsuario") Integer idUsuario) {
        return direccionService.findByUsuario(idUsuario);
    }

    @POST
    public Response create(DireccionDTO dto) {
        DireccionDTO created = direccionService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, DireccionDTO dto) {
        DireccionDTO updated = direccionService.update(id, dto);
        if (updated != null) {
            return Response.ok(updated).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        boolean deleted = direccionService.delete(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
