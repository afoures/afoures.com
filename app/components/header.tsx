import { Link } from "@remix-run/react";

export function Header() {
  return (
    <header className="pt-6 pb-4">
      <nav className="space-x-8">
        <Link
          className="text-purple-500 text-xl font-semibold"
          to="/"
        >
          afoures.com
        </Link>
      </nav>
    </header>
  );
}

