import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, response: NextResponse) {
    // Guard: skip Supabase session refresh if env vars are not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
        // Return the response unchanged — auth won't work but the app won't crash
        return response
    }

    const supabase = createServerClient(
        supabaseUrl,
        supabaseKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // This will refresh session if expired
    const { data: { user } } = await supabase.auth.getUser()

    // Protect dashboard routes
    // i18n paths format: /tr/dashboard, /en/cv, etc.
    const isProtected = /\/(tr|en)\/(dashboard|cv|cover-letter|profile|jobs)/.test(request.nextUrl.pathname);

    if (isProtected && !user) {
        const locale = request.nextUrl.pathname.startsWith('/en') ? 'en' : 'tr';
        const redirectUrl = new URL(`/${locale}/login`, request.url);
        
        // We return the redirect. If we modified cookies above, we need to pass them to the new response.
        const res = NextResponse.redirect(redirectUrl);
        // Copy cookies from original response
        response.cookies.getAll().forEach((cookie) => {
            res.cookies.set(cookie.name, cookie.value, cookie);
        });
        return res;
    }

    return response
}
