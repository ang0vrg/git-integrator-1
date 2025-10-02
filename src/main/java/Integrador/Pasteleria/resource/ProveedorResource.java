package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.service.ProveedorService;
import Integrador.Pasteleria.dto.ProveedorDTO;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.*;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.inject.Inject;
@Path("/proveedores")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProveedorResource {
    @Inject
    ProveedorService proveedorService;

    @GET
    public Response getAllSuppliers() {
        return Response.ok(proveedorService.getAllSuppliers()).build();
    }

    @GET
    @Path("/{id}")
    public Response getSupplierById(@PathParam("id") Integer id) {
        return Response.ok(proveedorService.getSupplierById(id)).build();
    }

    @POST
    public Response createSupplier(ProveedorDTO proveedorDTO) {
        ProveedorDTO createdSupplier = proveedorService.createSupplier(proveedorDTO);
        return Response.status(Response.Status.CREATED).entity(createdSupplier).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateSupplier(@PathParam("id") Integer id, ProveedorDTO proveedorDTO) {
        ProveedorDTO updatedSupplier = proveedorService.updateSupplier(id, proveedorDTO);
        return Response.ok(updatedSupplier).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteSupplier(@PathParam("id") Integer id) {
        proveedorService.deleteSupplier(id);
        return Response.noContent().build();
    }
}
