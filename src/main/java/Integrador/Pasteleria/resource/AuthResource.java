package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.LoginRequest;
import Integrador.Pasteleria.dto.RegisterRequest;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.PasswordResetService;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import io.smallrye.jwt.build.Jwt;
import org.eclipse.microprofile.jwt.Claims;
import java.util.Base64;
import java.util.Optional;
import java.util.HashSet;
import java.util.Arrays;
import java.util.Set;

import javax.crypto.spec.SecretKeySpec;
import javax.crypto.SecretKey; 
import java.security.Key;

@SuppressWarnings("unused")
@Path("/auth")//Ruta base
public class AuthResource {

    @Inject//Inserción de depedencias
    UsuarioService usuarioService;

    @Inject//Inserción de depedencias
    PasswordResetService passwordResetService;

    private static final SecretKey SECRET_KEY;
    private static final String SECRET_STRING = "Z2Jrd0d6TWdIVTNyN1l6bThmR0g2b3lVMlFxVGVjUWc="; // La clave de 32 bytes

    static {
        // Bloque estático para inicializar la clave una sola vez
        byte[] secretBytes = Base64.getUrlDecoder().decode(SECRET_STRING);
        SECRET_KEY = new SecretKeySpec(secretBytes, "HmacSHA256");
    }

/*----------------------------------------------Separación para el apartado de paginas-----------------------------------------------------------*/
    @POST//Respondera a la solicitud HTTP
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(RegisterRequest request) { 

        if (!request.getPassword().equals(request.getConfirmPassword())) {//Coincidencia de contraseñas
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden").build();
        }
        if (usuarioService.findByUserEmail(request.getEmail()).isPresent()) {//Busqueda y verificación de usuario
            return Response.status(Response.Status.CONFLICT).entity("Usuario ya existe").build();
        }

        try {
            Usuario newUser = new Usuario();//Nuevo Usuario
            newUser.setUsername(request.getFirstName() + " " + request.getLastName()); 
            newUser.setUserEmail(request.getEmail());
            newUser.setPhoneNumber(request.getPhone());
            newUser.setUserPassword(request.getPassword()); // La contraseña se hashea en saveUser
            newUser.setUserRole(Usuario.Role.cliente);//Rol por default

            usuarioService.saveUser(newUser);//Guarda Usuario

            String token = Jwt.upn(newUser.getUserEmail())
                .groups(new HashSet<>(Arrays.asList(newUser.getUserRole().name())))
                .expiresIn(3600) // 1 hora
                .sign(SECRET_KEY); 
                
            return Response.ok(token).build();

        } catch (PersistenceException e) {
            e.printStackTrace();
            return Response.status(Response.Status.CONFLICT)
                .entity("Error de base de datos: Verifica que todos los campos sean válidos.").build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Fallo interno del servidor: " + e.getMessage()).build(); 
        }
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)//Devolvera datos como Token
    public Response login(LoginRequest request) { 
        try {
            Optional<Usuario> optionalUser = usuarioService.findByUserEmail(request.getEmail());//Busqueda de usuario por correo
            if (optionalUser.isEmpty()) {//Existe?
                return Response.status(Response.Status.UNAUTHORIZED)//No esta autorizado
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }
            Usuario usuario = optionalUser.get();
            if (!usuarioService.checkPassword(request.getPassword(), usuario.getUserPassword())) {//Compara la contraseña ingresada con la DB
                return Response.status(Response.Status.UNAUTHORIZED)//Sino devolvera q tmpc esta autorizado
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }

            // --- GeneraciónTOKEN mediante libreria JWT ---
            String token = Jwt.upn(usuario.getUserEmail()) // ID del usuario
                .groups(new HashSet<>(Arrays.asList(usuario.getUserRole().name()))) // Rol del usuario
                .expiresIn(3600) // Expiración(1 hora)
                .sign(SECRET_KEY);
            return Response.ok(token).build();

        } catch (Exception e) {//Para no tener un enorme texto en rojo
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.")
                    .build();
        }
    }

    @POST
    @Path("/forgot-password")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_PLAIN)
    public Response forgotPassword(@FormParam("email") String email){
        Optional<Usuario> optionalUser = usuarioService.findByUserEmail(email);
        if (optionalUser.isEmpty()) {
            return Response.ok("Si la dirección de correo esta registrada, recibirás un enlace para restablecer tu contraseña").build();
        }

        String resetToken = passwordResetService.generateResetToken(email);
        //Aver si me devuelve algo
        return Response.ok("Token de restablecimiento generado: "+resetToken).build();
    }

    @POST
    @Path("/reset-password")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_PLAIN)
    public Response resetPassword(
        @FormParam("token") String token,
        @FormParam("newPassword") String newPassword,
        @FormParam("confirmPassword") String confirmPassword){
        //Contraseñas invalidas
        if(!newPassword.equals(confirmPassword)){
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden.").build();
        }
        //Invalidez de token
        Optional<String> optionalEmail =  passwordResetService.validateResetToken(token);
        if (optionalEmail.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("El token es invalido.").build();
        }

        String userEmail = optionalEmail.get();
        Optional<Usuario> optionalUser = usuarioService.findByUserEmail(userEmail);
        //Invalidez del usuario
        if (optionalUser.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Usuario no encontrado").build();
        }
        
        return Response.ok("Contraseña restablecida.").build();
    }
}