package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.QuejaRequest;
import Integrador.Pasteleria.entity.Queja;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.NotFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Servicio para registrar y gestionar las quejas
 */
@ApplicationScoped
public class QuejaService {

    /**
     * Guarda una queja enviada desde el formulario de contacto
     * 
     * @param request objeto con los datos recibidos del formulario
     * @return La entidad queja guardada.
     */
    @Transactional
    public Queja registrarQueja(QuejaRequest request) {

        Queja nuevaQueja = new Queja();

        // Mapeo de DTO a Entidad
        nuevaQueja.firstName = request.firstName;
        nuevaQueja.lastName = request.lastName;
        nuevaQueja.email = request.email;
        nuevaQueja.phone = request.phone;
        nuevaQueja.subject = request.subject;
        nuevaQueja.message = request.message;

        // Establece valores iniciales de gestión
        nuevaQueja.fechaRegistro = LocalDateTime.now();
        nuevaQueja.estado = "Pendiente"; // Estado inicial

        nuevaQueja.persist();

        return nuevaQueja;
    }

    /**
     * Obtiene el listado completo de todas las quejas registradas
     * 
     * @return Lista de entidades Queja
     */
    public List<Queja> listarTodasLasQuejas() {
        return Queja.listAll();
    }

    /**
     * Actualiza el estado de una queja específica por su ID
     * 
     * @param id          ID de la queja a actualizar
     * @param nuevoEstado El nuevo estado
     * @return La entidad queja actualizada
     * @throws NotFoundException si no se encuentra la queja
     */
    @Transactional
    public Queja actualizarEstadoQueja(Long id, String nuevoEstado) {

        Optional<Queja> quejaOptional = Queja.findByIdOptional(id);

        if (quejaOptional.isEmpty()) {
            throw new NotFoundException("No se encontró la queja con ID: " + id);
        }

        Queja queja = quejaOptional.get();
        queja.estado = nuevoEstado;

        return queja;
    }
}
