package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.PrecioProveedorIngrediente;
import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.dto.PrecioProveedorIngredienteDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PrecioProveedorService {

    @Inject
    EntityManager em;

    public List<PrecioProveedorIngredienteDTO> findAll() {
        return em.createQuery("SELECT p FROM PrecioProveedorIngrediente p WHERE p.activo = true",
                PrecioProveedorIngrediente.class)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PrecioProveedorIngredienteDTO> findByProveedor(Integer idProveedor) {
        return em.createQuery(
                "SELECT p FROM PrecioProveedorIngrediente p WHERE p.proveedor.idSupplier = :idProveedor AND p.activo = true",
                PrecioProveedorIngrediente.class)
                .setParameter("idProveedor", idProveedor)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PrecioProveedorIngredienteDTO> findByIngrediente(Integer idIngrediente) {
        return em.createQuery(
                "SELECT p FROM PrecioProveedorIngrediente p WHERE p.ingrediente.idIngrediente = :idIngrediente AND p.activo = true",
                PrecioProveedorIngrediente.class)
                .setParameter("idIngrediente", idIngrediente)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public PrecioProveedorIngredienteDTO getMejorPrecio(Integer idIngrediente, String tipoCliente) {
        List<PrecioProveedorIngrediente> precios = em.createQuery(
                "SELECT p FROM PrecioProveedorIngrediente p " +
                        "WHERE p.ingrediente.idIngrediente = :idIngrediente " +
                        "AND p.tipoCliente = :tipoCliente " +
                        "AND p.activo = true " +
                        "AND (p.fechaVigenciaFin IS NULL OR p.fechaVigenciaFin > CURRENT_TIMESTAMP) " +
                        "ORDER BY p.precioUnitario ASC",
                PrecioProveedorIngrediente.class)
                .setParameter("idIngrediente", idIngrediente)
                .setParameter("tipoCliente", PrecioProveedorIngrediente.TipoCliente.valueOf(tipoCliente))
                .setMaxResults(1)
                .getResultList();

        return precios.isEmpty() ? null : convertToDTO(precios.get(0));
    }

    @Transactional
    public PrecioProveedorIngredienteDTO create(PrecioProveedorIngredienteDTO dto) {
        PrecioProveedorIngrediente precio = new PrecioProveedorIngrediente();
        updateEntityFromDTO(precio, dto);
        em.persist(precio);
        return convertToDTO(precio);
    }

    @Transactional
    public PrecioProveedorIngredienteDTO update(Integer id, PrecioProveedorIngredienteDTO dto) {
        PrecioProveedorIngrediente precio = em.find(PrecioProveedorIngrediente.class, id);
        if (precio != null) {
            updateEntityFromDTO(precio, dto);
            em.merge(precio);
            return convertToDTO(precio);
        }
        return null;
    }

    @Transactional
    public boolean delete(Integer id) {
        PrecioProveedorIngrediente precio = em.find(PrecioProveedorIngrediente.class, id);
        if (precio != null) {
            precio.setActivo(false);
            em.merge(precio);
            return true;
        }
        return false;
    }

    private void updateEntityFromDTO(PrecioProveedorIngrediente entity, PrecioProveedorIngredienteDTO dto) {
        if (dto.getIdProveedor() != null) {
            Proveedor proveedor = em.find(Proveedor.class, dto.getIdProveedor());
            entity.setProveedor(proveedor);
        }
        if (dto.getIdIngrediente() != null) {
            Ingrediente ingrediente = em.find(Ingrediente.class, dto.getIdIngrediente());
            entity.setIngrediente(ingrediente);
        }
        if (dto.getTipoCliente() != null) {
            entity.setTipoCliente(PrecioProveedorIngrediente.TipoCliente.valueOf(dto.getTipoCliente()));
        }
        if (dto.getPrecioUnitario() != null)
            entity.setPrecioUnitario(dto.getPrecioUnitario());
        if (dto.getCantidadMinima() != null)
            entity.setCantidadMinima(dto.getCantidadMinima());
        if (dto.getDescuentoPorcentaje() != null)
            entity.setDescuentoPorcentaje(dto.getDescuentoPorcentaje());
        if (dto.getMoneda() != null)
            entity.setMoneda(dto.getMoneda());
        if (dto.getActivo() != null)
            entity.setActivo(dto.getActivo());
        if (dto.getFechaVigenciaInicio() != null)
            entity.setFechaVigenciaInicio(dto.getFechaVigenciaInicio());
        if (dto.getFechaVigenciaFin() != null)
            entity.setFechaVigenciaFin(dto.getFechaVigenciaFin());
    }

    private PrecioProveedorIngredienteDTO convertToDTO(PrecioProveedorIngrediente entity) {
        PrecioProveedorIngredienteDTO dto = new PrecioProveedorIngredienteDTO();
        dto.setIdPrecio(entity.getIdPrecio());
        dto.setIdProveedor(entity.getProveedor().getIdSupplier());
        dto.setNombreProveedor(entity.getProveedor().getSupplierName());
        dto.setIdIngrediente(entity.getIngrediente().getIdIngrediente());
        dto.setNombreIngrediente(entity.getIngrediente().getNombre());
        dto.setTipoCliente(entity.getTipoCliente().name());
        dto.setPrecioUnitario(entity.getPrecioUnitario());
        dto.setCantidadMinima(entity.getCantidadMinima());
        dto.setDescuentoPorcentaje(entity.getDescuentoPorcentaje());
        dto.setMoneda(entity.getMoneda());
        dto.setActivo(entity.getActivo());
        dto.setFechaVigenciaInicio(entity.getFechaVigenciaInicio());
        dto.setFechaVigenciaFin(entity.getFechaVigenciaFin());
        return dto;
    }
}
