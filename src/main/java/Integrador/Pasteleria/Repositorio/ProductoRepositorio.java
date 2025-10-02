package Integrador.Pasteleria.Repositorio;

import Integrador.Pasteleria.entity.Producto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ProductoRepositorio {
    @Inject
    EntityManager em;

    public List<Producto> findAll() {
        return em.createQuery("SELECT p FROM Producto p", Producto.class).getResultList();
    }

    public Producto findById(Integer id) {
        return em.find(Producto.class, id);
    }

    @Transactional
    public Producto save(Producto producto) {
        em.persist(producto);
        return producto;
    }

    @Transactional
    public Producto update(Producto producto) {
        return em.merge(producto);
    }

    @Transactional
    public void delete(Integer id) {
        Producto producto = em.find(Producto.class, id);
        if (producto != null) {
            em.remove(producto);
        }
    }
}
