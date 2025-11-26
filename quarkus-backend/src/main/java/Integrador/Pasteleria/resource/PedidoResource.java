package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.PedidoDTO;
import Integrador.Pasteleria.service.PedidoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoResource {

    @Inject
    PedidoService pedidoService;

    @POST
    @RolesAllowed({ "cliente", "administrador", "trabajador" })
    public Response create(PedidoDTO dto) {
        PedidoDTO created = pedidoService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
