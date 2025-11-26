package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.UsuarioDTO;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;
import org.eclipse.microprofile.jwt.JsonWebToken;
import java.util.HashMap;
import java.util.Map;

@Path("/api/cliente")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ClienteResource {

    @Inject
    JsonWebToken jwt;

    @Inject
    UsuarioService usuarioService;

    /**
     * Accesible por TODOS los roles autenticados
     * Obtiene el perfil del usuario actual desde la base de datos
     */
    @GET
    @Path("/profile")
    @RolesAllowed({ "cliente", "trabajador", "administrador" })
    public Response getProfile(@Context SecurityContext securityContext) {
        String email = jwt.getName();

        return usuarioService.findByUserEmail(email)
                .map(usuario -> {
                    UsuarioDTO dto = new UsuarioDTO();
                    dto.setIdUser(usuario.getIdUser());
                    dto.setUsername(usuario.getUsername());
                    dto.setUserEmail(usuario.getUserEmail());
                    dto.setUserRole(usuario.getUserRole().name());
                    dto.setPhoneNumber(usuario.getPhoneNumber());
                    dto.setCreatedAt(usuario.getCreatedAt());
                    dto.setLastAccess(usuario.getLastAccess());
                    dto.setActive(usuario.getActive());
                    return Response.ok(dto).build();
                })
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    /**
     * Solo accesible por CLIENTES (y superiores)
     * Crea un nuevo pedido
     */
    @POST
    @Path("/orders")
    @RolesAllowed({ "cliente", "trabajador", "administrador" })
    public Response createOrder(Map<String, Object> orderData) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Pedido creado exitosamente");
        response.put("userEmail", jwt.getName());
        response.put("orderData", orderData);

        return Response.status(Response.Status.CREATED).entity(response).build();
    }

    /**
     * Solo accesible por CLIENTES (y superiores)
     * Obtiene los pedidos del usuario actual
     */
    @GET
    @Path("/orders")
    @RolesAllowed({ "cliente", "trabajador", "administrador" })
    public Response getMyOrders() {
        Map<String, Object> response = new HashMap<>();
        response.put("userEmail", jwt.getName());
        response.put("orders", "[]"); // Por ahora vacío

        return Response.ok(response).build();
    }
}
