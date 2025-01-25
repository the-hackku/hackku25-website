import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-row items-center justify-center bg-gray-100 p-8">
      <Link href="/legal/waiver" className="text-blue-500 hover:underline">
        Photo Release & Waiver
      </Link>
      <span className="mx-4">|</span>
      <Link
        href="/legal/code-of-conduct"
        className="text-blue-500 hover:underline"
      >
        Code of Conduct
      </Link>
    </div>
  );
}
