package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ReporteDTO;
import Integrador.Pasteleria.service.ReporteService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/reportes")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@RolesAllowed({ "administrador", "trabajador" })
public class ReporteResource {

    @Inject
    ReporteService reporteService;

    @Inject
    Integrador.Pasteleria.repository.ImportacionRepository importacionRepository;

    @Inject
    jakarta.persistence.EntityManager em;

    @POST
    public Response create(ReporteDTO dto) {
        ReporteDTO created = reporteService.create(dto);
        return Response.status(Response.Status.CREATED).entity(created).build();
    }

    @GET
    @Path("/importaciones")
    public java.util.List<Integrador.Pasteleria.entity.Importacion> getImportaciones(
            @QueryParam("idProveedor") Integer idProveedor) {
        if (idProveedor != null) {
            return importacionRepository.find("proveedor.idSupplier", idProveedor).list();
        }
        return importacionRepository.listAll();
    }

    @GET
    @Path("/importaciones/{id}/detalles")
    public java.util.List<Integrador.Pasteleria.entity.DetalleImportacion> getDetallesImportacion(
            @PathParam("id") Integer id) {
        return em.createQuery(
                "SELECT d FROM Integrador.Pasteleria.entity.DetalleImportacion d WHERE d.importacion.idImportacion = :id",
                Integrador.Pasteleria.entity.DetalleImportacion.class)
                .setParameter("id", id)
                .getResultList();
    }
}
