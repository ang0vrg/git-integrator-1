package Integrador.Pasteleria.dto.paypal;

public class VerifyPaymentResponse {
    private Boolean success;
    private String message;
    private String transactionId;

    public VerifyPaymentResponse() {
    }

    public VerifyPaymentResponse(Boolean success, String message, String transactionId) {
        this.success = success;
        this.message = message;
        this.transactionId = transactionId;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }
}
