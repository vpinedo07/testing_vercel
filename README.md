# Cliente API AWS — Vercel con proxy inverso

## Preparación
1. Abrir `vercel.json` y reemplazar `TU-IP-PUBLICA` por la IP pública real de la instancia EC2.
2. Confirmar que la API FastAPI responde desde Internet en `http://IP:8000/api/personas` y que las reglas de AWS Security Group y Windows Firewall permiten la conexión.
3. Subir los archivos `index.html`, `styles.css`, `app.js` y `vercel.json` a la raíz del proyecto de GitHub conectado con Vercel.
4. Esperar a que finalice el despliegue y visitar `https://TU-PROYECTO.vercel.app/api/personas`. Debe devolver JSON.
5. Abrir la página principal y pulsar Consultar personas con la ruta `/api/personas`.

## Cómo funciona
El navegador hace `fetch('/api/personas')` con HTTPS a Vercel. Vercel reenvía al origen HTTP de AWS según `vercel.json`. El navegador no llama directamente a HTTP, evitando el bloqueo por contenido mixto. Como el tráfico Vercel → AWS no está cifrado, el diseño es sólo para datos ficticios de prueba; configura HTTPS en el backend para producción.

## Importante
- Si no reemplazas `TU-IP-PUBLICA`, el despliegue no tendrá un destino real.
- Si Vercel devuelve 502/504, verifica accesibilidad de EC2 desde fuera de tu IP, conectividad y aplicación escuchando en `0.0.0.0:8000`.
- Si usas IP pública dinámica, ésta puede cambiar al detener/arrancar EC2. Para una dirección estable, evalúa una Elastic IP.
- El proxy no protege por sí solo el acceso directo al puerto 8000 de AWS.
