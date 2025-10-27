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
    // ENDPOINTS
    // ============================================================================

    /* ---------- 2. REGISTER ---------- */
    @POST
    @Path("/register")
    public Response register(RegisterRequest req) {
        if (!req.getPassword().equals(req.getConfirmPassword())) {
            return Response.status(400)
                    .entity(of("ok", false, "msg", "Las contraseñas no coinciden"))
                    .build();
        }
        if (usuarioService.findByUserEmail(req.getEmail()).isPresent()) {
            return Response.status(409)
                    .entity(of("ok", false, "msg", "El usuario ya existe"))
                    .build();
        }
        try {
            Usuario nuevo = new Usuario();
            nuevo.setUsername(req.getFirstName() + " " + req.getLastName());
            nuevo.setUserEmail(req.getEmail());
            nuevo.setPhoneNumber(req.getPhone());
            nuevo.setUserPassword(req.getPassword()); // se hashea en el service
            nuevo.setUserRole(Usuario.Role.cliente);
            usuarioService.saveUser(nuevo);

            String token = Jwt.upn(nuevo.getUserEmail())
                    .groups(Set.of(nuevo.getUserRole().name()))
                    .expiresIn(3600)
                    .sign(SECRET_KEY);
            return Response.ok(of(
                    "ok", true,
                    "token", token,
                    "role", nuevo.getUserRole().name())).build();

        } catch (Exception e) {
            return Response.status(500)
                    .entity(of("ok", false, "msg", "Error interno: " + e.getMessage()))
                    .build();
        }
    }

    /* ---------- 1. LOGIN ---------- */
    @POST
    @Path("/login")
    public Response login(LoginRequest req) {
        Optional<Usuario> opt = usuarioService.findByUserEmail(req.getEmail());
        if (opt.isEmpty() ||
            !usuarioService.checkPassword(req.getPassword(), opt.get().getUserPassword())) {
            return Response.status(401)
                           .entity(of("ok", false, "msg", "Correo o contraseña incorrectos"))
                           .build();
        }
        Usuario u = opt.get();
        String token = Jwt.upn(u.getUserEmail())
                          .groups(Set.of(u.getUserRole().name()))
                          .expiresIn(3600)
                          .sign(SECRET_KEY);
        return Response.ok(of(
                "ok", true,
                "token", token,
                "role", u.getUserRole().name()
        )).build();
    }

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

    @POST
    @Path("/reset-password")
    public Response resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("ok", false, "msg", "Las contraseñas no coinciden."))
                    .build();
        }

        Optional<String> optEmail = passwordResetService.validateResetToken(request.getToken());
        if (optEmail.isEmpty()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity(Map.of("ok", false, "msg", "El token es inválido o ha expirado."))
                    .build();
        }

        Usuario usuario = usuarioService.findByUserEmail(optEmail.get()).orElse(null);
        if (usuario == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("ok", false, "msg", "Usuario no encontrado"))
                    .build();
        }

        usuarioService.updatePassword(usuario, request.getNewPassword());
        passwordResetService.invalidateToken(request.getToken());

        return Response.ok(Map.of("ok", true, "msg", "Contraseña restablecida exitosamente."))
                .build();
    }
}