package Integrador.Pasteleria.resource;

import com.google.common.cache.Cache;
import com.google.common.cache.CacheBuilder;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@ApplicationScoped
public class PasswordResetService {
    
    //Almacen temporal "Cache" para los tokens de reestablecimiento de password
    private final Cache<String,String>  resetTokens = CacheBuilder.newBuilder()
                    .expireAfterWrite(15, TimeUnit.MINUTES)
                    .build();

    /*Genera token unico y lo asocio con el correo del user
     * @param userEmail
     * @return token res. generado
     */

    public String generateResetToken(String userEmail){
        String token =  UUID.randomUUID().toString();
        resetTokens.put(token, userEmail);//Asocia el token con el email
        return token;
    }

    /*Valida el token y recupera el correo del user
     * @param token a validar
     * @return Un optional contenedor del correo del user -- con token valido
     * --IF-- vacio si el token expira/no-existe
     */

    public Optional<String> validateResetToken(String token){
        String userEmail = resetTokens.getIfPresent(token);
        if (userEmail != null) {
            resetTokens.invalidate(token);
            return Optional.of(userEmail);
        }
        return Optional.empty();
    }
}
