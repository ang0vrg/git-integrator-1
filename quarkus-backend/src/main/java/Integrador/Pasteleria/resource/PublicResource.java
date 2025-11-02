package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.UsuarioDTO;
import Integrador.Pasteleria.service.UsuarioService;
import Integrador.Pasteleria.service.UsuarioExportService;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/public")
@Produces(MediaType.APPLICATION_JSON)
public class PublicResource {

    @Inject
    UsuarioService usuarioService;

    @Inject
    UsuarioExportService exportService;

    @Inject
    EntityManager em;

    @GET
    @Path("/users")
    public List<UsuarioDTO> listUsers(@QueryParam("role") String role) {
        return usuarioService.listUsers(role);
    }

    @GET
    @Path("/users/export/excel")
    @Produces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    public Response exportExcel(@QueryParam("q") String q) throws Exception {
        List<UsuarioDTO> list = q == null || q.isBlank()
                ? usuarioService.listUsers(null)
                : searchUsers(q);
        return exportService.exportExcel(list);
    }

    @GET
    @Path("/users/search")
    public List<UsuarioDTO> searchUsers(@QueryParam("q") String q) {
        if (q == null || q.isBlank()) {
            return usuarioService.listUsers(null);
        }
        return em.createQuery(
                "SELECT new Integrador.Pasteleria.dto.UsuarioDTO(" +
                        "u.id, u.username, u.userEmail, CAST(u.userRole AS string), u.phoneNumber, u.createdAt) " +
                        "FROM Usuario u " +
                        "WHERE LOWER(u.username) LIKE LOWER(CONCAT('%', :q, '%')) " +
                        "   OR LOWER(u.userEmail) LIKE LOWER(CONCAT('%', :q, '%')) " +
                        "   OR LOWER(CAST(u.userRole AS string)) LIKE LOWER(CONCAT('%', :q, '%')) " +
                        "ORDER BY u.createdAt DESC",
                UsuarioDTO.class)
                .setParameter("q", q.toLowerCase())
                .getResultList();
    }
}