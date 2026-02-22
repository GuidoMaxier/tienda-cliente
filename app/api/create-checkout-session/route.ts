import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const quantity = parseInt(formData.get("quantity") as string) || 1;
    const attributionData = formData.get("attributionData") as string || "";

    const domainURL = process.env.DOMAIN || "http://localhost:4242";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pasha Original Edition",
              description: "Exclusive photography print",
              images: ["https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop"],
            },
            unit_amount: 599, // $5.99 en centavos
          },
          quantity: quantity,
        },
      ],
      metadata: {
        attribution: attributionData,
        source: "tienda-cliente-test",
        garden_project_id: "56065e6a5decce35b0dbc78cc980c48fd33b661eca644cfce6a10b2507335010", // El ID que identifica a este cliente en GardenAds
      },
      success_url: `${domainURL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
