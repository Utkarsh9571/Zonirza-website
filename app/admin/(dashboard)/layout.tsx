import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminSessionGuard } from '@/components/admin/AdminSessionGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0a09] text-brand-text dark:text-brand-text/90 transition-colors duration-500">
      <AdminSessionGuard>
        {/* Sidebar - Fixed */}
        <AdminSidebar />

        {/* Main Content Area */}
        <div className="pl-72 flex flex-col min-h-screen">
          {/* Dynamic Content */}
          <main className="flex-1 p-8 lg:p-12 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </AdminSessionGuard>
    </div>
  );
}
