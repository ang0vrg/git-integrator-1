package Integrador.Pasteleria.dto.report;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class SalesReportDTO {
    private Integer idVenta;
    private String numeroVenta;
    private String numeroPedido;
    private String clienteNombre;
    private String clienteEmail;
    private BigDecimal montoTotal;
    private BigDecimal montoPagado;
    private String estadoPago;
    private String estadoPedido;
    private String estadoPedidoCodigo;
    private String estadoPedidoColor;
    private String metodoPago;
    private String referenciaTransaccion;
    private LocalDateTime fechaVenta;
    private LocalDateTime fechaPago;
    private LocalDateTime fechaPedido;

    public SalesReportDTO() {
    }

    public SalesReportDTO(Integer idVenta, String numeroVenta, String numeroPedido,
            String clienteNombre, String clienteEmail, BigDecimal montoTotal,
            BigDecimal montoPagado, String estadoPago, String estadoPedido,
            String estadoPedidoCodigo, String estadoPedidoColor, String metodoPago,
            String referenciaTransaccion, LocalDateTime fechaVenta,
            LocalDateTime fechaPago, LocalDateTime fechaPedido) {
        this.idVenta = idVenta;
        this.numeroVenta = numeroVenta;
        this.numeroPedido = numeroPedido;
        this.clienteNombre = clienteNombre;
        this.clienteEmail = clienteEmail;
        this.montoTotal = montoTotal;
        this.montoPagado = montoPagado;
        this.estadoPago = estadoPago;
        this.estadoPedido = estadoPedido;
        this.estadoPedidoCodigo = estadoPedidoCodigo;
        this.estadoPedidoColor = estadoPedidoColor;
        this.metodoPago = metodoPago;
        this.referenciaTransaccion = referenciaTransaccion;
        this.fechaVenta = fechaVenta;
        this.fechaPago = fechaPago;
        this.fechaPedido = fechaPedido;
    }

    // Getters and Setters
    public Integer getIdVenta() {
        return idVenta;
    }

    public void setIdVenta(Integer idVenta) {
        this.idVenta = idVenta;
    }

    public String getNumeroVenta() {
        return numeroVenta;
    }

    public void setNumeroVenta(String numeroVenta) {
        this.numeroVenta = numeroVenta;
    }

    public String getNumeroPedido() {
        return numeroPedido;
    }

    public void setNumeroPedido(String numeroPedido) {
        this.numeroPedido = numeroPedido;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteEmail() {
        return clienteEmail;
    }

    public void setClienteEmail(String clienteEmail) {
        this.clienteEmail = clienteEmail;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public BigDecimal getMontoPagado() {
        return montoPagado;
    }

    public void setMontoPagado(BigDecimal montoPagado) {
        this.montoPagado = montoPagado;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public String getEstadoPedido() {
        return estadoPedido;
    }

    public void setEstadoPedido(String estadoPedido) {
        this.estadoPedido = estadoPedido;
    }

    public String getEstadoPedidoCodigo() {
        return estadoPedidoCodigo;
    }

    public void setEstadoPedidoCodigo(String estadoPedidoCodigo) {
        this.estadoPedidoCodigo = estadoPedidoCodigo;
    }

    public String getEstadoPedidoColor() {
        return estadoPedidoColor;
    }

    public void setEstadoPedidoColor(String estadoPedidoColor) {
        this.estadoPedidoColor = estadoPedidoColor;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getReferenciaTransaccion() {
        return referenciaTransaccion;
    }

    public void setReferenciaTransaccion(String referenciaTransaccion) {
        this.referenciaTransaccion = referenciaTransaccion;
    }

    public LocalDateTime getFechaVenta() {
        return fechaVenta;
    }

    public void setFechaVenta(LocalDateTime fechaVenta) {
        this.fechaVenta = fechaVenta;
    }

    public LocalDateTime getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }

    public LocalDateTime getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(LocalDateTime fechaPedido) {
        this.fechaPedido = fechaPedido;
    }
}
