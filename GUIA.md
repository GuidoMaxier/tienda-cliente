# Guía de Integración: GardenAds + Stripe

Esta guía explica cómo transformar una tienda estándar con Stripe en una máquina de atribución inteligente usando **GardenAds**.

---

## Los 3 Pilares de la Integración

Para que GardenAds funcione, necesitamos que la información del anuncio (fclip/gclip) viaje desde el clic inicial hasta la confirmación de pago de Stripe.

### 1. El Embebido (Captura en el Frontend)

El primer paso es colocar el script de GardenAds en el `<head>` de tu sitio web. Este script se encarga de "chismosear" la URL y guardar los datos en el navegador del cliente.

**Lo que hace:** Detecta parámetros como `utm_source`, `fclip`, `gclip`, etc., y los guarda en el `localStorage` con una validez (ej. 7 días).

```html
<!-- Pegar en el <head> -->
<script>
  (function (w, d, s, u, k) {
    // CONFIGURACIÓN
    var gardenUrl = "https://garden-ads.com";
    var apiKey = "TU_PROJECT_ID";
    var expiryDays = 7; // Días que durará el rastro del anuncio

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

        // Inyección automática en formularios
        function inject() {
          var forms = d.querySelectorAll("form");
          forms.forEach(function (f) {
            if (!f.querySelector('input[name="attributionData"]')) {
              var i = d.createElement("input");
              i.type = "hidden";
              i.name = "attributionData";
              i.value = payload;
              f.appendChild(i);
            }
          });
        }
        inject();
        setInterval(inject, 2000);
      }
    } catch (e) {}

    // 2. Cargador del Pixel
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

### 2. Persistencia Automática (Sin Código en el Formulario)

Nuestro script inteligente detecta automáticamente cualquier formulario de compra en tu página e inyecta la información de atribución. **No necesitas modificar tu HTML ni agregar inputs manualmente.**

---

### 3. Configuración del Servidor (El Único Paso de Código)

Cuando tu servidor reciba el formulario de compra, solo debes asegurarte de capturar el campo `attributionData` y pasárselo a Stripe en el objeto `metadata`.

**Ejemplo en Node.js / Next.js:**

```javascript
// 1. Captura los datos del formulario (inyectados automáticamente)
const formData = await request.formData();
const attributionData = formData.get("attributionData");
const externalClientId = formData.get("externalClientId");

// 2. Pásalo a Stripe (Esto es vital para GardenAds)
const session = await stripe.checkout.sessions.create({
  // ... tus otros campos (mode, line_items, etc.) ...
  payment_intent_data: {
    metadata: {
      attribution: attributionData,
      project_id: "TU_PROJECT_ID",
      external_session_id: externalClientId,
    },
  },
  metadata: {
    attribution: attributionData,
    project_id: "TU_PROJECT_ID",
    external_session_id: externalClientId,
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
