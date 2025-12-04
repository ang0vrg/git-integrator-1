package Integrador.Pasteleria.dto.paypal;

public class InitiatePaymentResponse {
    private String paymentId;
    private String message;
    private Integer expiresIn; // seconds

    public InitiatePaymentResponse() {
    }

    public InitiatePaymentResponse(String paymentId, String message, Integer expiresIn) {
        this.paymentId = paymentId;
        this.message = message;
        this.expiresIn = expiresIn;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Integer getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Integer expiresIn) {
        this.expiresIn = expiresIn;
    }
}
