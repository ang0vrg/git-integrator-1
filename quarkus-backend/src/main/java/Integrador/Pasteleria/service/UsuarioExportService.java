// META-INF/resources/logoV1.png
package Integrador.Pasteleria.service;

import Integrador.Pasteleria.dto.UsuarioDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.DefaultIndexedColorMap;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.apache.poi.util.IOUtils;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@ApplicationScoped
public class UsuarioExportService {

    private static final int[] COLUMN_WIDTHS = { 3000, 5000, 6000, 4000, 4000, 6000 };
    private static final String LOGO_PATH = "META-INF/resources/logoV1.png";

    public Response exportExcel(List<UsuarioDTO> list) throws IOException {
        System.out.println(" Creando Excel con " + list.size() + " filas");

        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Usuarios");

            // 1️⃣ Anchos de columnas
            for (int i = 0; i < COLUMN_WIDTHS.length; i++) {
                sheet.setColumnWidth(i, COLUMN_WIDTHS[i]);
            }

            // 2️⃣ Paleta de colores personalizada
            DefaultIndexedColorMap colorMap = new DefaultIndexedColorMap();
            XSSFColor colorHeader = new XSSFColor(new Color(0xEC, 0x00, 0x3F), colorMap); // rojo fuerte #ec003f
            XSSFColor colorCellBg = new XSSFColor(new Color(0xFF, 0xB6, 0x7E), colorMap); // durazno #ffb67e
            XSSFColor colorWhiteGray = new XSSFColor(new Color(0xF7, 0xF7, 0xF7), colorMap); // blanco ceniza

            // 3️⃣ Estilo encabezado
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            ((XSSFCellStyle) headerStyle).setFillForegroundColor(colorHeader);
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            // 4️⃣ Estilos de celdas (alternar colores)
            CellStyle evenStyle = workbook.createCellStyle();
            ((XSSFCellStyle) evenStyle).setFillForegroundColor(colorCellBg);
            evenStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            CellStyle oddStyle = workbook.createCellStyle();
            ((XSSFCellStyle) oddStyle).setFillForegroundColor(colorWhiteGray);
            oddStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Bordes y alineación para ambos
            for (CellStyle style : new CellStyle[] { evenStyle, oddStyle }) {
                style.setBorderBottom(BorderStyle.THIN);
                style.setBorderTop(BorderStyle.THIN);
                style.setBorderLeft(BorderStyle.THIN);
                style.setBorderRight(BorderStyle.THIN);
                style.setAlignment(HorizontalAlignment.CENTER);
                style.setVerticalAlignment(VerticalAlignment.CENTER);
            }

            // 5️⃣ Insertar logo al final
            insertLogo(workbook, sheet, list.size() + 4); // se ubica al final

            // 6️⃣ Encabezado
            Row header = sheet.createRow(2);
            String[] cols = { "ID", "Nombre", "Correo", "Rol", "Teléfono", "Registro" };
            for (int i = 0; i < cols.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(cols[i]);
                cell.setCellStyle(headerStyle);
            }

            // 7️⃣ Datos
            int rowNum = 3;
            for (UsuarioDTO u : list) {
                Row row = sheet.createRow(rowNum);
                CellStyle currentStyle = (rowNum % 2 == 0) ? evenStyle : oddStyle;
                row.createCell(0).setCellValue(u.id);
                row.createCell(1).setCellValue(u.username);
                row.createCell(2).setCellValue(u.userEmail);
                row.createCell(3).setCellValue(u.userRole);
                row.createCell(4).setCellValue(u.phoneNumber);
                row.createCell(5).setCellValue(u.createdAt.toString());
                for (int i = 0; i < cols.length; i++)
                    row.getCell(i).setCellStyle(currentStyle);
                rowNum++;
            }

            workbook.write(out);
            System.out.println("✅ Excel generado con logo y colores: " + out.size() + " bytes");

            return Response
                    .ok(out.toByteArray())
                    .header("Content-Disposition", "attachment; filename=usuarios.xlsx")
                    .build();
        }
    }

    /* 🔻 Inserta el logo al final de la columna 'createdAt' 🔻 */
    private void insertLogo(Workbook wb, Sheet sheet, int rowPos) throws IOException {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(LOGO_PATH)) {
            if (is == null) {
                System.out.println("⚠️ Logo no encontrado en classpath: " + LOGO_PATH);
                return;
            }
            byte[] bytes = IOUtils.toByteArray(is);
            int pictureIdx = wb.addPicture(bytes, Workbook.PICTURE_TYPE_PNG);

            CreationHelper helper = wb.getCreationHelper();
            Drawing<?> drawing = sheet.createDrawingPatriarch();
            ClientAnchor anchor = helper.createClientAnchor();

            // Colocar logo en la última columna ("createdAt")
            anchor.setCol1(5); // columna 6 (0-based)
            anchor.setRow1(rowPos + 2); // debajo de los datos
            anchor.setDx1(50);
            anchor.setDy1(10);

            Picture pict = drawing.createPicture(anchor, pictureIdx);
            pict.resize(0.6); // ajustar tamaño
        }
    }
}
