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

import io.smallrye.jwt.build.Jwt;
import org.eclipse.microprofile.jwt.Claims;
import java.util.Optional;
import java.util.HashSet;
import java.util.Arrays;
import java.util.Set;

@Path("/auth")//Ruta base
public class AuthResource {

    @Inject//Inserción de depedencias
    UsuarioService usuarioService;

    @Inject//Inserción de depedencias
    PasswordResetService passwordResetService;

    @POST//Respondera a la solicitud HTTP
    @Path("/register")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)//Espere los datos enviados en el formulario (login/register)
    @Produces(MediaType.TEXT_PLAIN)//Devolvera texto plano
    public Response register(@FormParam("firstName") String firstName,//Parametros de formulario
            @FormParam("lastName") String lastName,
            @FormParam("email") String email,
            @FormParam("phone") String phone,
            @FormParam("password") String password,
            @FormParam("confirmPassword") String confirmPassword) {

        if (!password.equals(confirmPassword)) {//Coincidencia de contraseñas
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden").build();
        }

        if (usuarioService.findByUserEmail(email).isPresent()) {//Busqueda y verificación de usuario
            return Response.status(Response.Status.CONFLICT).entity("Usuario ya existe").build();
        }

        Usuario newUser = new Usuario();//Nuevo Usuario
        newUser.setUsername(firstName + " " + lastName);
        newUser.setUserEmail(email);
        newUser.setPhoneNumber(phone);
        newUser.setUserPassword(password);
        newUser.setUserRole(Usuario.Role.Cliente);//Rol por default

        usuarioService.saveUser(newUser);//Guarda Usuario

        return Response.status(Response.Status.CREATED).entity("Registro exitoso").build();
    }

    @POST
    @Path("/login")
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.APPLICATION_JSON)//Devolvera datos como Token
    public Response login(@FormParam("email") String email, @FormParam("password") String password) {//Recibir credenciales
        try {
            Optional<Usuario> optionalUser = usuarioService.findByUserEmail(email);//Busqueda de usuario por correo

            if (optionalUser.isEmpty()) {//Existe?
                return Response.status(Response.Status.UNAUTHORIZED)//No esta autorizado
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }

            Usuario usuario = optionalUser.get();

            if (!usuarioService.checkPassword(password, usuario.getUserPassword())) {//Compara la contraseña ingresada con la DB
                return Response.status(Response.Status.UNAUTHORIZED)//Sino devolvera q tmpc esta autorizado
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }

            // --- GeneraciónTOKEN mediante libreria JWT ---
            String token = Jwt.issuer("https://example.com/issuer") // Un identificador único del emisor
                    .upn(usuario.getUserEmail()) // ID del usuario
                    .groups(new HashSet<>(Arrays.asList(usuario.getUserRole().name()))) // Rol del usuario
                    .expiresIn(3600) // Expiración(1 hora)
                    .sign();

            // Devuelve el token en la respuesta
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