package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ProveedorDTO;
import Integrador.Pasteleria.service.ProveedorService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/proveedores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class ProveedorResource {

    @Inject
    ProveedorService proveedorService;

    @GET
    public List<ProveedorDTO> list() {
        return proveedorService.findAll();
    }

    @POST
    public Response create(ProveedorDTO dto) {
        ProveedorDTO created = proveedorService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, ProveedorDTO dto) {
        ProveedorDTO updated = proveedorService.update(id, dto);
        if (updated != null) {
            return Response.ok(updated).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        boolean deleted = proveedorService.delete(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
