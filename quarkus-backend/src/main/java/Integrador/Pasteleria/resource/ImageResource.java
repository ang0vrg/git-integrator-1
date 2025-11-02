package Integrador.Pasteleria.resource;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Path("/imagenes")
public class ImageResource {

    // Directory where uploaded images will be stored (relative to working dir)
    private static final java.nio.file.Path UPLOAD_DIR = Paths.get(System.getProperty("user.dir"), "uploads");

    public static class UploadRequest {
        public String filename;
        public String data; // base64 encoded image data (data:...;base64,AAAA.. or plain base64)
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response uploadImage(UploadRequest req) {
        if (req == null || req.data == null || req.data.isEmpty()) {
            return Response.status(Status.BAD_REQUEST).entity(Map.of("error", "No image data provided")).build();
        }

        try {
            // Ensure upload dir exists
            if (!Files.exists(UPLOAD_DIR)) {
                Files.createDirectories(UPLOAD_DIR);
            }

            String base64 = req.data;
            // If data URL prefix present, strip it
            int comma = base64.indexOf(',');
            if (comma > 0) base64 = base64.substring(comma + 1);

            byte[] decoded = Base64.getDecoder().decode(base64);

            String ext = "";
            if (req.filename != null && req.filename.contains(".")) {
                ext = req.filename.substring(req.filename.lastIndexOf('.'));
            }
            String id = UUID.randomUUID().toString() + ext;
            java.nio.file.Path file = UPLOAD_DIR.resolve(id);
            Files.write(file, decoded);

            Map<String, String> resp = new HashMap<>();
            resp.put("id", id);
            resp.put("url", "/imagenes/" + id);
            return Response.status(Status.CREATED).entity(resp).build();
        } catch (IllegalArgumentException iae) {
            return Response.status(Status.BAD_REQUEST).entity(Map.of("error", "Invalid base64 data")).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Map.of("error", "Could not save image")).build();
        }
    }

    @GET
    @Path("{id}")
    public Response getImage(@PathParam("id") String id) {
        try {
            java.nio.file.Path file = UPLOAD_DIR.resolve(id).normalize();
            if (!Files.exists(file) || !file.toAbsolutePath().startsWith(UPLOAD_DIR.toAbsolutePath())) {
                return Response.status(Status.NOT_FOUND).entity(Map.of("error", "Image not found")).build();
            }

            String contentType = Files.probeContentType(file);
            if (contentType == null) contentType = "application/octet-stream";

            byte[] bytes = Files.readAllBytes(file);
            return Response.ok(bytes).type(contentType).build();
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Status.INTERNAL_SERVER_ERROR).entity(Map.of("error", "Could not read image")).build();
        }
    }
}
