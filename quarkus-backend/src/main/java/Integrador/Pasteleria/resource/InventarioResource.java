package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.IngredienteDTO;
import Integrador.Pasteleria.service.IngredienteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import java.util.Map;

@Path("/api/admin/inventario")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class InventarioResource {

    @Inject
    IngredienteService ingredienteService;

    @GET
    public List<IngredienteDTO> list(@QueryParam("categoria") String categoria) {
        return ingredienteService.findAll(categoria);
    }

    @GET
    @Path("/bajo-stock")
    public List<IngredienteDTO> getBajoStock() {
        return ingredienteService.findBajoStock();
    }

    @GET
    @Path("/estadisticas")
    public Response getEstadisticas() {
        Map<String, Object> stats = ingredienteService.getInventoryStatistics();
        return Response.ok(stats).build();
    }

    @POST
    @Path("/{id}/movimiento")
    @RolesAllowed("administrador")
    public Response registrarMovimiento(
            @PathParam("id") Integer id,
            MovimientoRequest request) {

        boolean success = ingredienteService.registrarMovimiento(
                id,
                request.getCantidad(),
                request.getTipo(),
                request.getMotivo());

        if (success) {
            return Response.ok(Map.of("ok", true, "msg", "Movimiento registrado exitosamente")).build();
        } else {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("ok", false, "msg", "Error al registrar movimiento"))
                    .build();
        }
    }

    public static class MovimientoRequest {
        private java.math.BigDecimal cantidad;
        private String tipo; // "entrada" o "salida"
        private String motivo;

        public java.math.BigDecimal getCantidad() {
            return cantidad;
        }

        public void setCantidad(java.math.BigDecimal cantidad) {
            this.cantidad = cantidad;
        }

        public String getTipo() {
            return tipo;
        }

        public void setTipo(String tipo) {
            this.tipo = tipo;
        }

        public String getMotivo() {
            return motivo;
        }

        public void setMotivo(String motivo) {
            this.motivo = motivo;
        }
    }
}
