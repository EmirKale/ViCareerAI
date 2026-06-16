import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Create standard client to verify the user session
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create admin client for deletion
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Delete user data. (If ON DELETE CASCADE is set up, this might be redundant, but it's safe to do)
    await supabaseAdmin.from("cvs").delete().eq("user_id", user.id);
    await supabaseAdmin.from("cover_letters").delete().eq("user_id", user.id);
    await supabaseAdmin.from("jobs").delete().eq("user_id", user.id);
    await supabaseAdmin.from("profiles").delete().eq("id", user.id); // Or user_id depending on schema

    // Delete the user from Auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return NextResponse.json({ error: "Failed to delete user account" }, { status: 500 });
    }

    // Delete cookies to log out locally
    const authCookies = cookieStore.getAll().filter(c => c.name.startsWith("sb-"));
    authCookies.forEach(c => cookieStore.delete(c.name));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
