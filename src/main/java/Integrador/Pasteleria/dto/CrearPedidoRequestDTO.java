package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

import lombok.AllArgsConstructor;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearPedidoRequestDTO {   
    private Integer idUser;    
    private List<DatosPedidoDTO> productos;
}
