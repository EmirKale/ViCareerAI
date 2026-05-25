import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createCheckout } from "@lemonsqueezy/lemonsqueezy.js";
import { configureLemonSqueezy } from "@/lib/lemonsqueezy";

export async function POST(req: Request) {
    try {
        // 1. Configure LemonSqueezy SDK
        try {
            configureLemonSqueezy();
        } catch (configError: unknown) {
            const configMsg = configError instanceof Error ? configError.message : String(configError);
            console.error("LemonSqueezy Config Error:", configMsg);
            return NextResponse.json(
                { error: `Ödeme sistemi yapılandırılamadı: ${configMsg}` },
                { status: 500 }
            );
        }

        // 2. Authenticate user
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() { return cookieStore.getAll(); },
                    setAll() { /* Ignore */ },
                },
            }
        );

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError) {
            console.error("Supabase Auth Error:", authError.message);
            return NextResponse.json({ error: "Oturum doğrulanamadı." }, { status: 401 });
        }

        if (!user) {
            return NextResponse.json({ error: "Lütfen giriş yapın." }, { status: 401 });
        }

        const userId = user.id;
        const userEmail = user.email || "";

        // 3. Parse request body
        const { variantId } = await req.json();

        if (!variantId) {
            return NextResponse.json({ error: "Variant ID gerekli." }, { status: 400 });
        }

        // 4. Check required env vars
        const storeId = process.env.LEMONSQUEEZY_STORE_ID;
        if (!storeId) {
            console.error("LEMONSQUEEZY_STORE_ID is not defined in environment.");
            return NextResponse.json({ error: "Ödeme sistemi yapılandırması eksik." }, { status: 500 });
        }

        // 5. Determine redirect URL
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        console.log("[Checkout] Creating checkout for user:", userId, "email:", userEmail, "variantId:", variantId, "storeId:", storeId);

        // 6. Create checkout session
        const { data: checkout, error: checkoutError } = await createCheckout(storeId, variantId, {
            checkoutOptions: {
                embed: false,
                media: false,
                logo: true,
            },
            checkoutData: {
                email: userEmail,
                custom: {
                    userId: userId
                }
            },
            productOptions: {
                redirectUrl: `${appUrl}/tr/dashboard?success=true`,
            },
            testMode: false,
        });

        if (checkoutError) {
            console.error("LemonSqueezy Checkout Error:", JSON.stringify(checkoutError, null, 2));
            const errorMessage = typeof checkoutError === 'object' && checkoutError !== null
                ? JSON.stringify(checkoutError)
                : String(checkoutError);
            return NextResponse.json(
                { error: `Ödeme sayfası oluşturulamadı: ${errorMessage}` },
                { status: 500 }
            );
        }

        if (checkout?.data?.attributes?.url) {
            console.log("[Checkout] Success! URL:", checkout.data.attributes.url);
            return NextResponse.json({ url: checkout.data.attributes.url });
        } else {
            console.error("LemonSqueezy returned no checkout URL. Response:", JSON.stringify(checkout, null, 2));
            return NextResponse.json({ error: "Ödeme bağlantısı alınamadı." }, { status: 500 });
        }

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : "";
        console.error("LemonSqueezy Checkout Route Error:", errorMessage);
        console.error("Stack:", errorStack);
        return NextResponse.json(
            { error: `Sunucu hatası: ${errorMessage}` },
            { status: 500 }
        );
    }
}
