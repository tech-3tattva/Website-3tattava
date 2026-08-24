import { AdminFeedbackProvider } from "@/components/admin/AdminToast";
import { ADMIN_TOKENS } from "@/components/admin/adminTokens";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // `ad-scope` carries the shared tokens, so panels inherit one card shape,
    // colour set and type scale instead of each redeclaring their own.
    <div className="ad-scope" style={{ minHeight: "100vh", background: "#f7f0e2" }}>
      <style dangerouslySetInnerHTML={{ __html: ADMIN_TOKENS }} />
      <AdminFeedbackProvider>{children}</AdminFeedbackProvider>
    </div>
  );
}
