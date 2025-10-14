package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.PersonalizadoDTO;
import Integrador.Pasteleria.entity.Personalizado;
import Integrador.Pasteleria.Repositorio.PersonalizadoRepositorio;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/personalizar")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PersonalizadoResource {

    @Inject
    PersonalizadoRepositorio repositorio;

    @POST
    @Transactional
    public Response guardar(PersonalizadoDTO dto) {
        Personalizado pedido = new Personalizado();
        pedido.setTamano(dto.getTamano());
        pedido.setPisos(dto.getPisos());
        pedido.setSabor(dto.getSabor());
        pedido.setDecoracion(dto.getDecoracion());
        pedido.setMensajeTorta(dto.getMensajeTorta());
        pedido.setFechaEntrega(dto.getFechaEntrega());
        pedido.setMetodoEntrega(dto.getMetodoEntrega());
        pedido.setComentarioAdicional(dto.getComentarioAdicional());
        System.out.println("📥 Pedido recibido: " + dto);
        repositorio.guardar(pedido);
        return Response.ok(pedido).build();
        
       


    }
}