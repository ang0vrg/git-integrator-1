package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Direccion;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.dto.DireccionDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class DireccionService {

    @Inject
    EntityManager em;

    public List<DireccionDTO> findByUsuario(Integer idUsuario) {
        List<Direccion> direcciones = em
                .createQuery("SELECT d FROM Direccion d WHERE d.usuario.idUser = :idUsuario AND d.activa = true",
                        Direccion.class)
                .setParameter("idUsuario", idUsuario)
                .getResultList();
        return direcciones.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Transactional
    public DireccionDTO create(DireccionDTO dto) {
        Direccion direccion = new Direccion();
        Usuario usuario = em.find(Usuario.class, dto.getIdUsuario());
        if (usuario == null) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        direccion.setUsuario(usuario);
        updateEntityFromDTO(direccion, dto);

        if (Boolean.TRUE.equals(dto.getEsPredeterminada())) {
            disableOtherPredetermined(dto.getIdUsuario());
        }

        em.persist(direccion);
        return convertToDTO(direccion);
    }

    @Transactional
    public DireccionDTO update(Integer id, DireccionDTO dto) {
        Direccion direccion = em.find(Direccion.class, id);
        if (direccion == null) {
            return null;
        }
        updateEntityFromDTO(direccion, dto);

        if (Boolean.TRUE.equals(dto.getEsPredeterminada())) {
            disableOtherPredetermined(direccion.getUsuario().getIdUser());
            direccion.setEsPredeterminada(true);
        }

        em.merge(direccion);
        return convertToDTO(direccion);
    }

    @Transactional
    public boolean delete(Integer id) {
        Direccion direccion = em.find(Direccion.class, id);
        if (direccion != null) {
            direccion.setActiva(false);
            em.merge(direccion);
            return true;
        }
        return false;
    }

    private void disableOtherPredetermined(Integer idUsuario) {
        em.createQuery("UPDATE Direccion d SET d.esPredeterminada = false WHERE d.usuario.idUser = :idUsuario")
                .setParameter("idUsuario", idUsuario)
                .executeUpdate();
    }

    private void updateEntityFromDTO(Direccion entity, DireccionDTO dto) {
        entity.setAlias(dto.getAlias());
        entity.setCalle(dto.getCalle());
        entity.setNumero(dto.getNumero());
        entity.setPisoDpto(dto.getPisoDpto());
        entity.setDistrito(dto.getDistrito());
        entity.setCiudad(dto.getCiudad());
        entity.setCodigoPostal(dto.getCodigoPostal());
        entity.setReferencia(dto.getReferencia());
        entity.setLatitud(dto.getLatitud());
        entity.setLongitud(dto.getLongitud());
        if (dto.getEsPredeterminada() != null)
            entity.setEsPredeterminada(dto.getEsPredeterminada());
    }

    private DireccionDTO convertToDTO(Direccion entity) {
        DireccionDTO dto = new DireccionDTO();
        dto.setIdDireccion(entity.getIdDireccion());
        dto.setIdUsuario(entity.getUsuario().getIdUser());
        dto.setAlias(entity.getAlias());
        dto.setCalle(entity.getCalle());
        dto.setNumero(entity.getNumero());
        dto.setPisoDpto(entity.getPisoDpto());
        dto.setDistrito(entity.getDistrito());
        dto.setCiudad(entity.getCiudad());
        dto.setCodigoPostal(entity.getCodigoPostal());
        dto.setReferencia(entity.getReferencia());
        dto.setLatitud(entity.getLatitud());
        dto.setLongitud(entity.getLongitud());
        dto.setEsPredeterminada(entity.getEsPredeterminada());
        dto.setActiva(entity.getActiva());
        return dto;
    }
}
