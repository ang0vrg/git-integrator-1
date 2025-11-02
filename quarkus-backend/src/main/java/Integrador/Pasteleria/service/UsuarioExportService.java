package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.UsuarioDTO;
import jakarta.ws.rs.core.Response;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@ApplicationScoped
public class UsuarioExportService {

    public Response exportExcel(List<UsuarioDTO> list) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Usuarios");

        // Header
        Row header = sheet.createRow(0);
        String[] cols = { "ID", "Nombre", "Correo", "Rol", "Teléfono", "Registro" };
        for (int i = 0; i < cols.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(cols[i]);
        }

        // Data
        int rowNum = 1;
        for (UsuarioDTO u : list) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(u.id);
            row.createCell(1).setCellValue(u.username);
            row.createCell(2).setCellValue(u.userEmail);
            row.createCell(3).setCellValue(u.userRole);
            row.createCell(4).setCellValue(u.phoneNumber);
            row.createCell(5).setCellValue(u.createdAt.toString());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return Response
                .ok(out.toByteArray())
                .header("Content-Disposition", "attachment; filename=usuarios.xlsx")
                .build();
    }
}