package Integrador.Pasteleria.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pedido_personalizado")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Personalizado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tamano;
    private Integer pisos; 
    private String sabor;  
    private String decoracion; 
    
    @Column(length = 200)
    private String mensajeTorta;

    private String fechaEntrega; 

    private String metodoEntrega; 

    @Column(length = 300)
    private String comentarioAdicional;

    // Aquí podrías tener una relación con Usuario si quieres
    // @ManyToOne
    // private Usuario usuario;
}