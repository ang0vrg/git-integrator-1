package Integrador.Pasteleria.resource;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;

/**
 * Dev helper: ensure the browser can read Content-Range and other headers
 * even if the quarkus.http.cors.* config isn't available in this Quarkus setup.
 * This adds the Access-Control-Expose-Headers header globally.
 */
@Provider
public class CorsResponseFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext, ContainerResponseContext responseContext) {
        // Expose the pagination header used by react-admin
        responseContext.getHeaders().add("Access-Control-Expose-Headers", "Content-Range,Content-Type,Authorization");
        // Allow local dev origin (be explicit instead of '*')
        responseContext.getHeaders().add("Access-Control-Allow-Origin", "http://localhost:5173");
        responseContext.getHeaders().add("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
        responseContext.getHeaders().add("Access-Control-Allow-Headers", "accept,authorization,content-type,x-requested-with");
    }
}
