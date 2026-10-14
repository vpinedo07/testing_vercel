"use strict";

const DEFAULT_API_URL = "/api/personas";
const STORAGE_KEY = "aws-personas-api-url";

const form = document.querySelector("#api-form");
const urlInput = document.querySelector("#api-url");
const loadButton = document.querySelector("#load-btn");
const buttonText = document.querySelector("#button-text");
const refreshButton = document.querySelector("#refresh-btn");
const notice = document.querySelector("#notice");
const tableWrap = document.querySelector("#table-wrap");
const tbody = document.querySelector("#people-body");
const recordCount = document.querySelector("#record-count");
const httpStatus = document.querySelector("#http-status");
const lastUpdate = document.querySelector("#last-update");
const caption = document.querySelector("#results-caption");

urlInput.value = DEFAULT_API_URL;
localStorage.removeItem(STORAGE_KEY); // Elimina la URL HTTP anterior guardada.

function showNotice(message, kind = "") {
  notice.textContent = message;
  notice.className = `notice ${kind}`.trim();
  notice.hidden = false;
}

function addCell(row, text) {
  const cell = document.createElement("td");
  cell.textContent = text == null ? "—" : String(text);
  row.appendChild(cell);
}

function renderPeople(people) {
  tbody.replaceChildren();
  for (const person of people) {
    const row = document.createElement("tr");
    addCell(row, person.id);
    addCell(row, person.nombre);
    addCell(row, person.edad);
    addCell(row, person.ciudad);
    addCell(row, person.correo);
    tbody.appendChild(row);
  }
  tableWrap.hidden = people.length === 0;
  recordCount.textContent = String(people.length);
  caption.textContent = `${people.length} registro(s) recibidos desde la API.`;
  showNotice(people.length ? "Consulta realizada correctamente." : "La API respondió correctamente, pero no hay personas registradas.", "success");
}

function makeUrl(raw) {
  const value = raw.trim();
  if (value.startsWith("/")) return value;
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Solo se permiten URLs HTTP o HTTPS.");
  return parsed.toString();
}

async function loadPeople() {
  let url;
  try {
    url = makeUrl(urlInput.value);
    if (url.includes("TU-IP-PUBLICA")) throw new Error("Sustituye TU-IP-PUBLICA por la IPv4 pública real de tu EC2.");
  } catch (error) {
    showNotice(error.message || "Introduce una URL válida.", "error");
    return;
  }

  // No guardamos URLs antiguas: el proxy es la opción predeterminada.
  loadButton.disabled = true;
  refreshButton.disabled = true;
  buttonText.textContent = "Consultando…";
  showNotice("Conectando con el servidor AWS…");
  httpStatus.textContent = "…";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store"
    });
    httpStatus.textContent = String(response.status);
    if (!response.ok) throw new Error(`El servidor respondió HTTP ${response.status} ${response.statusText}.`);

    const payload = await response.json();
    // Acepta la respuesta definida en main.py: { total: 3, datos: [...] }
    // También acepta un arreglo directo de personas.
    const people = Array.isArray(payload) ? payload : payload?.datos;
    if (!Array.isArray(people)) throw new Error("El JSON recibido no contiene un arreglo 'datos' válido.");

    renderPeople(people);
    lastUpdate.textContent = new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  } catch (error) {
    tableWrap.hidden = true;
    tbody.replaceChildren();
    recordCount.textContent = "—";
    caption.textContent = "No fue posible cargar los registros.";
    const mixedContent = location.protocol === "https:" && /^http:\/\//i.test(url);
    const detail = mixedContent
      ? "La página usa HTTPS, pero la API usa HTTP. El navegador bloquea esta solicitud. Necesitas HTTPS en la API o configurar los rewrites de Vercel."
      : `No se pudo obtener la información: ${error.message}. Comprueba la IP, puerto 8000, firewall, disponibilidad del servidor y CORS.`;
    showNotice(detail, "error");
    if (httpStatus.textContent === "…") httpStatus.textContent = "Sin respuesta";
  } finally {
    loadButton.disabled = false;
    refreshButton.disabled = false;
    buttonText.textContent = "Consultar personas";
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  loadPeople();
});
refreshButton.addEventListener("click", loadPeople);
