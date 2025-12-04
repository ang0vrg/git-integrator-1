package Integrador.Pasteleria.dto.paypal;

public class VerifyPaymentRequest {
    private String paymentId;
    private String verificationCode;

    public VerifyPaymentRequest() {
    }

    public VerifyPaymentRequest(String paymentId, String verificationCode) {
        this.paymentId = paymentId;
        this.verificationCode = verificationCode;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getVerificationCode() {
        return verificationCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.verificationCode = verificationCode;
    }
}
