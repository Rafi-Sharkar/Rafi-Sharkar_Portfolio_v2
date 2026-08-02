import Navbar from '@/components/Navbar';

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-dark-950 pt-32 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="section-subtitle">About</p>
          <h1 className="section-title mb-6">Coming Soon</h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            A dedicated about page is in progress. In the meantime, visit the home page for the full overview.
          </p>
        </div>
      </div>
    </>
  );
}