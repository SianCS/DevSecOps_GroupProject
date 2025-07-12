import { NavLink } from "react-router";

function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl font-bold">My Todolist</div>
        <div className="space-x-4">
          <NavLink
            to="/"
            className="text-white hover:text-blue-200 transition duration-200"
          >
            Home
          </NavLink>
          <NavLink
            to="/login"
            className="text-white hover:text-blue-200 transition duration-200"
          >
            Login
          </NavLink>
          <NavLink
            to="/register"
            className="text-white hover:text-blue-200 transition duration-200"
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
