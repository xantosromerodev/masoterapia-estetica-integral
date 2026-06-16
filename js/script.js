// ─── CONFIGURACIÓN ─────────────────────────────────────────────
// Pega aquí la URL de tu página de reservas de Happoin.
// La encuentras en tu panel: app.happoin.com/es/TU-NEGOCIO
const HAPPOIN_URL = 'https://app.happoin.com/es/reservar/36140';

// Número de WhatsApp (sin espacios ni +)
const WA_NUMBER = '573027452273';
// ───────────────────────────────────────────────────────────────

function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    // Capturar datos del formulario
    const nombre = form.querySelector('input[type="text"]').value.trim();
    const apellido = form.querySelectorAll('input[type="text"]')[1].value.trim();
    const telefono = form.querySelector('input[type="tel"]').value.trim();
    const servicio = form.querySelector('select').value;
    const nota = form.querySelector('textarea').value.trim();

    // Construir el link de Happoin con datos pre-rellenados
    const params = new URLSearchParams({
        name: `${nombre} ${apellido}`.trim(),
        phone: telefono,
        service: servicio,
        notes: nota,
    });
    const happoinLink = `${HAPPOIN_URL}?${params.toString()}`;

    // Construir el mensaje de WhatsApp como canal alternativo
    const waMsg = encodeURIComponent(
        `Hola Sofia! Quiero agendar una cita.\n` +
        `Nombre: ${nombre} ${apellido}\n` +
        `Servicio: ${servicio}\n` +
        `Tel: ${telefono}`
    );
    const waLink = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

    // Mostrar estado de éxito dentro del formulario
    document.getElementById('form-content').style.display = 'none';
    const successEl = document.getElementById('success-msg');
    successEl.style.display = 'block';

    // Inyectar botones de acción (solo una vez)
    if (!document.getElementById('success-actions')) {
        const actions = document.createElement('div');
        actions.id = 'success-actions';
        actions.style.cssText = 'display:flex;flex-direction:column;gap:0.75rem;margin-top:1.5rem;';

        const btnHappoin = document.createElement('a');
        btnHappoin.href = happoinLink;
        btnHappoin.target = '_blank';
        btnHappoin.rel = 'noopener noreferrer';
        btnHappoin.textContent = 'Elegir fecha y hora →';
        btnHappoin.style.cssText = [
            'display:block',
            'background:var(--rose-dark)',
            'color:white',
            'text-align:center',
            'padding:0.85rem 1.5rem',
            'border-radius:2px',
            'font-size:0.82rem',
            'font-weight:500',
            'letter-spacing:0.1em',
            'text-transform:uppercase',
            'text-decoration:none',
        ].join(';');

        const btnWa = document.createElement('a');
        btnWa.href = waLink;
        btnWa.target = '_blank';
        btnWa.rel = 'noopener noreferrer';
        btnWa.textContent = 'O escríbenos por WhatsApp';
        btnWa.style.cssText = [
            'display:block',
            'text-align:center',
            'padding:0.75rem',
            'font-size:0.8rem',
            'color:var(--rose-dark)',
            'text-decoration:underline',
            'cursor:pointer',
        ].join(';');

        actions.appendChild(btnHappoin);
        actions.appendChild(btnWa);
        successEl.appendChild(actions);
    }

    // Abrir Happoin en nueva pestaña tras 1.8 s (tiempo para leer el éxito)
    setTimeout(() => {
        window.open(happoinLink, '_blank', 'noopener,noreferrer');
    }, 1800);
}