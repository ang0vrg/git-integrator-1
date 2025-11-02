package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.entity.Producto;
import Integrador.Pasteleria.service.ProductoService;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
import java.util.Map;

@Path("/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {

    @Inject
    ProductoService productoService;

    // LIST con soporte a _start y _end usados por react-admin
    @GET
    public Response list(@QueryParam("_start") Integer start, @QueryParam("_end") Integer end) {
        try {
            int s = (start == null) ? 0 : start;
            int e = (end == null) ? (s + 25) : end;
            int limit = Math.max(1, e - s);
            List<Producto> items = productoService.list(s, limit);
            long total = productoService.count();
            // React-Admin (simple-rest) expects the Content-Range header prefixed with 'items'
            // For empty result sets avoid negative end index (s + size - 1 can be -1). Use 0 as end when empty.
            int endIndex = items.size() == 0 ? 0 : (s + items.size() - 1);
            String contentRange = String.format("items %d-%d/%d", s, endIndex, total);
            return Response.ok(items).header("Content-Range", contentRange).build();
        } catch (Exception e) {
            // Print stacktrace to server logs and return a JSON error for easier debugging in dev
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("ok", false, "error", e.getMessage()))
                    .build();
        }
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") Integer id) {
        return productoService.findById(id).map(p -> Response.ok(p).build())
                .orElse(Response.status(Response.Status.NOT_FOUND).build());
    }

    @POST
    public Response create(Producto producto) {
        try {
            Producto created = productoService.create(producto);
            return Response.created(URI.create("/productos/" + created.getIdProduct())).entity(created).build();
        } catch (Exception e) {
            e.printStackTrace();
            // Detect duplicate-key / constraint violations and return 409 Conflict
            Throwable root = e;
            while (root.getCause() != null) {
                root = root.getCause();
            }
            String rootMsg = root.getMessage() != null ? root.getMessage() : e.getMessage();
            if (rootMsg != null && rootMsg.toLowerCase().contains("duplicate")) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(Map.of("ok", false, "error", rootMsg)).build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("ok", false, "error", e.getMessage())).build();
        }
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") Integer id, Producto producto) {
        try {
            Producto updated = productoService.update(id, producto);
            if (updated == null) return Response.status(Response.Status.NOT_FOUND).build();
            return Response.ok(updated).build();
        } catch (Exception e) {
            e.printStackTrace();
            Throwable root = e;
            while (root.getCause() != null) {
                root = root.getCause();
            }
            String rootMsg = root.getMessage() != null ? root.getMessage() : e.getMessage();
            if (rootMsg != null && rootMsg.toLowerCase().contains("duplicate")) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(Map.of("ok", false, "error", rootMsg)).build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("ok", false, "error", e.getMessage())).build();
        }
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") Integer id) {
        try {
            boolean ok = productoService.delete(id);
            if (!ok) return Response.status(Response.Status.NOT_FOUND).build();
            return Response.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            Throwable root = e;
            while (root.getCause() != null) {
                root = root.getCause();
            }
            String rootMsg = root.getMessage() != null ? root.getMessage() : e.getMessage();
            if (rootMsg != null && rootMsg.toLowerCase().contains("duplicate")) {
                return Response.status(Response.Status.CONFLICT)
                        .entity(Map.of("ok", false, "error", rootMsg)).build();
            }
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Map.of("ok", false, "error", e.getMessage())).build();
        }
    }
}
