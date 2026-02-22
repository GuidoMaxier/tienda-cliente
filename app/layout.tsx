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
                var gardenUrl = '${process.env.NEXT_PUBLIC_GARDEN_ADS_URL || "http://localhost:3000"}';
                var apiKey = '${process.env.NEXT_PUBLIC_GARDEN_ADS_KEY || "56065e6a5decce35b0dbc78cc980c48fd33b661eca644cfce6a10b2507335010"}';
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
                    
                    // --- Inyección Automática ---
                    function inject() {
                      var forms = d.querySelectorAll('form');
                      var visitorId = localStorage.getItem('_a_vid') || '';
                      forms.forEach(function(f) {
                        // Inyectar Datos de Atribución (UTMs, GCLIP, etc)
                        if (!f.querySelector('input[name="attributionData"]')) {
                          var i = d.createElement('input');
                          i.type = 'hidden'; i.name = 'attributionData'; i.value = payload;
                          f.appendChild(i);
                        }
                        // Inyectar ID de Visitante (external_session_id)
                        if (!f.querySelector('input[name="externalClientId"]')) {
                          var i2 = d.createElement('input');
                          i2.type = 'hidden'; i2.name = 'externalClientId'; i2.value = visitorId;
                          f.appendChild(i2);
                        }
                      });
                    }
                    inject();
                    setInterval(inject, 2000);
                  }
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
