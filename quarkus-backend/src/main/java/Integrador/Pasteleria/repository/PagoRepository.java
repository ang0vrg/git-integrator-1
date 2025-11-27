package Integrador.Pasteleria.repository;

import Integrador.Pasteleria.entity.Pago;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PagoRepository implements PanacheRepository<Pago> {
}
