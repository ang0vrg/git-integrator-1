package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.report.SalesFilterDTO;
import Integrador.Pasteleria.dto.report.SalesReportDTO;
import Integrador.Pasteleria.dto.report.SalesStatisticsDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@ApplicationScoped
public class SalesReportService {

    @Inject
    EntityManager em;

    /**
     * Get all sales with optional filters
     */
    public List<SalesReportDTO> getAllSales(SalesFilterDTO filter) {
        StringBuilder jpql = new StringBuilder(
                "SELECT NEW Integrador.Pasteleria.dto.report.SalesReportDTO(" +
                        "v.idSale, v.numeroVenta, p.numeroPedido, " +
                        "u.username, u.userEmail, v.montoTotal, v.montoPagado, " +
                        "CAST(v.estadoPago AS string), ep.nombre, ep.codigo, ep.colorHex, " +
                        "mp.nombre, v.referenciaTransaccion, v.saleDate, v.fechaPago, p.orderDate) " +
                        "FROM Venta v " +
                        "JOIN v.order p " +
                        "JOIN p.estadoActual ep " +
                        "JOIN p.user u " +
                        "JOIN v.metodoPago mp " +
                        "WHERE 1=1");

        // Apply filters
        if (filter != null) {
            if (filter.getFechaInicio() != null) {
                jpql.append(" AND v.saleDate >= :fechaInicio");
            }
            if (filter.getFechaFin() != null) {
                jpql.append(" AND v.saleDate <= :fechaFin");
            }
            if (filter.getEstadoPago() != null && !filter.getEstadoPago().isEmpty()) {
                jpql.append(" AND CAST(v.estadoPago AS string) = :estadoPago");
            }
            if (filter.getEstadoPedidoCodigo() != null && !filter.getEstadoPedidoCodigo().isEmpty()) {
                jpql.append(" AND ep.codigo = :estadoPedido");
            }
            if (filter.getMetodoPago() != null && !filter.getMetodoPago().isEmpty()) {
                jpql.append(" AND mp.nombre = :metodoPago");
            }
            if (filter.getClienteId() != null) {
                jpql.append(" AND u.idUser = :clienteId");
            }
            if (filter.getSearchTerm() != null && !filter.getSearchTerm().isEmpty()) {
                jpql.append(
                        " AND (LOWER(u.username) LIKE :searchTerm OR LOWER(u.userEmail) LIKE :searchTerm OR LOWER(v.numeroVenta) LIKE :searchTerm)");
            }
        }

        jpql.append(" ORDER BY v.saleDate DESC");

        TypedQuery<SalesReportDTO> query = em.createQuery(jpql.toString(), SalesReportDTO.class);

        // Set parameters
        if (filter != null) {
            if (filter.getFechaInicio() != null) {
                query.setParameter("fechaInicio", filter.getFechaInicio().atStartOfDay());
            }
            if (filter.getFechaFin() != null) {
                query.setParameter("fechaFin", filter.getFechaFin().atTime(23, 59, 59));
            }
            if (filter.getEstadoPago() != null && !filter.getEstadoPago().isEmpty()) {
                query.setParameter("estadoPago", filter.getEstadoPago());
            }
            if (filter.getEstadoPedidoCodigo() != null && !filter.getEstadoPedidoCodigo().isEmpty()) {
                query.setParameter("estadoPedido", filter.getEstadoPedidoCodigo());
            }
            if (filter.getMetodoPago() != null && !filter.getMetodoPago().isEmpty()) {
                query.setParameter("metodoPago", filter.getMetodoPago());
            }
            if (filter.getClienteId() != null) {
                query.setParameter("clienteId", filter.getClienteId());
            }
            if (filter.getSearchTerm() != null && !filter.getSearchTerm().isEmpty()) {
                query.setParameter("searchTerm", "%" + filter.getSearchTerm().toLowerCase() + "%");
            }
        }

        return query.getResultList();
    }

    /**
     * Get sales statistics
     */
    public SalesStatisticsDTO getSalesStatistics(SalesFilterDTO filter) {
        SalesStatisticsDTO stats = new SalesStatisticsDTO();

        // Build base query for filtering
        StringBuilder fromClause = new StringBuilder("FROM Venta v ");
        StringBuilder whereClause = new StringBuilder("WHERE 1=1");
        Map<String, Object> parameters = new HashMap<>();

        // Add joins if needed for filters
        boolean joinOrder = false;
        boolean joinUser = false;
        boolean joinPaymentMethod = false;

        if (filter != null) {
            if (filter.getEstadoPedidoCodigo() != null && !filter.getEstadoPedidoCodigo().isEmpty()) {
                joinOrder = true;
            }
            if (filter.getClienteId() != null
                    || (filter.getSearchTerm() != null && !filter.getSearchTerm().isEmpty())) {
                joinOrder = true;
                joinUser = true;
            }
            if (filter.getMetodoPago() != null && !filter.getMetodoPago().isEmpty()) {
                joinPaymentMethod = true;
            }
        }

        if (joinOrder) {
            fromClause.append("JOIN v.order p JOIN p.estadoActual ep ");
        }
        if (joinUser) {
            // Ensure p is joined
            if (!joinOrder)
                fromClause.append("JOIN v.order p ");
            fromClause.append("JOIN p.user u ");
        }
        if (joinPaymentMethod) {
            fromClause.append("JOIN v.metodoPago mp ");
        }

        if (filter != null) {
            if (filter.getFechaInicio() != null) {
                whereClause.append(" AND v.saleDate >= :fechaInicio");
                parameters.put("fechaInicio", filter.getFechaInicio().atStartOfDay());
            }
            if (filter.getFechaFin() != null) {
                whereClause.append(" AND v.saleDate <= :fechaFin");
                parameters.put("fechaFin", filter.getFechaFin().atTime(23, 59, 59));
            }
            if (filter.getEstadoPago() != null && !filter.getEstadoPago().isEmpty()) {
                whereClause.append(" AND CAST(v.estadoPago AS string) = :estadoPago");
                parameters.put("estadoPago", filter.getEstadoPago());
            }
            if (filter.getEstadoPedidoCodigo() != null && !filter.getEstadoPedidoCodigo().isEmpty()) {
                whereClause.append(" AND ep.codigo = :estadoPedido");
                parameters.put("estadoPedido", filter.getEstadoPedidoCodigo());
            }
            if (filter.getMetodoPago() != null && !filter.getMetodoPago().isEmpty()) {
                whereClause.append(" AND mp.nombre = :metodoPago");
                parameters.put("metodoPago", filter.getMetodoPago());
            }
            if (filter.getClienteId() != null) {
                whereClause.append(" AND u.idUser = :clienteId");
                parameters.put("clienteId", filter.getClienteId());
            }
            if (filter.getSearchTerm() != null && !filter.getSearchTerm().isEmpty()) {
                whereClause.append(
                        " AND (LOWER(u.username) LIKE :searchTerm OR LOWER(u.userEmail) LIKE :searchTerm OR LOWER(v.numeroVenta) LIKE :searchTerm)");
                parameters.put("searchTerm", "%" + filter.getSearchTerm().toLowerCase() + "%");
            }
        }

        // Total sales and amount
        String totalQuery = "SELECT COUNT(v), COALESCE(SUM(v.montoTotal), 0), COALESCE(AVG(v.montoTotal), 0) " +
                fromClause + whereClause;

        TypedQuery<Object[]> tq = em.createQuery(totalQuery, Object[].class);
        parameters.forEach(tq::setParameter);
        Object[] totals = tq.getSingleResult();

        stats.setTotalVentas((Long) totals[0]);
        stats.setMontoTotalVentas((BigDecimal) totals[1]);

        // Fix for AVG returning Double
        Object avgResult = totals[2];
        if (avgResult instanceof Double) {
            stats.setPromedioVenta(BigDecimal.valueOf((Double) avgResult).setScale(2, RoundingMode.HALF_UP));
        } else if (avgResult instanceof BigDecimal) {
            stats.setPromedioVenta(((BigDecimal) avgResult).setScale(2, RoundingMode.HALF_UP));
        } else {
            stats.setPromedioVenta(BigDecimal.ZERO);
        }

        // Sales by payment status
        String statusQuery = "SELECT CAST(v.estadoPago AS string), COUNT(v) " + fromClause +
                whereClause + " GROUP BY v.estadoPago";
        TypedQuery<Object[]> sq = em.createQuery(statusQuery, Object[].class);
        parameters.forEach(sq::setParameter);

        Map<String, Long> ventasPorEstado = new HashMap<>();
        for (Object[] row : sq.getResultList()) {
            String estado = (String) row[0];
            Long count = (Long) row[1];
            ventasPorEstado.put(estado, count);

            // Set individual counters
            switch (estado.toLowerCase()) {
                case "pagado":
                    stats.setVentasPagadas(count);
                    break;
                case "pendiente":
                    stats.setVentasPendientes(count);
                    break;
                case "parcial":
                    stats.setVentasParciales(count);
                    break;
                case "rechazado":
                    stats.setVentasRechazadas(count);
                    break;
                case "reembolsado":
                    stats.setVentasReembolsadas(count);
                    break;
            }
        }
        stats.setVentasPorEstadoPago(ventasPorEstado);

        // Initialize zero values for missing states
        if (stats.getVentasPagadas() == null)
            stats.setVentasPagadas(0L);
        if (stats.getVentasPendientes() == null)
            stats.setVentasPendientes(0L);
        if (stats.getVentasParciales() == null)
            stats.setVentasParciales(0L);
        if (stats.getVentasRechazadas() == null)
            stats.setVentasRechazadas(0L);
        if (stats.getVentasReembolsadas() == null)
            stats.setVentasReembolsadas(0L);

        // Sales by payment method
        // Need to ensure mp is joined if not already
        StringBuilder methodFromClause = new StringBuilder(fromClause);
        if (!joinPaymentMethod) {
            methodFromClause.append("JOIN v.metodoPago mp ");
        }

        String methodQuery = "SELECT mp.nombre, COUNT(v), COALESCE(SUM(v.montoTotal), 0) " +
                methodFromClause + whereClause + " GROUP BY mp.nombre";
        TypedQuery<Object[]> mq = em.createQuery(methodQuery, Object[].class);
        parameters.forEach(mq::setParameter);

        Map<String, Long> ventasPorMetodo = new HashMap<>();
        Map<String, BigDecimal> montosPorMetodo = new HashMap<>();
        for (Object[] row : mq.getResultList()) {
            ventasPorMetodo.put((String) row[0], (Long) row[1]);
            montosPorMetodo.put((String) row[0], (BigDecimal) row[2]);
        }
        stats.setVentasPorMetodoPago(ventasPorMetodo);
        stats.setMontosPorMetodoPago(montosPorMetodo);

        return stats;
    }

    /**
     * Get single sale details
     */
    public SalesReportDTO getSaleById(Integer id) {
        String jpql = "SELECT NEW Integrador.Pasteleria.dto.report.SalesReportDTO(" +
                "v.idSale, v.numeroVenta, p.numeroPedido, " +
                "u.username, u.userEmail, v.montoTotal, v.montoPagado, " +
                "CAST(v.estadoPago AS string), ep.nombre, ep.codigo, ep.colorHex, " +
                "mp.nombre, v.referenciaTransaccion, v.saleDate, v.fechaPago, p.orderDate) " +
                "FROM Venta v " +
                "JOIN v.order p " +
                "JOIN p.estadoActual ep " +
                "JOIN p.user u " +
                "JOIN v.metodoPago mp " +
                "WHERE v.idSale = :id";

        return em.createQuery(jpql, SalesReportDTO.class)
                .setParameter("id", id)
                .getSingleResult();
    }
}
