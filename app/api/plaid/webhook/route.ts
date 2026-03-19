import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Plaid webhook received:", body);
    
    // Handle different webhook types
    const webhookType = body.webhook_type;
    
    switch (webhookType) {
      case "TRANSACTIONS":
        console.log("New transactions webhook");
        break;
      case "HISTORICAL_UPDATE":
        console.log("Historical update webhook");
        break;
      case "DEFAULT_UPDATE":
        console.log("Default update webhook");
        break;
      default:
        console.log("Unknown webhook type:", webhookType);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
