# Cliente web – API AWS EC2

Sitio estático HTML + CSS + JavaScript para consumir el endpoint `GET /api/personas` de un servidor FastAPI alojado en AWS EC2 Windows Server.

## Archivos
- `index.html`: interfaz y tabla.
- `styles.css`: diseño responsivo.
- `app.js`: consumo `fetch()`, validación del JSON, manejo de errores y renderizado seguro de filas.

## Respuesta esperada

```json
{
  "total": 2,
  "datos": [
    {"id": 1, "nombre": "Ana López", "edad": 24, "ciudad": "Pachuca", "correo": "ana@example.com"},
    {"id": 2, "nombre": "Carlos Pérez", "edad": 30, "ciudad": "CDMX", "correo": "carlos@example.com"}
  ]
}
```

## Probar localmente

1. En la carpeta del proyecto ejecuta `python -m http.server 5500`.
2. Abre `http://localhost:5500`.
3. Introduce `http://IP_PUBLICA_EC2:8000/api/personas` y selecciona **Consultar personas**.
4. El endpoint debe estar funcionando, el Security Group y Firewall de Windows deben permitir la conexión y FastAPI debe autorizar CORS.

## Publicar en GitHub / Vercel

Copia los tres archivos a la raíz de tu repositorio, realiza commit y push a `main`. Vercel lo desplegará automáticamente (Framework Preset: Other). Puedes configurar la URL de la API en la interfaz; se guarda localmente en el navegador.

**Limitación:** Vercel entrega tu frontend mediante HTTPS. Si la API de AWS solo atiende por HTTP, el navegador bloqueará `fetch()` (mixed content). Para que funcione desde Vercel, usa HTTPS en AWS o configura un rewrite/proxy adecuado en Vercel y cambia la URL de la interfaz a `/api/personas`.

## En una etapa posterior: rewrites

Cuando se configure el proxy, la app no necesita cambios de código: basta con introducir `/api/personas` como URL del endpoint. No hay rewrites configurados en esta entrega.
