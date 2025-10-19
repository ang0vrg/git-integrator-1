@echo off
setlocal enabledelayedexpansion

:: ============================================================================
:: Archivo: run-quarkus.bat
:: Descripción: Carga variables desde email.env y ejecuta Quarkus en modo dev
:: ============================================================================

set "ENV_FILE=email.env"

echo ================================================
echo Iniciando servidor Quarkus con email.env
echo ================================================
echo.

:: Verificar existencia del archivo
if not exist "%ENV_FILE%" (
    echo ERROR: No se encontró el archivo %ENV_FILE%.
    echo Crea un archivo con el siguiente formato:
    echo.
    echo QUARKUS_MAILER_FROM=tu-correo@gmail.com
    echo QUARKUS_MAILER_USERNAME=tu-correo@gmail.com
    echo QUARKUS_MAILER_PASSWORD=tu-contrasena-app
    echo QUARKUS_MAILER_HOST=smtp.gmail.com
    echo QUARKUS_MAILER_PORT=465
    echo QUARKUS_MAILER_SSL=true
    echo MAIL_TEST_RECIPIENT=otro-correo@gmail.com
    echo.
    pause
    exit /b 1
)

:: Cargar variables del archivo email.env
echo Cargando variables desde %ENV_FILE%...
for /f "usebackq tokens=1,2 delims==" %%A in ("%ENV_FILE%") do (
    set "key=%%A"
    set "value=%%B"
    :: Saltar comentarios o líneas vacías
    if not "!key!"=="" if not "!key:~0,1!"=="#" (
        set "!key!=!value!"
    )
)

:: Validar variables críticas
if "%QUARKUS_MAILER_FROM%"=="" (
    echo ERROR: QUARKUS_MAILER_FROM no está definido en %ENV_FILE%
    pause
    exit /b 1
)
if "%QUARKUS_MAILER_PASSWORD%"=="" (
    echo ERROR: QUARKUS_MAILER_PASSWORD no está definido en %ENV_FILE%
    pause
    exit /b 1
)

echo.
echo Variables cargadas correctamente:
echo    FROM: %QUARKUS_MAILER_FROM%
echo    TO:   %MAIL_TEST_RECIPIENT%
echo.

:: Ejecutar Quarkus en modo desarrollo
echo Iniciando Quarkus...
echo ================================================
mvn quarkus:dev

:: Si Quarkus falla
if errorlevel 1 (
    echo.
    echo La aplicación falló al iniciar.
    echo.
    pause
)
endlocal
