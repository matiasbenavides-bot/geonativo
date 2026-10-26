# GeoNativo — Piedras y minerales de colección

Sitio estático de venta de minerales. Sin backend, sin base de datos, sin costo
mensual. Se abre con doble clic o se sirve desde cualquier hosting de archivos.

## Qué es

Catálogo de piezas únicas con ficha técnica: peso, tamaño aproximado, origen
declarado y precio. Cada pieza se vende por WhatsApp; no hay carrito ni pasarela.

El principio del sitio: **el precio no es la piedra, es la historia.** De cada
pieza se declara qué se sabe y qué no. Cuando el origen no se puede acreditar,
la ficha dice «no documentado» y el precio lo considera.

## Estructura

```
index.html                      todo el contenido del sitio
assets/css/main.css             sistema visual completo (tokens + componentes)
assets/js/main.js               menú, reveal, WhatsApp
assets/img/minerales/           fotos de las piezas
```

`index.html` es la única página. Los datos de cada pieza (peso, tamaño, origen,
precio) están **en el HTML**, dentro de cada tarjeta `<article class="especie">`.

## Cómo se cambia algo

**Precio de una pieza:** buscar el nombre de la especie y editar
`<span class="especie__precio">$7.500</span>`.

**Peso / tamaño / origen:** editar el `<dl class="especie__datos">` de esa tarjeta.
El origen chileno lleva `class="origen-cl"` (azul); el no documentado,
`class="origen-d"` (gris).

**Número de WhatsApp:** en `assets/js/main.js`, una sola línea:

```js
whatsapp: '56935078422',
```

Los 8 botones del sitio se regeneran solos desde ahí. Si se deja vacío, los
botones se desactivan y avisan en vez de apuntar a un enlace roto.

**Foto de una pieza:** reemplazar el archivo en `assets/img/minerales/` manteniendo
el nombre. La tarjeta ya apunta a esa ruta.

## Paleta

| Token | Hex | Uso |
|---|---|---|
| `--brand` | `#4da3e8` | Azul de marca: botones, acentos, «Chile» |
| `--linea-a` | `#3f9e7c` | Verde: piezas de rotación |
| `--linea-b` | `#4da3e8` | Azul: patrimonio chileno |
| `--coquimbita-1/2/3` | `#7d4bb8` · `#b07ae0` · `#4a2470` | Morado de la coquimbita |

Contraste verificado sobre fondo `#07080a`: azul de marca 7.37:1, texto sobre
botón azul 6.95:1. Ambos pasan WCAG AA.

## Verificación

El sitio se verificó en navegador real:

- 0 errores de consola, 0 recursos fallidos
- 0 desborde horizontal a 1440 px y 380 px
- Etiquetas HTML balanceadas, llaves CSS balanceadas
- 8/8 botones de WhatsApp con el número correcto y mensaje por pieza
- Las 4 fotos cargan y cubren su contenedor

## Pendientes conocidos

- Peso y tamaño de **amatista** y **calcopirita**: todavía no las tiene en mano.
- Fotografía de esas dos piezas.
- Las fotos actuales no muestran escala; la barra de confianza ya no promete escala.
