import AdminDashboard from '@/components/AdminDashboard';
import RequireAdmin from '@/components/RequireAdmin';

export default function Page() {
  return (
    <RequireAdmin>
      <AdminDashboard />
    </RequireAdmin>
  );
}