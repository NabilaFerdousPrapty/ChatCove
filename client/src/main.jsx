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
import UseAuth from "./hooks/UseAuth/UseAuth"; // Use your custom hook for accessing context

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user } = UseAuth(); // Use Auth Context inside this component
  return (
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
        element={user ? <ProfilePage /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
