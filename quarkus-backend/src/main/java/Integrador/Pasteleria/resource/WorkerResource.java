package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.UsuarioDTO;
import Integrador.Pasteleria.service.UsuarioService;
import Integrador.Pasteleria.service.UsuarioExportService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/worker")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "trabajador", "administrador" })
public class WorkerResource {

    @Inject
    UsuarioService usuarioService;

    /* LISTAR + FILTRO POR ROL */
    @GET
    @Path("/users")
    public List<UsuarioDTO> listUsers(@QueryParam("role") String role) {
        return usuarioService.listUsers(role);
    }

    /* EXPORTAR EXCEL (sin eliminar) */
    @GET
    @Path("/users/export/excel")
    @Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public Response exportExcel(@QueryParam("role") String role) throws Exception {
        return new UsuarioExportService().exportExcel(usuarioService.listUsers(role));
    }
}