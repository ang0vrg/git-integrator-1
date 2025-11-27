package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ProductoDTO;
import Integrador.Pasteleria.service.ProductoService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {

    @Inject
    ProductoService productoService;

    @GET
    public List<ProductoDTO> list() {
        return productoService.findAll();
    }

    @POST
    @RolesAllowed({ "administrador", "trabajador" })
    public Response create(ProductoDTO dto) {
        ProductoDTO created = productoService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response update(@PathParam("id") Integer id, ProductoDTO dto) {
        ProductoDTO updated = productoService.update(id, dto);
        if (updated != null) {
            return Response.ok(updated).build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @POST
    @Path("/{id}/image")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response uploadImage(@PathParam("id") Integer id, java.util.Map<String, String> body) {
        String base64Image = body.get("image");
        if (base64Image == null || base64Image.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Image data is required").build();
        }

        boolean updated = productoService.updateImage(id, base64Image);
        if (updated) {
            return Response.ok().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response delete(@PathParam("id") Integer id) {
        boolean deleted = productoService.delete(id);
        if (deleted) {
            return Response.noContent().build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }
}
