# Guía de Integración: GardenAds + Stripe

Esta guía explica cómo transformar una tienda estándar con Stripe en una máquina de atribución inteligente usando **GardenAds**.

---

## Los 3 Pilares de la Integración

Para que GardenAds funcione, necesitamos que la información del anuncio (fclip/gclip) viaje desde el clic inicial hasta la confirmación de pago de Stripe.

### 1. El Embebido (Captura en el Frontend)

El primer paso es colocar el script de GardenAds en el `<head>` de tu sitio web. Este script se encarga de "chismosear" la URL y guardar los datos en el navegador del cliente.

**Lo que hace:** Detecta parámetros como `utm_source`, `fclip`, `gclip`, etc., y los guarda en el `localStorage`. Además, **inyecta automáticamente** los datos necesarios en cualquier formulario que encuentre en la página.

```html
<!-- Pegar en el <head> -->
<script>
  (function (w, d, s, u, k) {
    // CONFIGURACIÓN (Viene de tus variables de entorno)
    var gardenUrl = "TU_GARDEN_ADS_URL";
    var apiKey = "TU_PROJECT_ID";
    var expiryDays = 7;

    // 1. Captura inmediata de parámetros
    try {
      var urlParams = new URLSearchParams(w.location.search);
      var attrData = {};
      var params = [
        "fclip",
        "gclip",
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
      ];
      var hasData = false;
      params.forEach(function (p) {
        var val = urlParams.get(p);
        if (val) {
          attrData[p] = val;
          hasData = true;
        }
      });

      if (hasData) {
        var payload = JSON.stringify({
          params: attrData,
          expiry: Date.now() + expiryDays * 24 * 60 * 60 * 1000,
        });
        localStorage.setItem("_ga_attribution", payload);

        // --- Inyección Automática ---
        function inject() {
          var forms = d.querySelectorAll("form");
          var visitorId = localStorage.getItem("_a_vid") || "";
          forms.forEach(function (f) {
            // 1. Atribución (UTMs, etc)
            var attrInput = f.querySelector('input[name="attributionData"]');
            if (!attrInput) {
              attrInput = d.createElement("input");
              attrInput.type = "hidden";
              attrInput.name = "attributionData";
              f.appendChild(attrInput);
            }
            attrInput.value = payload;

            // 2. ID de Visitante (external_session_id)
            var vidInput = f.querySelector('input[name="externalClientId"]');
            if (!vidInput) {
              vidInput = d.createElement("input");
              vidInput.type = "hidden";
              vidInput.name = "externalClientId";
              f.appendChild(vidInput);
            }
            if (visitorId) vidInput.value = visitorId;

            // 3. Project ID (Automático desde la config del script)
            var projInput = f.querySelector('input[name="projectId"]');
            if (!projInput) {
              projInput = d.createElement("input");
              projInput.type = "hidden";
              projInput.name = "projectId";
              f.appendChild(projInput);
            }
            projInput.value = apiKey;
          });
        }
        inject();
        setInterval(inject, 2000); // Mantiene los datos frescos si el DOM cambia
      }
    } catch (e) {}

    // 2. Cargador del Pixel de GardenAds
    w["_aq"] = w["_aq"] || [];
    w["_ak"] = apiKey;
    w["_au"] = gardenUrl;
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s);
    j.async = true;
    j.src = gardenUrl + "/pixel.js";
    f.parentNode.insertBefore(j, f);
  })(window, document, "script");
</script>
```

---

### 2. Persistencia Automática

Nuestro script inteligente detecta automáticamente cualquier formulario de compra en tu página e inyecta la información de atribución, el ID del visitante y el ID del proyecto. **No necesitas crear estos inputs manualmente**, pero si quieres enviar datos extra como el nombre del producto, puedes hacerlo así:

```html
<form action="/api/checkout" method="POST">
  <!-- Opcional: Para saber qué se vendió -->
  <input type="hidden" name="productName" value="Nombre del Producto" />
  <button type="submit">Comprar</button>
</form>
```

---

### 3. Configuración del Servidor

Cuando tu servidor reciba el formulario, solo debes capturar los campos inyectados y pasárselos a Stripe.

**Ejemplo en Next.js (App Router):**

```javascript
// 1. Captura los datos (inyectados automáticamente + tus manuales)
const formData = await request.formData();
const attributionData = formData.get("attributionData");
const externalClientId = formData.get("externalClientId");
const projectId = formData.get("projectId") || process.env.GARDEN_ADS_KEY;
const productName = formData.get("productName") || "Producto Desconocido";

// 2. Pásalo a Stripe (Esencial para el ROI en GardenAds)
const session = await stripe.checkout.sessions.create({
  // ... campos estándar ...
  payment_intent_data: {
    metadata: {
      attribution: attributionData,
      project_id: projectId,
      external_session_id: externalClientId,
      product_name: productName,
    },
  },
  metadata: {
    attribution: attributionData,
    project_id: projectId,
    external_session_id: externalClientId,
    product_name: productName,
  },
});
```

---

### 3. El Cierre del Círculo (Webhooks)

Para que GardenAds registre la venta automáticamente, debes configurar un Webhook en tu Dashboard de Stripe.

1.  Ve a **Stripe Dashboard > Developers > Webhooks**.
2.  Añade un endpoint con la URL de GardenAds: `https://garden-ads.com/api/webhook/stripe`.
3.  Selecciona el evento: `checkout.session.completed`.
4.  Copia el **Signing Secret** (`whsec_...`) y pégalo en tu panel de configuración de **GardenAds**.

---

## Resumen para el Usuario

1.  **Instala el script** en tu cabecera.
2.  **Modifica tu API** de Stripe para incluir `metadata`.
3.  **Configura el Webhook** en Stripe apuntando a GardenAds.

¡Listo! GardenAds ahora puede decirte exactamente qué anuncio de Facebook o Google generó cada dólar en tu cuenta de Stripe.
