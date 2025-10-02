package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.LoginRequest;
import Integrador.Pasteleria.dto.RegisterRequest;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.PasswordResetService;
import Integrador.Pasteleria.service.UsuarioService;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import io.smallrye.jwt.build.Jwt;
import java.util.Base64;
import java.util.Optional;
import java.util.HashSet;
import java.util.Arrays;

import javax.crypto.spec.SecretKeySpec;
import javax.crypto.SecretKey; 
import java.security.Key;

@Path("/auth")
public class AuthResource {

    @Inject
    UsuarioService usuarioService;

    @Inject
    PasswordResetService passwordResetService;

    private static final SecretKey SECRET_KEY;
    private static final String SECRET_STRING = "Z2Jrd0d6TWdIVTNyN1l6bThmR0g2b3lVMlFxVGVjUWc=";

    static {
        byte[] secretBytes = Base64.getUrlDecoder().decode(SECRET_STRING);
        SECRET_KEY = new SecretKeySpec(secretBytes, "HmacSHA256");
    }

    // ============================================================================
    // DTOs INTERNOS TEMPORALES
    // ============================================================================
    
    public static class ForgotPasswordRequest {
        private String email;
        
        public ForgotPasswordRequest() {}
        
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
        private String confirmPassword;
        
        public ResetPasswordRequest() {}
        
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
        
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    }

    // ============================================================================
    // ENDPOINTS
    // ============================================================================

    @POST
    @Path("/register")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response register(RegisterRequest request) { 
        String password = request.getPassword() != null ? request.getPassword().trim() : "";
        String confirmPassword = request.getConfirmPassword() != null ? request.getConfirmPassword().trim() : "";

        if (!password.equals(confirmPassword)) { 
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden").build();
        }
        if (usuarioService.findByUserEmail(request.getEmail()).isPresent()) {
            return Response.status(Response.Status.CONFLICT).entity("Usuario ya existe").build();
        }
        try {
            Usuario newUser = new Usuario();
            newUser.setUsername(request.getFirstName() + " " + request.getLastName()); 
            newUser.setUserEmail(request.getEmail());
            newUser.setPhoneNumber(request.getPhone());
            newUser.setUserPassword(request.getPassword());
            newUser.setUserRole(Usuario.Role.cliente);

            usuarioService.saveUser(newUser);

            String token = Jwt.upn(newUser.getUserEmail())
                .groups(new HashSet<>(Arrays.asList(newUser.getUserRole().name())))
                .expiresIn(3600)
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
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) { 
        try {
            Optional<Usuario> optionalUser = usuarioService.findByUserEmail(request.getEmail());
            if (optionalUser.isEmpty()) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }
            Usuario usuario = optionalUser.get();
            if (!usuarioService.checkPassword(request.getPassword(), usuario.getUserPassword())) {
                return Response.status(Response.Status.UNAUTHORIZED)
                        .entity("Correo o contraseña incorrectos.")
                        .build();
            }

            String token = Jwt.upn(usuario.getUserEmail())
                .groups(new HashSet<>(Arrays.asList(usuario.getUserRole().name())))
                .expiresIn(3600)
                .sign(SECRET_KEY);
            return Response.ok(token).build();

        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("Ocurrió un error en el servidor. Inténtalo de nuevo más tarde.")
                    .build();
        }
    }

    @POST
    @Path("/forgot-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response forgotPassword(ForgotPasswordRequest request) {
        Optional<Usuario> optionalUser = usuarioService.findByUserEmail(request.getEmail());
        if (optionalUser.isEmpty()) {
            return Response.ok("Si la dirección de correo está registrada, recibirás un enlace para restablecer tu contraseña").build();
        }
        String resetToken = passwordResetService.generateResetToken(request.getEmail());
        return Response.ok("Token de restablecimiento generado: " + resetToken).build();
    }

    @POST
    @Path("/reset-password")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    public Response resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Las contraseñas no coinciden.").build();
        }
    
        Optional<String> optionalEmail = passwordResetService.validateResetToken(request.getToken());
        if (optionalEmail.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("El token es inválido o ha expirado.").build();
        }
    
        String userEmail = optionalEmail.get();
        Optional<Usuario> optionalUser = usuarioService.findByUserEmail(userEmail);
        if (optionalUser.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).entity("Usuario no encontrado").build();
        }
    
        Usuario usuario = optionalUser.get();
        usuarioService.updatePassword(usuario, request.getNewPassword());
        
        passwordResetService.invalidateToken(request.getToken());
    
        return Response.ok("Contraseña restablecida exitosamente.").build();
    }
}