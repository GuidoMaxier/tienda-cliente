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
                    var expiry = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 días
                    var payload = JSON.stringify({ params: attrData, expiry: expiry });
                    localStorage.setItem('_ga_attribution', payload);
                    
                    // --- NUEVO: Inyección Automática ---
                    function inject() {
                      var forms = d.querySelectorAll('form');
                      forms.forEach(function(f) {
                        if (!f.querySelector('input[name="attributionData"]')) {
                          var i = d.createElement('input');
                          i.type = 'hidden'; i.name = 'attributionData'; i.value = payload;
                          f.appendChild(i);
                        }
                      });
                    }
                    inject(); // Ejecutar ahora
                    setInterval(inject, 2000); // Y cada 2 segundos por si hay carga dinámica
                  }
                } catch(e) {}

                // 2. Cargador del Pixel de GardenAds (Reporte)
                w['_aq']=w['_aq']||[];
                w['_ak']=k;
                w['_au']=u;
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s);
                j.async=true;
                j.src=u+'/pixel.js';
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','http://localhost:3000','56065e6a5decce35b0dbc78cc980c48fd33b661eca644cfce6a10b2507335010');
            `,
          }}
        />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
