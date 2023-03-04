import { createBrowserRouter } from "react-router-dom";
import App from "./components/app/App";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/settings",
        element: <div>Settings</div>
    }
]);