# Despliegue en IONOS (único método)

## No uses Netlify CLI

**No ejecutes** `netlify deploy`, `netlify deploy --prod`, ni enlaces el dominio a Netlify.

Ese flujo construye en la nube **sin tu `.env` local** → Supabase roto (`Invalid supabaseUrl`), sitio viejo cacheado, y `moneymachine.com.mx` deja de servir lo que subes por SFTP a IONOS.

Tu flujo correcto es el de siempre:

1. `npm run build:ionos` en tu Mac (con `.env`)
2. `scp` de `dist/*` al webspace IONOS

---

## 1. Deshacer Netlify

1. [app.netlify.com](https://app.netlify.com) → tu sitio → **Domain management** → quita `moneymachine.com.mx`.
2. Opcional: **Site configuration → Delete site** si ya no lo quieres.
3. En **IONOS → DNS** del dominio: borra registros que apunten a Netlify (`netlify.com`, `apex-loadbalancer`, etc.).
4. Apunta `moneymachine.com.mx` al **webspace** (A/CNAME que indique IONOS).

Comprueba (puede tardar un rato):

```bash
curl -sI https://moneymachine.com.mx/ | grep -i server
```

Debe decir **Apache** (IONOS), no `Netlify`.

---

## 2. Build local (con `.env`)

```bash
cd /Users/macbook/dev/mmlndgn
npm run build:ionos
```

Falla si falta `VITE_SUPABASE_URL` o `VITE_SUPABASE_ANON_KEY` en `.env`.

---

## 3. Subir a IONOS

**Desde tu Mac** (no dentro de SSH):

```bash
scp -P 22 -r dist/* a1458354@access-5020069089.webspace-host.com:~/
```

Si el document root no es `~/`, usa la ruta que te dé IONOS (p. ej. carpeta del dominio).

El `.htaccess` va incluido en `dist/` (rewrite SPA para Apache).

---

## 4. Supabase

**Site URL:** `https://moneymachine.com.mx`

**Redirect URLs** (con `https://`, no solo el dominio):

- `https://moneymachine.com.mx/auth/callback`
- `https://moneymachine.com.mx/auth/reset-password`
- `https://moneymachine.com.mx/**`
- Si usas `food.moneymachine.com.mx`, añade las mismas rutas con ese host.

**CORS:** `https://moneymachine.com.mx`, `http://localhost:5173`

---

## 5. Google Analytics / GTM

Lo que ya tenías (GTM en el HTML, inject en panel, etc.) **no lo reemplaza Netlify**.

Tras subir `dist/` a IONOS, tu `index.html` en producción es el del build local (incluye la etiqueta que está en el repo). Si antes GTM vivía solo en Netlify, vuelve a ponerlo en `index.html` o en el panel de IONOS — no en Netlify.

---

## Resumen

| Mal (Netlify CLI) | Bien (IONOS) |
|-------------------|--------------|
| Build sin `.env` | `npm run build:ionos` con `.env` |
| Dominio en Netlify | DNS → IONOS + `scp` |
| Cache / deploy ajeno | Tú subes `dist/` |
