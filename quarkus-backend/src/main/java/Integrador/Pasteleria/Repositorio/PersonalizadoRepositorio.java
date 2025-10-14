package Integrador.Pasteleria.Repositorio;

import Integrador.Pasteleria.entity.Personalizado;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class PersonalizadoRepositorio {

    @Inject
    EntityManager em;

    @Transactional
    public void guardar(Personalizado pedido) {
        em.persist(pedido);
    }

    public List<Personalizado> listar() {
        return em.createQuery("FROM Personalizado", Personalizado.class).getResultList();
    }
}