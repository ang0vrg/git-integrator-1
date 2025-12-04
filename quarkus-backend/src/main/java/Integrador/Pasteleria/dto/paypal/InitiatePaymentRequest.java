package Integrador.Pasteleria.dto.paypal;

import java.math.BigDecimal;

public class InitiatePaymentRequest {
    private BigDecimal monto;
    private String descripcion;

    public InitiatePaymentRequest() {
    }

    public InitiatePaymentRequest(BigDecimal monto, String descripcion) {
        this.monto = monto;
        this.descripcion = descripcion;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
