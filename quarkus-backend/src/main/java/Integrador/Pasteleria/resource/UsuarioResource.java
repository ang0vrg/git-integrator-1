package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.UsuarioDTO;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/api/admin/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class UsuarioResource {

    @Inject
    UsuarioService usuarioService;

    @GET
    public List<UsuarioDTO> list(@QueryParam("role") String role) {
        return usuarioService.listUsers(role);
    }

    @PATCH
    @Path("{id}/role")
    @RolesAllowed("administrador")
    public Response changeRole(@PathParam("id") Integer id,
            Map<String, String> body) {
        boolean ok = usuarioService.updateUserRole(id,
                Usuario.Role.valueOf(body.get("role")));
        return ok ? Response.ok().build()
                : Response.status(404).build();
    }

    @DELETE
    @Path("{id}")
    @RolesAllowed("administrador")
    public Response delete(@PathParam("id") Integer id) {
        boolean ok = usuarioService.deleteById(id);
        return ok ? Response.noContent().build()
                : Response.status(404).build();
    }

    @GET
    @Path("/stats")
    public Response getUserStats() {
        try {
            return Response.ok(usuarioService.getUserStats()).build();
        } catch (Exception e) {
            return Response.serverError()
                    .entity("Error al obtener estadísticas: " + e.getMessage())
                    .build();
        }
    }
}