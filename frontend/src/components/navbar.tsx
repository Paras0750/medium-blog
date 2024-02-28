export const Navbar = () => {
  return (
    <nav>
      <ul className="flex gap-4 py-3">
        <li className="border py-1 px-2">
          <a href="/">Home</a>
        </li>
        <li className="border py-1 px-2">
          <a href="/signup">Signup</a>
        </li>
        <li className="border py-1 px-2">
          <a href="/signin">Signin</a>
        </li>
        <li className="border py-1 px-2">
          <a href="/upload-blog">Upload Blog</a>
        </li>
      </ul>
    </nav>
  );
};
