import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import SkillsClient from "./SkillsClient";

export default async function SkillsPage() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        redirect("/login");
    }

    const [profileRes, analysisRes, cvsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("skills_analysis").select("*").eq("user_id", user.id).order('created_at', { ascending: false }).limit(1).single(),
        supabase.from("cvs").select("id, title, updated_at").eq("user_id", user.id).order('updated_at', { ascending: false })
    ]);

    const profileData = profileRes.data || null;
    const analysisData = analysisRes.data || null;
    const cvsData = cvsRes.data || [];

    return (
        <SkillsClient 
            profile={profileData} 
            analysisData={analysisData} 
            cvs={cvsData} 
        />
    );
}
