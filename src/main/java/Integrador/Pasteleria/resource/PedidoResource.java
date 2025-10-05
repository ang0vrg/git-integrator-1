package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.service.PedidoService;
import Integrador.Pasteleria.dto.CrearPedidoRequestDTO;
import Integrador.Pasteleria.dto.PedidoDTO;
// import Integrador.Pasteleria.dto.CrearPedidoRequestDTO; // Uncomment if this class exists
import jakarta.ws.rs.*;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.core.Response;
import jakarta.inject.Inject;

@Path("/pedidos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PedidoResource {
    @Inject
    PedidoService pedidoService;

    @GET
    public Response getAllOrders() {
        return Response.ok(pedidoService.getAllOrders()).build();
    }

    @GET
    @Path("/{id}")
    public Response getOrderById(@PathParam("id") Integer id) {
        return Response.ok(pedidoService.getOrderById(id)).build();
    }
    @POST
    public Response createOrder(CrearPedidoRequestDTO RequestDTO) {
        try {
            PedidoDTO createdOrder = pedidoService.createOrder(RequestDTO);
            return Response.status(Response.Status.CREATED).entity(createdOrder).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND).entity(e.getMessage()).build();//si el producto no existe
        } catch (IllegalArgumentException e) {
            return Response.status(Response.Status.BAD_REQUEST).entity(e.getMessage()).build();//si la cantidad es negativa
    }
}

    @PUT
    @Path("/{id}")
    public Response updateOrder(@PathParam("id") Integer id, PedidoDTO pedidoDTO) {
        PedidoDTO updatedOrder = pedidoService.updateOrder(id, pedidoDTO);
        return Response.ok(updatedOrder).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deleteOrder(@PathParam("id") Integer id) {
        pedidoService.deleteOrder(id);
        return Response.noContent().build();
    }
}
