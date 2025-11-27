package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.PagoDTO;
import Integrador.Pasteleria.service.PagoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/pagos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PagoResource {

    @Inject
    PagoService pagoService;

    @POST
    @RolesAllowed({ "cliente", "administrador", "trabajador" }) // Permitir a clientes pagar
    public Response registrarPago(PagoDTO dto) {
        PagoDTO created = pagoService.registrarPago(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
