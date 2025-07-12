import { Slide, ToastContainer } from "react-toastify";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div>
      <AppRouter />
      <ToastContainer
        position="top-right"
        transition={Slide}
        autoClose={1500}
      />
    </div>
  );
}

export default App;
