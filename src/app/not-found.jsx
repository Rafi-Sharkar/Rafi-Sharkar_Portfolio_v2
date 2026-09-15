import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-950 text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-full font-semibold bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30 hover:bg-accent-cyan/20 transition-all duration-300 inline-block"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
