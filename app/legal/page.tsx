import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <ul className="space-y-4 text-lg">
        <li>
          <Link href="/legal/waiver" className="text-blue-500 hover:underline">
            Photo Release & Waiver
          </Link>
        </li>
        <li>
          <Link
            href="/legal/code-of-conduct"
            className="text-blue-500 hover:underline"
          >
            Code of Conduct
          </Link>
        </li>
      </ul>
    </div>
  );
}
