package Integrador.Pasteleria.dto;

import java.math.BigDecimal;

public class CartItemDTO {
    private Integer idProduct;
    private Integer quantity;
    private BigDecimal price;
    private String productName;

    public CartItemDTO() {
    }

    public CartItemDTO(Integer idProduct, Integer quantity, BigDecimal price, String productName) {
        this.idProduct = idProduct;
        this.quantity = quantity;
        this.price = price;
        this.productName = productName;
    }

    public Integer getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Integer idProduct) {
        this.idProduct = idProduct;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }
}
