/* ============================================================
   GeoNativo — comportamiento de la página
   Sin frameworks, sin build. Todo degrada sin JS.
   ============================================================ */
(function () {
  'use strict';

  /* ------------------------------------------------------------
     CONFIGURACIÓN — el único lugar donde se cambia el contacto.
     Poner el número en formato internacional sin + ni espacios:
     Chile: 56912345678
     Mientras esté vacío, los botones de WhatsApp quedan
     desactivados y avisan, en vez de apuntar a un enlace roto.
     ------------------------------------------------------------ */
  var CONFIG = {
    whatsapp: '56935078422',
    mensaje: 'Hola, me interesa una pieza de GeoNativo.'
  };

  var header = document.querySelector('.site-header');
  var nav    = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');

  /* ---- 1. Header compacto al hacer scroll ---- */
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 60);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- 2. Menú móvil ---- */
  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 780) closeNav();
    });
  }

  /* ---- 3. WhatsApp: un solo número, todos los botones ---- */
  var botones = document.querySelectorAll('[data-wa]');
  var numero = (CONFIG.whatsapp || '').replace(/\D/g, '');

  /* Cada botón puede llevar su propio mensaje con data-wa-msg
     (por ejemplo el nombre de la pieza que se está consultando). */
  function mensajeDe(el) {
    var propio = el.getAttribute('data-wa-msg');
    return propio ? propio : CONFIG.mensaje;
  }

  Array.prototype.forEach.call(botones, function (el) {
    if (numero.length >= 11) {
      el.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensajeDe(el));
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      /* Sin número configurado: se avisa. Un botón que apunta a
         wa.me/ sin número PARECE funcionar y no funciona. */
      el.classList.add('is-pendiente');
      el.setAttribute('aria-disabled', 'true');
      el.removeAttribute('href');
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (el.dataset.avisado) return;
        el.dataset.avisado = '1';
        var viejo = el.textContent;
        el.textContent = 'Falta configurar el WhatsApp';
        window.setTimeout(function () { el.textContent = viejo; }, 2600);
      });
    }
  });

  /* ---- 3b. Botones «Consultar esta pieza» ----
     Toman el nombre y el precio de su propia tarjeta, así el
     mensaje llega con la pieza identificada. El artículo va por
     tarjeta porque no todas las especies son femeninas. */
  Array.prototype.forEach.call(document.querySelectorAll('.especie'), function (card) {
    var btn = card.querySelector('.especie__btn');
    if (!btn) return;
    var nombre = card.querySelector('.especie__name');
    var precio = card.querySelector('.especie__precio');
    var pieza = nombre ? nombre.textContent.trim() : '';
    var valor = precio ? precio.textContent.trim() : '';
    var articulo = card.getAttribute('data-articulo') || 'la';
    var texto = 'Hola, me interesa ' + articulo + ' ' + pieza +
                (valor ? ' (' + valor + ')' : '') + '. ¿Está disponible?';
    btn.setAttribute('data-wa', '');
    btn.setAttribute('data-wa-msg', texto);

    if (numero.length >= 11) {
      btn.href = 'https://wa.me/' + numero + '?text=' + encodeURIComponent(texto);
      btn.target = '_blank';
      btn.rel = 'noopener';
    } else {
      btn.classList.add('is-pendiente');
      btn.setAttribute('aria-disabled', 'true');
      btn.removeAttribute('href');
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        if (btn.dataset.avisado) return;
        btn.dataset.avisado = '1';
        var viejo = btn.textContent;
        btn.textContent = 'Falta configurar el WhatsApp';
        window.setTimeout(function () { btn.textContent = viejo; }, 2600);
      });
    }
  });

  /* ---- 4. Reveal al entrar en pantalla ---- */
  var reveals = document.querySelectorAll('.reveal');

  function mostrarTodo() {
    for (var i = 0; i < reveals.length; i++) reveals[i].classList.add('is-visible');
  }

  if (!('IntersectionObserver' in window)) {
    mostrarTodo();
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    for (var j = 0; j < reveals.length; j++) obs.observe(reveals[j]);

    /* Red de seguridad: si algo impide que el observer dispare,
       a los 2,5 s todo queda visible. Una animación nunca puede
       ser lo único que hace visible el contenido. */
    window.setTimeout(function () {
      var pendientes = document.querySelectorAll('.reveal:not(.is-visible)');
      for (var k = 0; k < pendientes.length; k++) pendientes[k].classList.add('is-visible');
    }, 2500);
  }

})();
