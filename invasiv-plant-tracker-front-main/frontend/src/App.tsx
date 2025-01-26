import "leaflet/dist/leaflet.css";
import { Map } from "./components/Map";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  Outlet
} from "react-router-dom";
import { CameraCapture } from "./components/CameraCpture";
import { UploadImage } from "./components/UploadImage";
import { Navigation } from "./components/Navigation";

const Layout = () => {
  return (
    <>
      <Outlet />
      <Navigation />
    </>
  );
};

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        element: <CameraCapture />,
        path: "/capture_photo",
      },
      {
        path: "/",
        element: <Navigate to="/capture_photo" />,
      },
      {
        path: "/cartographie",
        element: <Map />,
      },
      {
        path: "/upload",
        element: <UploadImage />,
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
