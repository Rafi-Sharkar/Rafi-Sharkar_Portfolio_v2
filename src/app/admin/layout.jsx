// Admin layout: hides the navbar and provides a dark wrapper around admin pages.
export default function AdminLayout({ children }) {
  return <div className="min-h-screen bg-dark-950">{children}</div>;
}