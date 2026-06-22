import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CVHistoryClient from "@/components/dashboard/CVHistoryClient";

export default async function CVHistoryPage() {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/login");
    }

    // Fetch CVs
    const { data: cvs } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    return <CVHistoryClient initialCvs={cvs || []} />;
}
