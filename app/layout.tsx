import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stripe Checkout Sample",
  description: "One-time payment with Stripe Checkout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css?family=Raleway&display=swap"
          rel="stylesheet"
        />
        {/* Embebido de GardenAds */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,u,k){
                var gardenUrl = '${process.env.GARDEN_ADS_URL}';
                var apiKey = '${process.env.GARDEN_ADS_KEY}';
                var expiryDays = 7;

                // 1. Captura inmediata de parámetros (Atribución)
                try {
                  var urlParams = new URLSearchParams(w.location.search);
                  var attrData = {};
                  var params = ['fclip', 'gclip', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content'];
                  var hasData = false;
                  params.forEach(function(p) {
                    var val = urlParams.get(p);
                    if (val) { attrData[p] = val; hasData = true; }
                  });
                  if (hasData) {
                    var expiry = Date.now() + (expiryDays * 24 * 60 * 60 * 1000);
                    var payload = JSON.stringify({ params: attrData, expiry: expiry });
                    localStorage.setItem('_ga_attribution', payload);
                  }

                  // --- Inyección Automática ---
                  function inject() {
                    var forms = d.querySelectorAll('form');
                    var visitorId = localStorage.getItem('_a_vid') || '';
                    var storedAttr = localStorage.getItem('_ga_attribution') || '';
                    
                    forms.forEach(function(f) {
                      // 1. Atribución
                      if (storedAttr) {
                        var attrInput = f.querySelector('input[name="attributionData"]');
                        if (!attrInput) {
                          attrInput = d.createElement('input');
                          attrInput.type = 'hidden'; attrInput.name = 'attributionData';
                          f.appendChild(attrInput);
                        }
                        attrInput.value = storedAttr;
                      }

                      // 2. ID de Visitante (external_session_id)
                      var vidInput = f.querySelector('input[name="externalClientId"]');
                      if (!vidInput) {
                        vidInput = d.createElement('input');
                        vidInput.type = 'hidden'; vidInput.name = 'externalClientId';
                        f.appendChild(vidInput);
                      }
                      if (visitorId) {
                        vidInput.value = visitorId;
                      }

                      // 3. Project ID
                      var projInput = f.querySelector('input[name="projectId"]');
                      if (!projInput) {
                        projInput = d.createElement('input');
                        projInput.type = 'hidden'; projInput.name = 'projectId';
                        f.appendChild(projInput);
                      }
                      projInput.value = apiKey;
                    });
                  }
                  
                  // Ejecutar inmediatamente y con un intervalo más corto al principio
                  inject();
                  var injectInterval = setInterval(inject, 500);
                  // Limpiar el intervalo después de 10 segundos para no saturar, pero mantenerlo si se prefiere
                  setTimeout(function() { clearInterval(injectInterval); setInterval(inject, 3000); }, 10000);
                } catch(e) {}

                // 2. Cargador del Pixel de GardenAds (Reporte)
                w['_aq']=w['_aq']||[];
                w['_ak']=apiKey;
                w['_au']=gardenUrl;
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s);
                j.async=true;
                j.src=gardenUrl+'/pixel.js';
                f.parentNode.insertBefore(j,f);
              })(window,document,'script');
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
