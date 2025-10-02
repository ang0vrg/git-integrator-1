// quarkus-backend\src\main\java\Integrador\Pasteleria\dto\ResetPasswordRequest.java
package Integrador.Pasteleria.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResetPasswordRequest {
    private String token;
    private String newPassword;
    private String confirmPassword;
}