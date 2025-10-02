package Integrador.Pasteleria.Repositorio;

import Integrador.Pasteleria.entity.Proveedor;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;

@ApplicationScoped
public class ProveedorRepositorio {
    @Inject
    EntityManager em;

    public List<Proveedor> findAll() {
        return em.createQuery("SELECT p FROM Proveedor p", Proveedor.class).getResultList();
    }

    public Proveedor findById(Integer id) {
        return em.find(Proveedor.class, id);
    }

    @Transactional
    public Proveedor save(Proveedor proveedor) {
        em.persist(proveedor);
        return proveedor;
    }

    @Transactional
    public Proveedor update(Proveedor proveedor) {
        return em.merge(proveedor);
    }

    @Transactional
    public void delete(Integer id) {
        Proveedor proveedor = em.find(Proveedor.class, id);
        if (proveedor != null) {
            em.remove(proveedor);
        }
    }
}
