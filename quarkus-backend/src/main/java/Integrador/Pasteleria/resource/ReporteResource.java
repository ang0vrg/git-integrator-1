package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ReporteDTO;
import Integrador.Pasteleria.service.ReporteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/reportes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class ReporteResource {

    @Inject
    ReporteService reporteService;

    @POST
    public Response create(ReporteDTO dto) {
        ReporteDTO created = reporteService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }
}
