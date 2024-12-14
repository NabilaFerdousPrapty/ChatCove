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
import UseAuth from "./hooks/UseAuth/UseAuth"; 
import { Comment } from "react-loader-spinner";
import UseAdmin from "./hooks/UseAdmin/UseAdmin.jsx";
import Dashboard from "./Layouts/Dashboard.jsx";
const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user,loading } = UseAuth();
  const [isAdmin, isAdminLoading] = UseAdmin();
  if(loading){
    return (
      <div className="flex items-center justify-center h-screen">
        <Comment
          visible={true}
          height="80"
          width="80"
          ariaLabel="comment-loading"
          wrapperStyle={{}}
          wrapperClass="comment-wrapper"
          color="#fff"
          backgroundColor="#87CEEB"
        />
      </div>
    );
  }
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
       path="/dashboard"
        element={(isAdmin && !isAdminLoading) ? <Dashboard /> : <Navigate to="/login" replace />}
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
 
    <App />

);
