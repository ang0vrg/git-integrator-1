package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.dto.ProveedorDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProveedorService {

    @Inject
    EntityManager em;

    public List<ProveedorDTO> findAll() {
        return em.createQuery("SELECT p FROM Proveedor p WHERE p.active = true", Proveedor.class)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProveedorDTO create(ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        updateEntityFromDTO(proveedor, dto);
        em.persist(proveedor);
        return convertToDTO(proveedor);
    }

    @Transactional
    public ProveedorDTO update(Integer id, ProveedorDTO dto) {
        Proveedor proveedor = em.find(Proveedor.class, id);
        if (proveedor != null) {
            updateEntityFromDTO(proveedor, dto);
            em.merge(proveedor);
            return convertToDTO(proveedor);
        }
        return null;
    }

    @Transactional
    public boolean delete(Integer id) {
        Proveedor proveedor = em.find(Proveedor.class, id);
        if (proveedor != null) {
            proveedor.setActive(false);
            em.merge(proveedor);
            return true;
        }
        return false;
    }

    private void updateEntityFromDTO(Proveedor entity, ProveedorDTO dto) {
        entity.setSupplierName(dto.getSupplierName());
        entity.setBusinessName(dto.getBusinessName());
        entity.setRuc(dto.getRuc());
        entity.setContactName(dto.getContactName());
        entity.setContactPhone(dto.getContactPhone());
        entity.setContactEmail(dto.getContactEmail());
        entity.setAddress(dto.getAddress());
        entity.setDistrict(dto.getDistrict());
        entity.setCity(dto.getCity());
        entity.setDeliveryTimeDays(dto.getDeliveryTimeDays());
        entity.setRating(dto.getRating());
        if (dto.getActive() != null)
            entity.setActive(dto.getActive());
    }

    private ProveedorDTO convertToDTO(Proveedor entity) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setIdSupplier(entity.getIdSupplier());
        dto.setSupplierName(entity.getSupplierName());
        dto.setBusinessName(entity.getBusinessName());
        dto.setRuc(entity.getRuc());
        dto.setContactName(entity.getContactName());
        dto.setContactPhone(entity.getContactPhone());
        dto.setContactEmail(entity.getContactEmail());
        dto.setAddress(entity.getAddress());
        dto.setDistrict(entity.getDistrict());
        dto.setCity(entity.getCity());
        dto.setDeliveryTimeDays(entity.getDeliveryTimeDays());
        dto.setRating(entity.getRating());
        dto.setActive(entity.getActive());
        return dto;
    }
}
