import crypto from 'node:crypto';
import { NextResponse } from 'next/server';
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';
    
    // LemonSqueezy sends the signature in the 'x-signature' header
    const signature = request.headers.get('x-signature') ?? '';

    // Verify the signature
    const hmac = crypto.createHmac('sha256', secret);
    const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta.event_name;
    const customData = payload.meta.custom_data || {};
    const obj = payload.data.attributes;

    const supabaseAdmin = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            cookies: {
                getAll() { return [] },
                setAll() { /* IGNORE */ },
            },
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    const userId = customData.userId; // We will pass this in create-checkout

    switch (eventName) {
      case 'order_created': {
        console.info('Order created event received');
        // e.g. a one-time purchase
        const customerId = String(obj.customer_id);
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
                lemonsqueezy_customer_id: customerId,
                subscription_status: "active",
                plan: "pro", // Adjust based on variant ID if needed
            })
            .eq("id", userId);
        }
        break;
      }
      case 'subscription_created': {
        console.info('Subscription created event received');
        const customerId = String(obj.customer_id);
        if (userId) {
          await supabaseAdmin
            .from("profiles")
            .update({
                lemonsqueezy_customer_id: customerId,
                subscription_status: obj.status,
                plan: "pro", 
            })
            .eq("id", userId);
        }
        break;
      }
      case 'subscription_updated': {
        console.info('Subscription updated event received. Status:', obj.status);
        const customerId = String(obj.customer_id);
        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_status: obj.status,
                plan: obj.status === "active" ? "pro" : "free",
            })
            .eq("lemonsqueezy_customer_id", customerId);
        break;
      }
      case 'subscription_expired':
      case 'subscription_cancelled': {
        console.info('Subscription expired/cancelled event received');
        const customerId = String(obj.customer_id);
        await supabaseAdmin
            .from("profiles")
            .update({
                subscription_status: "canceled",
                plan: "free",
            })
            .eq("lemonsqueezy_customer_id", customerId);
        break;
      }
      default:
        console.info(`Unhandled event type: ${eventName}`);
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Webhook error' }, { status: 500 });
  }
}

