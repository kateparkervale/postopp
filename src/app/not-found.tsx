import Link from "next/link";

export const metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#1a1a2e] text-white">
      <div className="text-center max-w-md">
        <p className="text-6xl mb-4" aria-hidden="true">
          🔍
        </p>
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-lg text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 rounded-2xl text-lg font-bold text-white transition-transform active:scale-95 focus:outline-none focus:ring-3 focus:ring-white"
          style={{ backgroundColor: "#e8913a" }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
