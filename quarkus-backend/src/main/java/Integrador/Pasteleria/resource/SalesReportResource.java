package Integrador.Pasteleria.resource;

import Integrador.Pasteleria.dto.report.SalesFilterDTO;
import Integrador.Pasteleria.dto.report.SalesReportDTO;
import Integrador.Pasteleria.dto.report.SalesStatisticsDTO;
import Integrador.Pasteleria.service.SalesReportService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

@Path("/api/reports/sales")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class SalesReportResource {

    @Inject
    SalesReportService salesReportService;

    /**
     * Get all sales with optional filters
     */
    @POST
    @Path("/list")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response getAllSales(SalesFilterDTO filter) {
        try {
            List<SalesReportDTO> sales = salesReportService.getAllSales(filter);
            return Response.ok(sales).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al obtener ventas: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Get sales statistics
     */
    @POST
    @Path("/statistics")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response getSalesStatistics(SalesFilterDTO filter) {
        try {
            SalesStatisticsDTO stats = salesReportService.getSalesStatistics(filter);
            return Response.ok(stats).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al obtener estadísticas: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    /**
     * Get single sale details
     */
    @GET
    @Path("/{id}")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response getSaleById(@PathParam("id") Integer id) {
        try {
            SalesReportDTO sale = salesReportService.getSaleById(id);
            return Response.ok(sale).build();
        } catch (Exception e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("{\"error\": \"Venta no encontrada\"}")
                    .build();
        }
    }

    /**
     * Get all sales without filters (for quick access)
     */
    @GET
    @RolesAllowed({ "administrador", "trabajador" })
    public Response getAllSalesSimple() {
        try {
            List<SalesReportDTO> sales = salesReportService.getAllSales(null);
            return Response.ok(sales).build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al obtener ventas: " + e.getMessage() + "\"}")
                    .build();
        }
    }

    @Inject

    Integrador.Pasteleria.service.ExportService exportService;

    /**
     * Export sales to Excel
     */
    @POST
    @Path("/export/excel")
    @RolesAllowed({ "administrador", "trabajador" })
    public Response exportSalesExcel(SalesFilterDTO filter) {
        try {
            List<SalesReportDTO> sales = salesReportService.getAllSales(filter);
            byte[] excelFile = exportService.generateSalesExcel(sales);

            return Response.ok(excelFile)
                    .header("Content-Disposition", "attachment; filename=\"reporte_ventas.xlsx\"")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al generar Excel: " + e.getMessage() + "\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }

    /**
     * Export sales to PDF
     */
    @POST
    @Path("/export/pdf")
    @RolesAllowed({ "administrador", "trabajador" })

    @Produces("application/pdf")
    public Response exportSalesPdf(SalesFilterDTO filter) {
        try {
            List<SalesReportDTO> sales = salesReportService.getAllSales(filter);
            byte[] pdfFile = exportService.generateSalesPdf(sales);

            return Response.ok(pdfFile)
                    .header("Content-Disposition", "attachment; filename=\"reporte_ventas.pdf\"")
                    .build();
        } catch (Exception e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\": \"Error al generar PDF: " + e.getMessage() + "\"}")
                    .type(MediaType.APPLICATION_JSON)
                    .build();
        }
    }
}
