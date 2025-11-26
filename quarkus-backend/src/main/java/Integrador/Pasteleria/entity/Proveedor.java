package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.math.BigDecimal;

@Entity
@Table(name = "Proveedor")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_proveedor")
    private Integer idSupplier;

    @Column(name = "nombre_proveedor", nullable = false, unique = true)
    private String supplierName;

    @Column(name = "razon_social")
    private String businessName;

    @Column(name = "ruc", unique = true)
    private String ruc;

    @Column(name = "contacto_nombre")
    private String contactName;

    @Column(name = "contacto_telefono")
    private String contactPhone;

    @Column(name = "contacto_email")
    private String contactEmail;

    @Column(name = "direccion")
    private String address;

    @Column(name = "distrito")
    private String district;

    @Column(name = "ciudad")
    private String city;

    @Column(name = "tiempo_entrega_dias")
    private Integer deliveryTimeDays = 0;

    @Column(name = "calificacion")
    private BigDecimal rating = BigDecimal.ZERO;

    @Column(name = "activo")
    private Boolean active = true;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "fecha_actualizacion")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}