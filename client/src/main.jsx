import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AuthProvider from "./Providers/AuthProvider.jsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Main from "./Layouts/Main.jsx";
import SignUpPage from "./Pages/SignUpPage.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import ProfilePage from "./Pages/ProfilePage.jsx";

const queryClient = new QueryClient();
const user = null; // Example for testing. Replace with actual user logic.

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Wrap Routes in BrowserRouter */}
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={user ? <Main /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/signup"
              element={!user ? <SignUpPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/profile"
              element={
                user ? <ProfilePage /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
