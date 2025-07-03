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
import { useAppStore } from "./store";
import { SocketProvider } from "./context/SocketContext";
const PrivateRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? children : <Navigate to="/auth" />;
};
const AuthRoute = ({ children }) => {
    const { userInfo } = useAppStore();
    const isAuthenticated = !!userInfo;
    return isAuthenticated ? <Navigate to="/chat" /> : children;
};

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<App />}>
                <Route
                    path=""
                    element={
                        <AuthRoute>
                            <Auth />
                        </AuthRoute>
                    }
                />
                <Route
                    path="auth"
                    element={
                        <AuthRoute>
                            <Auth />
                        </AuthRoute>
                    }
                />
                <Route
                    path="profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="chat"
                    element={
                        <PrivateRoute>
                            <Chat />
                        </PrivateRoute>
                    }
                />
            </Route>
            <Route path="*" element={<Navigate to="/auth" replace />} />
        </>
    )
);

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <SocketProvider>
        <RouterProvider router={router} />
        <Toaster closeButton />
    </SocketProvider>
    // </StrictMode>
);
