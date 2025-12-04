package Integrador.Pasteleria.dto.report;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

public class SalesStatisticsDTO {
    private Long totalVentas;
    private BigDecimal montoTotalVentas;
    private BigDecimal promedioVenta;
    private Long ventasPagadas;
    private Long ventasPendientes;
    private Long ventasParciales;
    private Long ventasRechazadas;
    private Long ventasReembolsadas;
    private Map<String, Long> ventasPorMetodoPago;
    private Map<String, Long> ventasPorEstadoPago;
    private Map<String, BigDecimal> montosPorMetodoPago;

    public SalesStatisticsDTO() {
        this.ventasPorMetodoPago = new HashMap<>();
        this.ventasPorEstadoPago = new HashMap<>();
        this.montosPorMetodoPago = new HashMap<>();
    }

    // Getters and Setters
    public Long getTotalVentas() {
        return totalVentas;
    }

    public void setTotalVentas(Long totalVentas) {
        this.totalVentas = totalVentas;
    }

    public BigDecimal getMontoTotalVentas() {
        return montoTotalVentas;
    }

    public void setMontoTotalVentas(BigDecimal montoTotalVentas) {
        this.montoTotalVentas = montoTotalVentas;
    }

    public BigDecimal getPromedioVenta() {
        return promedioVenta;
    }

    public void setPromedioVenta(BigDecimal promedioVenta) {
        this.promedioVenta = promedioVenta;
    }

    public Long getVentasPagadas() {
        return ventasPagadas;
    }

    public void setVentasPagadas(Long ventasPagadas) {
        this.ventasPagadas = ventasPagadas;
    }

    public Long getVentasPendientes() {
        return ventasPendientes;
    }

    public void setVentasPendientes(Long ventasPendientes) {
        this.ventasPendientes = ventasPendientes;
    }

    public Long getVentasParciales() {
        return ventasParciales;
    }

    public void setVentasParciales(Long ventasParciales) {
        this.ventasParciales = ventasParciales;
    }

    public Long getVentasRechazadas() {
        return ventasRechazadas;
    }

    public void setVentasRechazadas(Long ventasRechazadas) {
        this.ventasRechazadas = ventasRechazadas;
    }

    public Long getVentasReembolsadas() {
        return ventasReembolsadas;
    }

    public void setVentasReembolsadas(Long ventasReembolsadas) {
        this.ventasReembolsadas = ventasReembolsadas;
    }

    public Map<String, Long> getVentasPorMetodoPago() {
        return ventasPorMetodoPago;
    }

    public void setVentasPorMetodoPago(Map<String, Long> ventasPorMetodoPago) {
        this.ventasPorMetodoPago = ventasPorMetodoPago;
    }

    public Map<String, Long> getVentasPorEstadoPago() {
        return ventasPorEstadoPago;
    }

    public void setVentasPorEstadoPago(Map<String, Long> ventasPorEstadoPago) {
        this.ventasPorEstadoPago = ventasPorEstadoPago;
    }

    public Map<String, BigDecimal> getMontosPorMetodoPago() {
        return montosPorMetodoPago;
    }

    public void setMontosPorMetodoPago(Map<String, BigDecimal> montosPorMetodoPago) {
        this.montosPorMetodoPago = montosPorMetodoPago;
    }
}
