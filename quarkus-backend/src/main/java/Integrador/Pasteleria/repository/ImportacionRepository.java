package Integrador.Pasteleria.repository;

import Integrador.Pasteleria.entity.Importacion;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ImportacionRepository implements PanacheRepository<Importacion> {
}
