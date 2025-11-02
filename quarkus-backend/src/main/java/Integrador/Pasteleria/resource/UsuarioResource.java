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
@RolesAllowed({ "administrador", "trabajador" }) // ambos pueden LEER
public class UsuarioResource {

    @Inject
    UsuarioService usuarioService;

    /* ---------- LISTADO (filtro opcional) ---------- */
    @GET
    public List<UsuarioDTO> list(@QueryParam("role") String role) {
        if (role == null || role.isBlank()) {
            return usuarioService.listUsers(null); // ← sin WHERE
        }
        return usuarioService.listUsers(role);
    }

    /* ---------- CAMBIAR ROL (solo admin) ---------- */
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

    /* ---------- ELIMINAR (solo admin) ---------- */
    @DELETE
    @Path("{id}")
    @RolesAllowed("administrador")
    public Response delete(@PathParam("id") Integer id) {
        boolean ok = usuarioService.deleteById(id);
        return ok ? Response.noContent().build()
                : Response.status(404).build();
    }
}