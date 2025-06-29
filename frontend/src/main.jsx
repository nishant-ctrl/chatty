import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Auth, Profile, Chat } from "./pages";
import App from "./App";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
} from "react-router-dom";
import { Navigate, RouterProvider } from "react-router";
import { Toaster } from "./components/ui/sonner.jsx";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />}>
                <Route path="" element={<Auth />} />
                <Route path="auth" element={<Auth />} />
                <Route path="profile" element={<Profile />} />
                <Route path="chat" element={<Chat />} />
            </Route>
            <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
    )
);

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <>
        <RouterProvider router={router} />
        <Toaster closeButton />
    </>
    // </StrictMode>
);
