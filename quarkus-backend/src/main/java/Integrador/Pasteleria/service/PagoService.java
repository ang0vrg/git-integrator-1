package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.PagoDTO;
import Integrador.Pasteleria.entity.Pago;
import Integrador.Pasteleria.repository.PagoRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;

@ApplicationScoped
public class PagoService {

    @Inject
    PagoRepository pagoRepository;

    @Transactional
    public PagoDTO registrarPago(PagoDTO dto) {
        Pago pago = new Pago();
        pago.setMonto(dto.getMonto());
        pago.setMetodoPago(dto.getMetodoPago());
        pago.setFecha(LocalDateTime.now());
        pago.setEstado("COMPLETADO"); // En este mock, asumimos éxito
        pago.setCodigoOperacion(dto.getCodigoOperacion());
        pago.setIdVenta(dto.getIdVenta());

        pagoRepository.persist(pago);

        dto.setIdPago(pago.getIdPago());
        dto.setFecha(pago.getFecha());
        dto.setEstado(pago.getEstado());

        return dto;
    }
}
