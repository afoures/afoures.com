export function Footer() {
  return (
    <footer className="pb-6 text-center text-gray-400">
      <span className="italic">@{new Date().getFullYear()}</span>
      {" - "}
      <nav className="inline-block space-x-3">
        <a className="hover:text-purple-500" href="mailto:contact@afoures.com">
          contact@afoures.com
        </a>
      </nav>
      {" - "}
      <nav className="inline-block space-x-3">
        <a className="hover:text-purple-500" href="https://github.com/afoures">
          GitHub
        </a>
        <a
          className="hover:text-purple-500"
          href="https://linkedin.com/in/afoures"
        >
          Linkedin
        </a>
      </nav>
    </footer>
  );
}
