package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Receta;
import Integrador.Pasteleria.entity.RecetaDetalle;
import Integrador.Pasteleria.entity.Ingrediente;
import Integrador.Pasteleria.dto.RecetaDTO;
import Integrador.Pasteleria.dto.RecetaDetalleDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class RecetaService {

    @Inject
    EntityManager em;

    public List<RecetaDTO> findAll() {
        return em.createQuery("SELECT r FROM Receta r WHERE r.activa = true", Receta.class)
                .getResultList().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public RecetaDTO create(RecetaDTO dto) {
        Receta receta = new Receta();
        updateEntityFromDTO(receta, dto);
        em.persist(receta);

        if (dto.getDetalles() != null) {
            for (RecetaDetalleDTO detalleDTO : dto.getDetalles()) {
                RecetaDetalle detalle = new RecetaDetalle();
                detalle.setReceta(receta);
                detalle.setIngrediente(em.find(Ingrediente.class, detalleDTO.getIdIngrediente()));
                detalle.setCantidad(detalleDTO.getCantidad());
                detalle.setUnidadMedida(detalleDTO.getUnidadMedida());
                detalle.setEsOpcional(detalleDTO.getEsOpcional());
                detalle.setNotas(detalleDTO.getNotas());
                em.persist(detalle);
            }
        }

        return convertToDTO(receta);
    }

    private void updateEntityFromDTO(Receta entity, RecetaDTO dto) {
        entity.setCodigo(dto.getCodigo());
        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setPorciones(dto.getPorciones());
        entity.setTiempoPreparacionMin(dto.getTiempoPreparacionMin());
        if (dto.getDificultad() != null)
            entity.setDificultad(Receta.Dificultad.valueOf(dto.getDificultad()));
        entity.setInstrucciones(dto.getInstrucciones());
        entity.setNotasAlergenos(dto.getNotasAlergenos());
        if (dto.getActiva() != null)
            entity.setActiva(dto.getActiva());
    }

    private RecetaDTO convertToDTO(Receta entity) {
        RecetaDTO dto = new RecetaDTO();
        dto.setIdReceta(entity.getIdReceta());
        dto.setCodigo(entity.getCodigo());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setPorciones(entity.getPorciones());
        dto.setTiempoPreparacionMin(entity.getTiempoPreparacionMin());
        dto.setDificultad(entity.getDificultad().name());
        dto.setCostoIngredientes(entity.getCostoIngredientes());
        dto.setCostoManoObra(entity.getCostoManoObra());
        dto.setCostoTotal(entity.getCostoTotal());
        dto.setInstrucciones(entity.getInstrucciones());
        dto.setNotasAlergenos(entity.getNotasAlergenos());
        dto.setActiva(entity.getActiva());
        return dto;
    }

    @Transactional
    public boolean delete(Integer id) {
        Receta receta = em.find(Receta.class, id);
        if (receta != null) {
            receta.setActiva(false);
            return true;
        }
        return false;
    }
}
