// quarkus-backend\src\main\java\Integrador\Pasteleria\resource\AdminResource.java
package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/admin")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminResource {

    @Inject
    UsuarioService usuarioService;

    /**
     * Solo accesible por ADMINISTRADORES
     * Obtiene todos los usuarios del sistema
     */
    @GET
    @Path("/users")
    @RolesAllowed("administrador")
    public Response getAllUsers() {
        try {
            List<Usuario> users = usuarioService.findAllUsers();
            return Response.ok(users).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al obtener usuarios: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Solo accesible por ADMINISTRADORES
     * Elimina un usuario por su ID
     */
    @DELETE
    @Path("/users/{id}")
    @RolesAllowed("administrador")
    public Response deleteUser(@PathParam("id") Integer userId) {
        try {
            boolean deleted = usuarioService.deleteUser(userId);
            if (deleted) {
                return Response.ok("Usuario eliminado exitosamente").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuario no encontrado")
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al eliminar usuario: " + e.getMessage())
                    .build();
        }
    }

    /**
     * Solo accesible por ADMINISTRADORES
     * Cambia el rol de un usuario
     */
    @PUT
    @Path("/users/{id}/role")
    @RolesAllowed("administrador")
    public Response changeUserRole(@PathParam("id") Integer userId,
            @QueryParam("role") String newRole) {
        try {
            Usuario.Role role;
            try {
                role = Usuario.Role.valueOf(newRole);
            } catch (IllegalArgumentException e) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Rol inválido. Roles permitidos: cliente, trabajador, administrador")
                        .build();
            }

            boolean updated = usuarioService.updateUserRole(userId, role);
            if (updated) {
                return Response.ok("Rol actualizado exitosamente").build();
            } else {
                return Response.status(Response.Status.NOT_FOUND)
                        .entity("Usuario no encontrado")
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Error al actualizar rol: " + e.getMessage())
                    .build();
        }
    }
}
