package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.QuejaRequest;
import Integrador.Pasteleria.service.QuejaService;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.Map;

/**
 * Recurso de la API REST para manejar las quejas.
 * Endpoints para el formulario (POST) y para la gestión (GET, PUT).
 */
@Path("/api/quejas")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class QuejaResource {

    @Inject
    QuejaService quejaService;

    /* Endpoints para el formulario de contacto (frontend público) */

    /**
     * Método POST para registrar una queja enviada desde contacto.
     * 
     * @param request Datos de la queja
     * @return 201 Created si el registro es exitoso
     */
    @POST
    public Response createQueja(QuejaRequest request) {

        // Validación básica de campos obligatorios
        if (request.email == null || request.email.isEmpty() ||
                request.message == null || request.message.isEmpty()) {

            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Collections.singletonMap("error",
                            "Los campos correo electrónico y mensaje son obligatorios"))
                    .build();
        }

        try {
            quejaService.registrarQueja(request);

            // 201 Created → registro exitoso
            return Response.status(Response.Status.CREATED)
                    .entity(Collections.singletonMap("message", "Queja registrada exitosamente"))
                    .build();

        } catch (Exception e) {
            System.err.println("Error interno al registrar la queja: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Collections.singletonMap("error",
                            "Ocurrió un error en el servidor al procesar la queja"))
                    .build();
        }
    }

    // ============================
    // Gestión de quejas (admin)
    // ============================

    /**
     * Método GET para obtener todas las quejas registradas
     * 
     * @return 200 OK con la lista de quejas
     */
    @GET
    public Response getAllQuejas() {
        return Response.ok(quejaService.listarTodasLasQuejas()).build();
    }

    /**
     * Método PUT para actualizar el estado de una queja específica.
     * 
     * @param id              ID de la queja a actualizar
     * @param estadoUpdateMap Mapa que contiene el nuevo estado
     * @return 200 OK con la queja actualizada
     */
    @PUT
    @Path("/{id}")
    public Response updateQuejaStatus(@PathParam("id") Long id, Map<String, String> estadoUpdateMap) {

        String nuevoEstado = estadoUpdateMap.get("estado");

        if (nuevoEstado == null || nuevoEstado.trim().isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Collections.singletonMap("error", "El campo 'estado' es obligatorio"))
                    .build();
        }

        try {
            quejaService.actualizarEstadoQueja(id, nuevoEstado);

            return Response.ok(Collections.singletonMap(
                    "message", "Estado de la queja actualizado exitosamente a: " + nuevoEstado))
                    .build();

        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Collections.singletonMap("error", e.getMessage()))
                    .build();

        } catch (Exception e) {
            System.err.println("Error al actualizar la queja: " + e.getMessage());
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity(Collections.singletonMap("error",
                            "Error interno al actualizar el estado de la queja"))
                    .build();
        }
    }
}
