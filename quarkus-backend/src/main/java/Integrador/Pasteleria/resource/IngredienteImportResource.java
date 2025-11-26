package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.ImportResultDTO;
import Integrador.Pasteleria.service.IngredienteImportService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import io.quarkus.logging.Log;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Path("/api/admin/ingredientes")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("administrador")
public class IngredienteImportResource {

    @Inject
    IngredienteImportService importService;

    @POST
    @Path("/import/excel")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response importExcel(MultipartFormDataInput input) {
        try {
            Log.info("📥 Recibiendo archivo Excel para importación");

            // Obtener el archivo
            Map<String, List<InputPart>> uploadForm = input.getFormDataMap();

            if (!uploadForm.containsKey("file")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(createErrorResult("No se proporcionó ningún archivo"))
                        .build();
            }

            if (!uploadForm.containsKey("idProveedor")) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(createErrorResult("ID de proveedor es requerido"))
                        .build();
            }

            // Obtener ID del proveedor
            InputPart idProveedorPart = uploadForm.get("idProveedor").get(0);
            String idProveedorStr = idProveedorPart.getBodyAsString();
            Integer idProveedor = Integer.parseInt(idProveedorStr);

            // Obtener archivo
            List<InputPart> inputParts = uploadForm.get("file");
            InputPart inputPart = inputParts.get(0);

            try (InputStream inputStream = inputPart.getBody(InputStream.class, null)) {
                ImportResultDTO result = importService.importFromExcel(inputStream, idProveedor);

                if (result.getExitoso()) {
                    Log.info("✅ Importación exitosa: " + result.getIngredientesCreados() +
                            " creados, " + result.getIngredientesActualizados() + " actualizados");
                    return Response.ok(result).build();
                } else {
                    Log.warn("⚠️ Importación con errores: " + result.getErrores() + " errores");
                    return Response.status(Response.Status.BAD_REQUEST).entity(result).build();
                }
            }

        } catch (Exception e) {
            Log.error("❌ Error en importación de Excel", e);
            return Response.serverError()
                    .entity(createErrorResult("Error procesando archivo: " + e.getMessage()))
                    .build();
        }
    }

    private ImportResultDTO createErrorResult(String mensaje) {
        ImportResultDTO result = new ImportResultDTO();
        result.setExitoso(false);
        result.setErrores(1);
        result.setMensajesError(java.util.Arrays.asList(mensaje));
        return result;
    }
}
