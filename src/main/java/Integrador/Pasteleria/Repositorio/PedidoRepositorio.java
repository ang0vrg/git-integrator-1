package Integrador.Pasteleria.Repositorio;

import Integrador.Pasteleria.entity.Pedido;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;

@ApplicationScoped
public class PedidoRepositorio {
    @Inject
    EntityManager em;

    public List<Pedido> findAll() {
        return em.createQuery("SELECT p FROM Pedido p", Pedido.class).getResultList();
    }

    public Pedido findById(Integer id) {
        return em.find(Pedido.class, id);
    }

    @Transactional
    public Pedido save(Pedido pedido) {
        em.persist(pedido);
        return pedido;
    }

    @Transactional
    public Pedido update(Pedido pedido) {
        return em.merge(pedido);
    }

    @Transactional
    public void delete(Integer id) {
        Pedido pedido = em.find(Pedido.class, id);
        if (pedido != null) {
            em.remove(pedido);
        }
    }
}
