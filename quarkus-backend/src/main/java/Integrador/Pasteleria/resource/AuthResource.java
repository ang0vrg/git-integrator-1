package Integrador.Pasteleria.resource;

// quarkus-backend\src\main\java\Integrador\Pasteleria\resource\AuthResource.java
import io.smallrye.jwt.build.Jwt;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import Integrador.Pasteleria.dto.LoginRequest;
import Integrador.Pasteleria.dto.RegisterRequest;
import Integrador.Pasteleria.dto.ForgotPasswordRequest;
import Integrador.Pasteleria.dto.ResetPasswordRequest;
import Integrador.Pasteleria.entity.Usuario;
import Integrador.Pasteleria.service.PasswordResetService;
import Integrador.Pasteleria.service.UsuarioService;
import Integrador.Pasteleria.util.PhoneValidator;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.*;
import java.time.Duration;
import java.util.*;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

        @Inject
        UsuarioService usuarioService;

        @Inject
        PasswordResetService passwordResetService;

        @ConfigProperty(name = "mp.jwt.verify.issuer")
        String issuer;

        /*
         * ============================================================
         * FIRMA HS256 (tu configuración actual)
         * ============================================================
         */
        private String buildToken(Usuario u) {
                return Jwt.issuer(issuer)
                                .upn(u.getUserEmail())
                                .groups(Set.of(u.getUserRole().name()))
                                .claim("name", u.getUsername())
                                .claim("createdAt", u.getCreatedAt().toString())
                                .claim("updatedAt", u.getUpdatedAt().toString())
                                .expiresIn(Duration.ofHours(1))
                                .sign();
        }

        /* -------------------------- LOGIN -------------------------- */
        @POST
        @Path("/login")
        public Response login(LoginRequest req) {
                Optional<Usuario> opt = usuarioService.findByUserEmail(req.getEmail());
                if (opt.isEmpty()
                                || !usuarioService.checkPassword(req.getPassword(), opt.get().getUserPassword())) {
                        return Response.status(401)
                                        .entity(Map.of("ok", false,
                                                        "msg", "Correo o contraseña incorrectos"))
                                        .build();
                }
                Usuario u = opt.get();
                String token = buildToken(u);
                return Response.ok(Map.of("ok", true,
                                "token", token,
                                "role", u.getUserRole().name()))
                                .build();
        }

        /* ------------------------ REGISTER ------------------------- */
        @POST
        @Path("/register")
        public Response register(RegisterRequest req) {
                if (!req.getPassword().equals(req.getConfirmPassword())) {
                        return Response.status(400)
                                        .entity(Map.of("ok", false, "msg", "Las contraseñas no coinciden"))
                                        .build();
                }

                // Validar teléfono según el país
                PhoneValidator.ValidationResult phoneValidation = PhoneValidator.validatePhoneNumber(
                    req.getPhone(), 
                    req.getCountry()
                );
                if (!phoneValidation.valid) {
                        return Response.status(400)
                                        .entity(Map.of("ok", false, "msg", phoneValidation.error))
                                        .build();
                }

                if (usuarioService.findByUserEmail(req.getEmail()).isPresent()) {
                        return Response.status(409)
                                        .entity(Map.of("ok", false, "msg", "El usuario ya existe"))
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

                        String token = buildToken(nuevo);
                        return Response.ok(Map.of("ok", true,
                                        "token", token,
                                        "role", nuevo.getUserRole().name()))
                                        .build();

                } catch (Exception e) {
                        return Response.serverError()
                                        .entity(Map.of("ok", false, "msg", "Error interno: " + e.getMessage()))
                                        .build();
                }
        }

        /* -------------------- FORGOT-PASSWORD --------------------- */
        @POST
        @Path("/forgot-password")
        public Response forgotPassword(ForgotPasswordRequest req) {
                Optional<Usuario> opt = usuarioService.findByUserEmail(req.getEmail());
                if (opt.isPresent()) {
                        String token = passwordResetService.generateResetToken(req.getEmail());
                        return Response.ok(Map.of("ok", true,
                                        "msg", "Se ha enviado un enlace a tu correo",
                                        "token", token))
                                        .build();
                }
                return Response.ok(Map.of("ok", true,
                                "msg", "Si la dirección existe, recibirás un enlace para restablecer tu contraseña"))
                                .build();
        }

        /* --------------------- RESET-PASSWORD --------------------- */
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