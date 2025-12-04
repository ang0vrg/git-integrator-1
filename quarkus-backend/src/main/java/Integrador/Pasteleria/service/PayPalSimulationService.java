package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.paypal.InitiatePaymentResponse;
import Integrador.Pasteleria.dto.paypal.VerifyPaymentResponse;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@ApplicationScoped
public class PayPalSimulationService {

    private final Map<String, PaymentVerification> pendingPayments = new ConcurrentHashMap<>();
    private final Random random = new Random();
    private static final int CODE_EXPIRATION_MINUTES = 5;
    private static final int CODE_EXPIRATION_SECONDS = CODE_EXPIRATION_MINUTES * 60;

    /**
     * Initiates a PayPal payment simulation by generating a verification code
     * and displaying it in the terminal.
     */
    public InitiatePaymentResponse initiatePayment(BigDecimal amount, String description) {
        // Generate unique payment ID
        String paymentId = "PAY-" + System.currentTimeMillis();

        // Generate random 6-digit verification code
        String code = String.format("%06d", random.nextInt(1000000));

        // Calculate expiration time
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(CODE_EXPIRATION_MINUTES);

        // Store payment verification data
        PaymentVerification verification = new PaymentVerification(
                code,
                amount,
                description,
                expiresAt);
        pendingPayments.put(paymentId, verification);

        // Print verification code to terminal with beautiful formatting
        printVerificationCodeToTerminal(paymentId, code, amount, description);

        return new InitiatePaymentResponse(
                paymentId,
                "Código de verificación generado. Revisa la terminal del servidor.",
                CODE_EXPIRATION_SECONDS);
    }

    /**
     * Verifies the payment by checking if the code matches and hasn't expired.
     */
    public VerifyPaymentResponse verifyPayment(String paymentId, String code) {
        PaymentVerification verification = pendingPayments.get(paymentId);

        if (verification == null) {
            return new VerifyPaymentResponse(
                    false,
                    "Payment ID no encontrado o código ya utilizado",
                    null);
        }

        // Check if code has expired
        if (LocalDateTime.now().isAfter(verification.expiresAt)) {
            pendingPayments.remove(paymentId);
            return new VerifyPaymentResponse(
                    false,
                    "El código de verificación ha expirado",
                    null);
        }

        // Check if code matches
        if (!verification.code.equals(code)) {
            return new VerifyPaymentResponse(
                    false,
                    "Código de verificación incorrecto",
                    null);
        }

        // Code is valid - remove from pending and generate transaction ID
        pendingPayments.remove(paymentId);
        String transactionId = "TXN-" + System.currentTimeMillis();

        // Print success message to terminal
        printSuccessToTerminal(paymentId, transactionId, verification.amount);

        return new VerifyPaymentResponse(
                true,
                "Pago verificado exitosamente",
                transactionId);
    }

    /**
     * Prints the verification code to the terminal with beautiful ANSI formatting.
     */
    private void printVerificationCodeToTerminal(String paymentId, String code, BigDecimal amount, String description) {
        String border = "╔════════════════════════════════════════════════════════╗";
        String borderMid = "╠════════════════════════════════════════════════════════╣";
        String borderEnd = "╚════════════════════════════════════════════════════════╝";

        // ANSI color codes
        String green = "\u001B[32m";
        String yellow = "\u001B[1;33m";
        String cyan = "\u001B[1;36m";
        String red = "\u001B[1;31m";
        String reset = "\u001B[0m";
        String bold = "\u001B[1m";

        System.out.println("\n" + green + border + reset);
        System.out.println(green + "║" + reset + "           " + yellow + "CÓDIGO DE VERIFICACIÓN PAYPAL" + reset
                + "                " + green + "║" + reset);
        System.out.println(green + borderMid + reset);
        System.out.println(green + "║" + reset + "  Payment ID: " + cyan + paymentId + reset
                + padRight("", 56 - 15 - paymentId.length()) + green + "║" + reset);
        System.out.println(green + "║" + reset + "  " + bold + "Código:     " + red + code + reset
                + padRight("", 56 - 14 - code.length()) + green + "║" + reset);
        System.out.println(green + "║" + reset + "  Monto:      S/ " + amount
                + padRight("", 56 - 17 - amount.toString().length()) + green + "║" + reset);

        if (description != null && !description.isEmpty()) {
            String desc = description.length() > 35 ? description.substring(0, 32) + "..." : description;
            System.out.println(green + "║" + reset + "  Desc:       " + desc + padRight("", 56 - 14 - desc.length())
                    + green + "║" + reset);
        }

        System.out.println(green + "║" + reset + "  Expira en:  " + CODE_EXPIRATION_MINUTES + " minutos"
                + padRight("", 56 - 14 - 9) + green + "║" + reset);
        System.out.println(green + borderEnd + reset + "\n");
    }

    /**
     * Prints success message to terminal when payment is verified.
     */
    private void printSuccessToTerminal(String paymentId, String transactionId, BigDecimal amount) {
        String greenCheck = "\u001B[32m✓\u001B[0m";
        String bold = "\u001B[1m";
        String reset = "\u001B[0m";

        System.out.println("\n" + greenCheck + " " + bold + "PAGO VERIFICADO EXITOSAMENTE" + reset);
        System.out.println("  Payment ID:     " + paymentId);
        System.out.println("  Transaction ID: " + transactionId);
        System.out.println("  Monto:          S/ " + amount + "\n");
    }

    /**
     * Helper method to pad strings to the right.
     */
    private String padRight(String str, int length) {
        if (length <= 0)
            return "";
        return String.format("%-" + length + "s", str);
    }

    /**
     * Scheduled task to clean up expired verification codes every minute.
     */
    @Scheduled(every = "60s")
    void cleanExpiredCodes() {
        LocalDateTime now = LocalDateTime.now();
        pendingPayments.entrySet().removeIf(entry -> now.isAfter(entry.getValue().expiresAt));
    }

    /**
     * Inner class to store payment verification data.
     */
    private static class PaymentVerification {
        String code;
        BigDecimal amount;
        String description;
        LocalDateTime expiresAt;

        PaymentVerification(String code, BigDecimal amount, String description, LocalDateTime expiresAt) {
            this.code = code;
            this.amount = amount;
            this.description = description;
            this.expiresAt = expiresAt;
        }
    }
}
