package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.service.ProductoService;
import Integrador.Pasteleria.dto.ProductoDTO;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;


@Path("/productos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProductoResource {
    @Inject
    ProductoService productoService;

    @GET
    public Response getAllProducts() {
        return Response.ok(productoService.getAllProducts()).build();
    }

    @GET
    @Path("/{id}")
    public Response getProductById(@PathParam("id") Integer id) {
        return Response.ok(productoService.getProductById(id)).build();
    }

    @POST
    public Response createProduct(ProductoDTO productoDTO) {
        ProductoDTO createdProduct = productoService.createProduct(productoDTO);
        return Response.status(Response.Status.CREATED).entity(createdProduct).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateProduct(@PathParam("id") Integer id, ProductoDTO productoDTO) {
        ProductoDTO updatedProduct = productoService.updateProduct(id, productoDTO);
        return Response.ok(updatedProduct).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteProduct(@PathParam("id") Integer id) {
        productoService.deleteProduct(id);
        return Response.noContent().build();
    }
}
