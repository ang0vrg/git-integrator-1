package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "Producto")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_product")
    private Integer idProduct;

    @Column(name = "product_name", nullable = false, unique = true)
    private String productName;

    @Column(name = "product_description", nullable = false)
    private String productDescription;

    @Column(name = "product_quantity", nullable = false)
    private Integer productQuantity;
    
    @Column(name = "product_price", nullable = false)
    private Double productPrice;

    @ManyToOne
    @JoinColumn(name = "id_supplier", nullable = false)
    private Proveedor supplier;

    @Column(name = "added_on", updatable = false)
    private LocalDateTime addedOn;

    @Column(name = "updated_on")
    private LocalDateTime updatedOn;

    @PrePersist
    protected void onCreate() {
        addedOn = LocalDateTime.now();
        updatedOn = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedOn = LocalDateTime.now();
    }

    public enum ProductType {
        PASTEL,
        TORTA,
        GALLETAS,
        CHOCOLATES,
        GOMA,
        BEBIDAS,
        OTROS
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "product_type", nullable = false)
    private ProductType productType;

    @Column(name = "product_image", nullable = false)
    private String productImage;

    @Column(name = "product_status", nullable = false)
    private String productStatus;

    @Column(name = "product_category", nullable = false)
    private String productCategory;

    @Column(name = "product_tags", nullable = false)
    private String productTags;

    @Column(name = "product_ingredients", nullable = false)
    private String productIngredients;

    @Column(name = "product_instructions", nullable = false)
    private String productInstructions;

    @Column(name = "product_nutritional_info", nullable = false)
    private String productNutritionalInfo;

    @Column(name = "product_allergens", nullable = false)
    private String productAllergens;

    @Column(name = "product_related_products", nullable = false)
    private String productRelatedProducts;

    @Column(name = "product_related_recipes", nullable = false)
    private String productRelatedRecipes;

    @Column(name = "product_related_tips", nullable = false)
    private String productRelatedTips;

    @Column(name = "product_related_faqs", nullable = false)
    private String productRelatedFAQs;
}
