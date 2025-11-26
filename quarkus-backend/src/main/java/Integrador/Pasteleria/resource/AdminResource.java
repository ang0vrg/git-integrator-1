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

@Path("/api/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed("administrador")
public class AdminResource {

    @Inject
    UsuarioService usuarioService;

    @Inject
    UsuarioExportService exportService;

    @GET
    @Path("/users")
    public Response listUsers(@QueryParam("role") String role) {
        try {
            List<UsuarioDTO> usuarios = usuarioService.listUsers(role);
            return Response.ok(usuarios).build();
        } catch (Exception e) {
            return Response.serverError()
                    .entity("Error al listar usuarios: " + e.getMessage())
                    .build();
        }
    }

    @DELETE
    @Path("/users/{id}")
    public Response deleteUser(@PathParam("id") Integer id) {
        return usuarioService.deleteById(id)
                ? Response.noContent().build()
                : Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuario no encontrado").build();
    }

    @GET
    @Path("/users/export/excel")
    @Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public Response exportExcel(@QueryParam("role") String role) throws Exception {
        List<UsuarioDTO> list = usuarioService.listUsers(role);
        System.out.println("📦 Usuarios a exportar: " + list.size() + " registros");
        return exportService.exportExcel(list);
    }

}
