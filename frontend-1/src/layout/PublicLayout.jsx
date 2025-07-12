import { NavLink, Outlet } from "react-router";
import Navbar from "./Navbar";

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
export default PublicLayout;
