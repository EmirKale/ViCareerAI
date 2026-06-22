import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LetterHistoryClient from "@/components/dashboard/LetterHistoryClient";

export default async function CoverLetterHistoryPage() {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/login");
    }

    // Fetch Cover Letters
    const { data: letters } = await supabase
        .from("cover_letters")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

    return <LetterHistoryClient initialLetters={letters || []} />;
}
