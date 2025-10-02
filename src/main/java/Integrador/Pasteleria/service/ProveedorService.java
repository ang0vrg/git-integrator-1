package Integrador.Pasteleria.service;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import Integrador.Pasteleria.Repositorio.ProveedorRepositorio;
import Integrador.Pasteleria.entity.Proveedor;
import Integrador.Pasteleria.dto.ProveedorDTO;
import jakarta.ws.rs.NotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ProveedorService {
    @Inject
    ProveedorRepositorio proveedorRepositorio;

    public List<ProveedorDTO> getAllSuppliers() {
        return proveedorRepositorio.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public ProveedorDTO getSupplierById(Integer id) {
        Proveedor proveedor = proveedorRepositorio.findById(id);
        if (proveedor == null) {
            throw new NotFoundException("Proveedor no encontrado con ID: " + id);
        }
        return convertToDTO(proveedor);
    }

    @Transactional
    public ProveedorDTO createSupplier(ProveedorDTO proveedorDTO) {
        Proveedor proveedor = convertToEntity(proveedorDTO);
        proveedorRepositorio.save(proveedor);
        return convertToDTO(proveedor);
    }

    @Transactional
    public ProveedorDTO updateSupplier(Integer id, ProveedorDTO proveedorDTO) {
        Proveedor existingProveedor = proveedorRepositorio.findById(id);
        if (existingProveedor == null) {
            throw new NotFoundException("Proveedor no encontrado con ID: " + id);
        }
        existingProveedor.setSupplierName(proveedorDTO.getSupplierName());
        existingProveedor.setSupplierContact(proveedorDTO.getSupplierContact());
        existingProveedor.setSupplierPhone(proveedorDTO.getSupplierPhone());
        proveedorRepositorio.update(existingProveedor);
        return convertToDTO(existingProveedor);
    }

    @Transactional
    public void deleteSupplier(Integer id) {
        Proveedor existingProveedor = proveedorRepositorio.findById(id);
        if (existingProveedor == null) {
            throw new NotFoundException("Proveedor no encontrado con ID: " + id);
        }
        proveedorRepositorio.delete(id);
    }

    private ProveedorDTO convertToDTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setIdSupplier(proveedor.getIdSupplier());
        dto.setSupplierName(proveedor.getSupplierName());
        dto.setSupplierContact(proveedor.getSupplierContact());
        dto.setSupplierPhone(proveedor.getSupplierPhone());
        return dto;
    }

    private Proveedor convertToEntity(ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setSupplierName(dto.getSupplierName());
        proveedor.setSupplierContact(dto.getSupplierContact());
        proveedor.setSupplierPhone(dto.getSupplierPhone());
        return proveedor;
}
}