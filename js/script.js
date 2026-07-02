// ─── CONFIGURACIÓN ─────────────────────────────────────────────
// Pega aquí la URL de tu página de reservas de Happoin.
// La encuentras en tu panel: app.happoin.com/es/TU-NEGOCIO
const HAPPOIN_URL = 'https://app.happoin.com/es/reservar/36141';

// Número de WhatsApp (sin espacios ni +)
const WA_NUMBER = '573027452273';

// Coordenadas del estudio y radio de cobertura por zona (metros)
const MAP_CENTER = [6.185, -75.598];
const MAP_ZOOM = 12;
const COVERAGE_ZONES = [
    { name: 'Itagüí', coords: [6.185, -75.598], color: '#c084fc', radius: 3000 },
    { name: 'Envigado', coords: [6.171, -75.587], color: '#8b5cf6', radius: 3000 },
    { name: 'El Poblado', coords: [6.208, -75.565], color: '#a855f7', radius: 3000 },
    { name: 'Sabaneta', coords: [6.1517, -75.6163], color: '#7c3aed', radius: 3000 },
];
// ───────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    initLeadForm();
    initMap();
});

/**
 * Maneja el envío del formulario de reserva: construye los enlaces
 * de Happoin y WhatsApp con los datos capturados y muestra el estado de éxito.
 */
function initLeadForm() {
    const form = document.getElementById('lead-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        const data = new FormData(form);
        const nombre = (data.get('nombre') || '').trim();
        const apellido = (data.get('apellido') || '').trim();
        const telefono = (data.get('celular') || '').trim();
        const servicio = (data.get('servicio') || '').trim();
        const nota = (data.get('notas') || '').trim();
        const nombreCompleto = `${nombre} ${apellido}`.trim();

        const happoinLink = buildHappoinLink({ nombreCompleto, telefono, servicio, nota });
        const waLink = buildWhatsAppLink({ nombreCompleto, telefono, servicio });

        showSuccessState({ happoinLink, waLink });

        // Abre Happoin en una pestaña nueva tras dar tiempo a leer el mensaje de éxito.
        window.setTimeout(() => {
            window.open(happoinLink, '_blank', 'noopener,noreferrer');
        }, 1800);
    });
}

function buildHappoinLink({ nombreCompleto, telefono, servicio, nota }) {
    const params = new URLSearchParams({
        name: nombreCompleto,
        phone: telefono,
        service: servicio,
        notes: nota,
    });
    return `${HAPPOIN_URL}?${params.toString()}`;
}

function buildWhatsAppLink({ nombreCompleto, telefono, servicio }) {
    const mensaje = encodeURIComponent(
        `Hola Sofia! Quiero agendar una cita.\n` +
        `Nombre: ${nombreCompleto}\n` +
        `Servicio: ${servicio}\n` +
        `Tel: ${telefono}`
    );
    return `https://wa.me/${WA_NUMBER}?text=${mensaje}`;
}

function showSuccessState({ happoinLink, waLink }) {
    const formContent = document.getElementById('form-content');
    const successEl = document.getElementById('success-msg');
    const actions = document.getElementById('success-actions');
    if (!formContent || !successEl || !actions) return;

    formContent.style.display = 'none';
    successEl.style.display = 'block';

    // Evita duplicar los botones si el usuario envía el formulario más de una vez.
    actions.innerHTML = '';

    const btnHappoin = document.createElement('a');
    btnHappoin.href = happoinLink;
    btnHappoin.target = '_blank';
    btnHappoin.rel = 'noopener noreferrer';
    btnHappoin.textContent = 'Elegir fecha y hora →';
    btnHappoin.className = 'form-card__action form-card__action--primary';

    const btnWa = document.createElement('a');
    btnWa.href = waLink;
    btnWa.target = '_blank';
    btnWa.rel = 'noopener noreferrer';
    btnWa.textContent = 'O escríbenos por WhatsApp';
    btnWa.className = 'form-card__action form-card__action--secondary';

    actions.append(btnHappoin, btnWa);

    // Mueve el foco al mensaje de éxito para usuarios de teclado y lectores de pantalla.
    successEl.setAttribute('tabindex', '-1');
    successEl.focus();
}

/**
 * Inicializa el mapa de Leaflet con el estudio y las zonas de cobertura.
 * Se protege con try/catch por si la librería no llega a cargar (p. ej. sin red).
 */
function initMap() {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    try {
        const map = L.map(mapEl).setView(MAP_CENTER, MAP_ZOOM);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap',
        }).addTo(map);

        L.marker(MAP_CENTER).addTo(map).bindPopup('<b>Sofía Villamizar Estética</b>');

        COVERAGE_ZONES.forEach((zone) => {
            L.circle(zone.coords, {
                color: zone.color,
                fillColor: zone.color,
                fillOpacity: 0.25,
                radius: zone.radius,
            })
                .addTo(map)
                .bindPopup(`Cobertura ${zone.name}`);
        });
    } catch (error) {
        console.error('No se pudo inicializar el mapa:', error);
    }
}