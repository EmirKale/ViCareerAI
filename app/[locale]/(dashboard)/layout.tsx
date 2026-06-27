import { Metadata } from 'next';
import Sidebar from "@/components/layout/Sidebar";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Sidebar>{children}</Sidebar>;
}
