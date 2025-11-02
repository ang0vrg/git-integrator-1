package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Producto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class ProductoService {

    @Inject
    EntityManager em;

    public List<Producto> list(int start, int limit) {
        return em.createQuery("SELECT p FROM Producto p ORDER BY p.addedOn DESC", Producto.class)
                .setFirstResult(start)
                .setMaxResults(limit)
                .getResultList();
    }

    public long count() {
        return em.createQuery("SELECT COUNT(p) FROM Producto p", Long.class).getSingleResult();
    }

    public Optional<Producto> findById(Integer id) {
        return Optional.ofNullable(em.find(Producto.class, id));
    }

    @Transactional
    public Producto create(Producto p) {
        em.persist(p);
        return p;
    }

    @Transactional
    public Producto update(Integer id, Producto p) {
        Producto existing = em.find(Producto.class, id);
        if (existing == null) return null;
        existing.setProductName(p.getProductName());
        existing.setProductDescription(p.getProductDescription());
        existing.setProductQuantity(p.getProductQuantity());
        existing.setProductPrice(p.getProductPrice());
        existing.setProductImageId(p.getProductImageId());
        em.merge(existing);
        return existing;
    }

    @Transactional
    public boolean delete(Integer id) {
        Producto p = em.find(Producto.class, id);
        if (p == null) return false;
        em.remove(p);
        return true;
    }
}
