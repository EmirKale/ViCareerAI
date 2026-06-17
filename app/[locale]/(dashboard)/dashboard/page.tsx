import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function DashboardPage() {
    const supabase = await createClient();
    
    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
        redirect("/login");
    }

    // Fetch data in parallel
    const [profileRes, quotaRes, cvsRes, jobsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).single(),
        supabase.from("quota").select("*").eq("user_id", user.id).single(),
        supabase.from("cvs").select("id, title, updated_at").eq("user_id", user.id).order('updated_at', { ascending: false }),
        supabase.from("jobs_tracker").select("id, status").eq("user_id", user.id)
    ]);

    const profileData = profileRes.data || null;
    const quotaData = quotaRes.data || null;
    const cvData = cvsRes.data || [];
    const jobsData = jobsRes.data || [];

    return (
        <DashboardClient 
            profileData={profileData} 
            quotaData={quotaData} 
            cvData={cvData} 
            jobsData={jobsData} 
        />
    );
}
