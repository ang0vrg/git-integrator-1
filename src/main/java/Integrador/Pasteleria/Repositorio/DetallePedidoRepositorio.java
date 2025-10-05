package Integrador.Pasteleria.Repositorio;

import Integrador.Pasteleria.entity.DetallePedido;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
@ApplicationScoped
public class DetallePedidoRepositorio {
    @Inject
    EntityManager em;

    public List<DetallePedido> findAll() {
        return em.createQuery("SELECT dp FROM DetallePedido dp", DetallePedido.class).getResultList();
    }

    public DetallePedido findById(Integer id) {
        return em.find(DetallePedido.class, id);
    }

    @Transactional
    public DetallePedido save(DetallePedido detallePedido) {
        em.persist(detallePedido);
        return detallePedido;
    }

    @Transactional
    public DetallePedido update(DetallePedido detallePedido) {
        return em.merge(detallePedido);
    }

    @Transactional
    public void delete(Integer id) {
        DetallePedido detallePedido = em.find(DetallePedido.class, id);
        if (detallePedido != null) {
            em.remove(detallePedido);
        }
    }
}
