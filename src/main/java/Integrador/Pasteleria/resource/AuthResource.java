package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
/*Tengo algunos fallos con estas 2 */
/*import io.smallrye.jwt.build.Jwt;*/
/*import org.eclipse.microprofile.jwt.Claims;*/
import java.util.Optional;

/*Guiara a una direccion /auth/... .html */
@Path("/auth")
public class AuthResource {

    @Inject
    UsuarioService usuarioService;

    @POST
    @Path("/register")/*Toma como path register.html */
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_PLAIN)
    public Response register(@FormParam("firstName") String firstName,/*Los formularios que se llenaran */
                                @FormParam("lastName") String lastName,
                                @FormParam("email") String email,
                                @FormParam("phone") String phone,
                                @FormParam("password") String password,
                                @FormParam("confirmPassword") String confirmPassword) {

        if (!password.equals(confirmPassword)) {/*Si la contraseña no es igual */
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden").build();
        }

        if (usuarioService.findByUserEmail(email).isPresent()) {/*Si el correo existe */
            return Response.status(Response.Status.CONFLICT).entity("Usuario ya existe").build();
        }

        Usuario newUser = new Usuario();/*Nuevo Usuario */
        newUser.setUsername(firstName + " " + lastName); // Combina nombre y apellido
        newUser.setUserEmail(email);
        newUser.setPhoneNumber(phone);
        newUser.setUserPassword(password);
        newUser.setUserRole(Usuario.Role.Cliente);/*Rol por default en el register */
        /*Creo que colocare correo de trabajadores mediante otro registro unicamente para el ADMIN */
        usuarioService.saveUser(newUser);/*Guardará el usuario */

        return Response.status(Response.Status.CREATED).entity("Registro exitoso").build();/*Dara una pagina de mensaje */
    }

    @POST
    @Path("/login")/*Toma como path login.html */
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_PLAIN)
    public Response login(@FormParam("email") String email, @FormParam("password") String password) {/*2 Formularios a llenar */
        try {
            // Cambio clave aquí: usar el método findByUserEmail que devuelve un Optional
            Optional<Usuario> optionalUser = usuarioService.findByUserEmail(email);/*Buscar por email */

            if (optionalUser.isEmpty()) {/*Verifica el usuario mediante su email */
                return Response.status(Response.Status.UNAUTHORIZED)
                                .entity("Correo o contraseña incorrectos.")
                                .build();
            }

            Usuario usuario = optionalUser.get();
            
            // Lógica para verificar la contraseña
            if (!usuarioService.checkPassword(password, usuario.getUserPassword())) {
                return Response.status(Response.Status.UNAUTHORIZED)
                                .entity("Correo o contraseña incorrectos.")
                                .build();
            }

            // Lógica para generar un mensaje de éxito
            String successMessage = "¡Has iniciado sesión con éxito!\nCorreo: " + usuario.getUserEmail() + "\nNombre de usuario: " + usuario.getUsername();
            return Response.ok(successMessage).build();/*Juntara el correo y su nombre de usuario */

        } catch (Exception e) {
            e.printStackTrace(); // Por si hay algun fallo, para que no me mande un tremendo error rojo
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                            .entity("Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.")
                            .build();
        }
    }
}