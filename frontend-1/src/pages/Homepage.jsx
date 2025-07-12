import { Link } from "react-router";

function Homepage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl w-full">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">
          Welcome to TodoList 📝
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Stay organized and boost your productivity by keeping track of your
          tasks.
        </p>

        <div className="flex justify-center gap-4">
          <Link
            to="/register"
            className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 border border-blue-500 text-blue-500 rounded-xl hover:bg-blue-50 transition"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Homepage;
