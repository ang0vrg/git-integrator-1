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

import javax.imageio.ImageIO;
import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;
import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@ApplicationScoped
public class UsuarioExportService {

    private static final int[] COLUMN_WIDTHS = { 3000, 5000, 6000, 4000, 4000, 6000 };
    private static final String LOGO_PATH = "META-INF/resources/logoV1.png";
    private static final float LOGO_OPACITY = 0.15f; // 15% de opacidad (marca de agua sutil)

    public Response exportExcel(List<UsuarioDTO> list) throws IOException {
        System.out.println("📊 Creando Excel con " + list.size() + " filas");

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

            // 5️⃣ Insertar logo CENTRADO como marca de agua ANTES de los datos
            insertWatermarkLogo(workbook, sheet, list.size());

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

                // Crear celdas con validación de nulos
                row.createCell(0).setCellValue(u.getIdUser() != null ? u.getIdUser() : 0);
                row.createCell(1).setCellValue(u.getUsername() != null ? u.getUsername() : "");
                row.createCell(2).setCellValue(u.getUserEmail() != null ? u.getUserEmail() : "");
                row.createCell(3).setCellValue(u.getUserRole() != null ? u.getUserRole() : "");
                row.createCell(4).setCellValue(u.getPhoneNumber() != null ? u.getPhoneNumber() : "");
                row.createCell(5).setCellValue(u.getCreatedAt() != null ? u.getCreatedAt().toString() : "N/A");

                // Aplicar estilos
                for (int i = 0; i < cols.length; i++)
                    row.getCell(i).setCellStyle(currentStyle);
                rowNum++;
            }

            workbook.write(out);
            System.out.println("✅ Excel generado con marca de agua: " + out.size() + " bytes");

            return Response
                    .ok(out.toByteArray())
                    .header("Content-Disposition", "attachment; filename=usuarios.xlsx")
                    .build();
        }
    }

    /**
     * 🎨 Inserta el logo con opacidad como marca de agua centrada en la hoja
     */
    private void insertWatermarkLogo(Workbook wb, Sheet sheet, int totalRows) throws IOException {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream(LOGO_PATH)) {
            if (is == null) {
                System.out.println("⚠️ Logo no encontrado en classpath: " + LOGO_PATH);
                return;
            }

            // Leer la imagen original
            byte[] originalBytes = IOUtils.toByteArray(is);
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));

            if (originalImage == null) {
                System.out.println("⚠️ No se pudo leer la imagen");
                return;
            }

            // Crear imagen con transparencia
            BufferedImage watermarkImage = applyTransparency(originalImage, LOGO_OPACITY);

            // Convertir a bytes
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(watermarkImage, "PNG", baos);
            byte[] watermarkBytes = baos.toByteArray();

            int pictureIdx = wb.addPicture(watermarkBytes, Workbook.PICTURE_TYPE_PNG);

            CreationHelper helper = wb.getCreationHelper();
            Drawing<?> drawing = sheet.createDrawingPatriarch();
            ClientAnchor anchor = helper.createClientAnchor();

            // 📍 Posicionar el logo CENTRADO en el área de datos
            int startRow = 2; // Empieza después del header
            int endRow = Math.max(startRow + totalRows + 2, 15); // Mínimo 15 filas de altura

            // Centrar horizontalmente (columnas 1-4 de 6 totales)
            anchor.setCol1(1); // Columna inicio
            anchor.setCol2(5); // Columna fin
            anchor.setRow1(startRow);
            anchor.setRow2(endRow);

            // Offsets para centrar mejor (en unidades EMU)
            anchor.setDx1(500); // Margen izquierdo
            anchor.setDy1(500); // Margen superior
            anchor.setDx2(-500); // Margen derecho
            anchor.setDy2(-500); // Margen inferior

            Picture pict = drawing.createPicture(anchor, pictureIdx);

            System.out.println("🖼️ Marca de agua insertada con " + (LOGO_OPACITY * 100) + "% de opacidad");
        }
    }

    /**
     * 🎨 Aplica transparencia a una imagen
     */
    private BufferedImage applyTransparency(BufferedImage original, float opacity) {
        BufferedImage transparent = new BufferedImage(
                original.getWidth(),
                original.getHeight(),
                BufferedImage.TYPE_INT_ARGB);

        Graphics2D g2d = transparent.createGraphics();

        // Configurar calidad de renderizado
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);

        // Aplicar opacidad
        g2d.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_OVER, opacity));
        g2d.drawImage(original, 0, 0, null);
        g2d.dispose();

        return transparent;
    }
}