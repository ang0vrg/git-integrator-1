// quarkus-backend\src\main\java\Integrador\Pasteleria\dto\PasswordResetToken.java
package Integrador.Pasteleria.dto;

import java.time.Instant;

    public class PasswordResetToken {
    public final String email;
    public final String token;
    public final Instant expiryDate;

    public PasswordResetToken(String email, String token, Instant expiryDate) {
        this.email = email;
        this.token = token;
        this.expiryDate = expiryDate;
    }
    /** 
     * Verifica si el token ha expirado.
     * @return si el tiempo actual es posterior a la fecha de expiración
     */
    public boolean isExpired() {
        return Instant.now().isAfter(expiryDate);
    }
}
