package Integrador.Pasteleria.service;

import Integrador.Pasteleria.entity.Reporte;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.dto.ReporteDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class ReporteService {

    @Inject
    EntityManager em;

    @Transactional
    public ReporteDTO create(ReporteDTO dto) {
        Reporte reporte = new Reporte();
        reporte.setUsuarioGenerador(em.find(Usuario.class, dto.getIdUsuarioGenerador()));
        if (dto.getReportType() != null)
            reporte.setReportType(Reporte.ReportType.valueOf(dto.getReportType()));
        reporte.setNombre(dto.getNombre());
        reporte.setDescripcion(dto.getDescripcion());
        reporte.setStartDate(dto.getStartDate());
        reporte.setEndDate(dto.getEndDate());
        reporte.setReportData(dto.getReportData());
        reporte.setArchivoUrl(dto.getArchivoUrl());
        if (dto.getEstado() != null)
            reporte.setEstado(Reporte.Estado.valueOf(dto.getEstado()));

        em.persist(reporte);
        return convertToDTO(reporte);
    }

    private ReporteDTO convertToDTO(Reporte entity) {
        ReporteDTO dto = new ReporteDTO();
        dto.setIdReport(entity.getIdReport());
        dto.setIdUsuarioGenerador(entity.getUsuarioGenerador().getIdUser());
        dto.setReportType(entity.getReportType().name());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setReportData(entity.getReportData());
        dto.setArchivoUrl(entity.getArchivoUrl());
        dto.setEstado(entity.getEstado().name());
        return dto;
    }
}
