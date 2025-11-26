package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.VentaDTO;
import Integrador.Pasteleria.service.VentaService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/ventas")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class VentaResource {

    @Inject
    VentaService ventaService;

    @POST
    public Response create(VentaDTO dto) {
        VentaDTO created = ventaService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
