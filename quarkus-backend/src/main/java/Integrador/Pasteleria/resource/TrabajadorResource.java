// quarkus-backend\src\main\java\Integrador\Pasteleria\resource\TrabajadorResource.java
package Integrador.Pasteleria.resource;

import jakarta.annotation.security.RolesAllowed;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Path("/api/trabajador")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TrabajadorResource {

    /**
     * Accesible por TRABAJADORES y ADMINISTRADORES
     * Obtiene órdenes pendientes
     */
    @GET
    @Path("/orders/pending")
    @RolesAllowed({"trabajador", "administrador"})
    public Response getPendingOrders() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Órdenes pendientes");
        response.put("timestamp", LocalDateTime.now());
        response.put("orders", "[]"); // Por ahora vacío
        
        return Response.ok(response).build();
    }

    /**
     * Accesible por TRABAJADORES y ADMINISTRADORES
     * Actualiza el estado de una orden
     */
    @PUT
    @Path("/orders/{orderId}/status")
    @RolesAllowed({"trabajador", "administrador"})
    public Response updateOrderStatus(@PathParam("orderId") Long orderId,
                                     @QueryParam("status") String status) {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Estado de orden actualizado");
        response.put("orderId", orderId);
        response.put("newStatus", status);
        
        return Response.ok(response).build();
    }

    /**
     * Accesible por TRABAJADORES y ADMINISTRADORES
     * Vista del dashboard de trabajador
     */
    @GET
    @Path("/dashboard")
    @RolesAllowed({"trabajador", "administrador"})
    public Response getDashboard() {
        Map<String, Object> response = new HashMap<>();
        response.put("totalOrders", 0);
        response.put("pendingOrders", 0);
        response.put("completedToday", 0);
        
        return Response.ok(response).build();
    }
}
