package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.paypal.InitiatePaymentRequest;
import Integrador.Pasteleria.dto.paypal.InitiatePaymentResponse;
import Integrador.Pasteleria.dto.paypal.VerifyPaymentRequest;
import Integrador.Pasteleria.dto.paypal.VerifyPaymentResponse;
import Integrador.Pasteleria.service.PayPalSimulationService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/paypal")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class PayPalResource {

    @Inject
    PayPalSimulationService payPalSimulationService;

    /**
     * Initiates a PayPal payment simulation.
     * Generates a verification code and displays it in the terminal.
     */
    @POST
    @Path("/initiate")
    @RolesAllowed({ "admin", "trabajador", "cliente" })
    public Response initiatePayment(InitiatePaymentRequest request) {
        try {
            if (request.getMonto() == null || request.getMonto().doubleValue() <= 0) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"El monto debe ser mayor a 0\"}")
                        .build();
            }

            InitiatePaymentResponse response = payPalSimulationService.initiatePayment(
                    request.getMonto(),
                    request.getDescripcion());

            return Response.ok(response).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al iniciar el pago: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Verifies a PayPal payment by checking the verification code.
     */
    @POST
    @Path("/verify")
    @RolesAllowed({ "admin", "trabajador", "cliente" })
    public Response verifyPayment(VerifyPaymentRequest request) {
        try {
            if (request.getPaymentId() == null || request.getPaymentId().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Payment ID es requerido\"}")
                        .build();
            }

            if (request.getVerificationCode() == null || request.getVerificationCode().isEmpty()) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("{\"error\": \"Código de verificación es requerido\"}")
                        .build();
            }

            VerifyPaymentResponse response = payPalSimulationService.verifyPayment(
                    request.getPaymentId(),
                    request.getVerificationCode());

            if (response.getSuccess()) {
                return Response.ok(response).build();
            } else {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity(response)
                        .build();
            }
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al verificar el pago: " + e.getMessage() + "\"}")
                    .build();
        }
    }
}
