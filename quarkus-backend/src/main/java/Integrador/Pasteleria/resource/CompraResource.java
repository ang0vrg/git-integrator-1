package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.CompraDTO;
import Integrador.Pasteleria.service.CompraService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/compras")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class CompraResource {

    @Inject
    CompraService compraService;

    @POST
    public Response create(CompraDTO dto) {
        CompraDTO created = compraService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
