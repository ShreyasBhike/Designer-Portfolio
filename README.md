# Darshana — Designer Portfolio

A responsive designer portfolio built with **HTML5 + CSS3 + Vanilla JavaScript only**.

## Files

- `index.html` — semantic page structure
- `style.css` — responsive styling, hand-drawn visual system and animations
- `script.js` — JSON loader, rendering, interactions and decoration generator
- `test/test-data.json` — all editable portfolio content and decorative shape configuration
- `assets/projects/` — local SVG project mockups
- `assets/avatars/` — local SVG testimonial avatars
- `assets/reference/` — supplied desktop/mobile reference images

## Run locally

Because the portfolio loads JSON with `fetch()`, open it through a local HTTP server instead of directly with `file://`.

### Python

```bash
python -m http.server 8000
```

Then visit:

`http://localhost:8000`

## Strict implementation

No React, Vue, Next.js, Tailwind, Bootstrap, GSAP, jQuery, or frontend component libraries are used.

Decorative stars, bursts, sparkles, arrows and other shapes are configured in `test/test-data.json` and rendered dynamically with vanilla JavaScript/CSS.
