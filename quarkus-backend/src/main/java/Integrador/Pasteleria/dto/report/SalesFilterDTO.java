package Integrador.Pasteleria.dto.report;

import java.time.LocalDate;

public class SalesFilterDTO {
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private String estadoPago;
    private String estadoPedidoCodigo;
    private String metodoPago;
    private Integer clienteId;
    private String searchTerm;

    public SalesFilterDTO() {
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstadoPago() {
        return estadoPago;
    }

    public void setEstadoPago(String estadoPago) {
        this.estadoPago = estadoPago;
    }

    public String getEstadoPedidoCodigo() {
        return estadoPedidoCodigo;
    }

    public void setEstadoPedidoCodigo(String estadoPedidoCodigo) {
        this.estadoPedidoCodigo = estadoPedidoCodigo;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public Integer getClienteId() {
        return clienteId;
    }

    public void setClienteId(Integer clienteId) {
        this.clienteId = clienteId;
    }

    public String getSearchTerm() {
        return searchTerm;
    }

    public void setSearchTerm(String searchTerm) {
        this.searchTerm = searchTerm;
    }
}
