// quarkus-backend\src\main\java\Integrador\Pasteleria\resource\AuthResource.java
package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.LoginRequest;
import Integrador.Pasteleria.dto.RegisterRequest;
import Integrador.Pasteleria.dto.ForgotPasswordRequest;
import Integrador.Pasteleria.dto.ResetPasswordRequest;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.PasswordResetService;
import Integrador.Pasteleria.service.UsuarioService;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import jakarta.inject.Inject;
import jakarta.persistence.PersistenceException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.annotation.PostConstruct;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import io.smallrye.mutiny.Uni;
import io.smallrye.jwt.build.Jwt;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import java.util.Base64;
import java.util.Optional;
import java.util.HashSet;
import java.util.Arrays;
import static java.util.Map.of;
import static java.util.Map.ofEntries;
import java.util.Map;
import java.util.Set;
import java.time.LocalDateTime;

import javax.crypto.spec.SecretKeySpec;
import javax.crypto.SecretKey;
import java.security.Key;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    ReactiveMailer reactiveMailer;

    @Inject
    UsuarioService usuarioService;

    @Inject
    PasswordResetService passwordResetService;

    @Inject
    @ConfigProperty(name = "mail.test.recipient", defaultValue = "test@example.com")
    String testRecipient;

    @PostConstruct
    void validateConfig() {
        if ("test@example.com".equals(testRecipient)) {
            System.out.println(
                    "⚠️  Advertencia: mail.test.recipient no configurado. Usa MAIL_TEST_RECIPIENT en email.env");
        }
    }

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

        public ForgotPasswordRequest() {
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }
    }

    public static class ResetPasswordRequest {
        private String token;
        private String newPassword;
        private String confirmPassword;

        public ResetPasswordRequest() {
        }

        public String getToken() {
            return token;
        }

        public void setToken(String token) {
            this.token = token;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }

        public String getConfirmPassword() {
            return confirmPassword;
        }

        public void setConfirmPassword(String confirmPassword) {
            this.confirmPassword = confirmPassword;
        }
    }

    // ============================================================================
    // ENDPOINTS
    // ============================================================================

    /* ---------- 2. REGISTER ---------- */
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
            return Response.status(409)
                    .entity(of("ok", false, "msg", "El usuario ya existe"))
                    .build();
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

        return Response.ok(of("ok", true, "token", token, "role", newUser.getUserRole().name())).build();

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
        return Response.ok(of("ok", true, "token", token, "role", usuario.getUserRole().name())).build();

        } catch (Exception e) {
            return Response.status(500)
                    .entity(of("ok", false, "msg", "Error interno: " + e.getMessage()))
                    .build();
        }
    }

    /* ---------- 1. LOGIN ---------- */
    // Removed duplicate/erroneous forgotPassword implementation; the valid POST /forgot-password endpoint is implemented below.

    /* ---------- 3. FORGOT-PASSWORD ---------- */
    @POST
    @Path("/forgot-password")
    public Response forgotPassword(ForgotPasswordRequest req) {
        Optional<Usuario> opt = usuarioService.findByUserEmail(req.getEmail());
        if (opt.isPresent()) {
            String token = passwordResetService.generateResetToken(req.getEmail());
            return Response.ok(of(
                    "ok", true,
                    "msg", "Se ha enviado un enlace a tu correo",
                    "token", token 
            )).build();
        }
        return Response.ok(of(
                "ok", true,
                "msg", "Si la dirección existe, recibirás un enlace para restablecer tu contraseña")).build();
    }

    /* ---------- 4. RESET-PASSWORD ---------- */
    @POST
    @Path("/reset-password")
    public Response resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("ok", false, "msg", "Las contraseñas no coinciden."))
                    .build();
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