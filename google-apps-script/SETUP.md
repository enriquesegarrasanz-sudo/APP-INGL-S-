# Configurar Google Sheets como base de datos

## Paso 1: Crear la Google Sheet

1. Ve a [sheets.google.com](https://sheets.google.com)
2. Crea una hoja nueva: "Sparring English OS"

## Paso 2: Crear el Apps Script

1. En la hoja, ve a **Extensiones > Apps Script**
2. Borra el contenido que aparece por defecto
3. Copia y pega todo el contenido del archivo `Code.gs`
4. Guarda (Ctrl+S)

## Paso 3: Inicializar las hojas

1. En el editor de Apps Script, selecciona la funcion `setupSheets` en el desplegable
2. Haz clic en "Ejecutar"
3. Acepta los permisos cuando te lo pida
4. Deberian crearse 4 hojas: expressions, scripts, reviews, meta

## Paso 4: Desplegar como Web App

1. Haz clic en **Implementar > Nueva implementacion**
2. Tipo: **Aplicacion web**
3. Ejecutar como: **Yo**
4. Quien tiene acceso: **Cualquier persona**
5. Haz clic en **Implementar**
6. Copia la URL que te da

## Paso 5: Configurar en la app

1. En el proyecto, crea el archivo `.env.local` (si no existe)
2. Agrega la URL:

```
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/TU_ID_AQUI/exec
```

3. Reinicia el servidor de desarrollo (`npm run dev`)

## Verificar que funciona

Abre en el navegador:
```
https://script.google.com/macros/s/TU_ID_AQUI/exec?action=ping
```

Deberia devolver:
```json
{"status": "ok", "timestamp": "2026-05-23T..."}
```

## Notas

- La URL del script no cambia mientras no hagas una nueva implementacion
- Los datos se guardan como JSON en cada hoja (una fila por tabla)
- El tamano maximo por celda en Google Sheets es 50,000 caracteres (mas que suficiente para vocabulario)
- No necesitas tocar la hoja directamente, pero puedes ver los datos ahi si quieres
