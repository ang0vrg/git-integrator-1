package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.service.DetallePedidoService;
import Integrador.Pasteleria.dto.DetallePedidoDTO;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;

@Path("/detallepedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)   
public class DetallePedidoResource {
    @Inject
    DetallePedidoService detallePedidoService;

    @GET
    public Response getAllOrderDetails() {
        return Response.ok(detallePedidoService.getAllOrderDetails()).build();
    }

    @GET
    @Path("/{id}")
    public Response getOrderDetailById(@PathParam("id") Integer id) {
        return Response.ok(detallePedidoService.getOrderDetailById(id)).build();
    }

    @POST
    public Response createOrderDetail(DetallePedidoDTO detallePedidoDTO) {
        DetallePedidoDTO createdOrderDetail = detallePedidoService.createOrderDetail(detallePedidoDTO);
        return Response.status(Response.Status.CREATED).entity(createdOrderDetail).build();
    }

    @PUT
    @Path("/{id}")
    public Response updateOrderDetail(@PathParam("id") Integer id, DetallePedidoDTO detallePedidoDTO) {
        DetallePedidoDTO updatedOrderDetail = detallePedidoService.updateOrderDetail(id, detallePedidoDTO);
        return Response.ok(updatedOrderDetail).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteOrderDetail(@PathParam("id") Integer id) {
        detallePedidoService.deleteOrderDetail(id);
        return Response.noContent().build();
    }
}
