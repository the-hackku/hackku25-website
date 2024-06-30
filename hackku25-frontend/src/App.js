import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Removed BrowserRouter here
import Nav from "./components/Nav";
import { UserProvider } from "./context/UserContext";
import HomePage from "./pages/HomePage";
import AdminPanel from "./pages/admin/AdminPanel";
import UsersPage from "./pages/admin/UsersPage";
import EventsPage from "./pages/admin/EventsPage";
import AdminScanner from "./pages/admin/AdminScanner";
import Profile from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventDetail from "./pages/admin/EventDetail";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet";
import SchedulePage from "./pages/SchedulePage";
import AboutPage from "./pages/AboutPage";

const App = () => {
  return (
    <UserProvider>
      <Helmet>
        <title>HackKU25</title>
      </Helmet>
      <MainLayout />
    </UserProvider>
  );
};

const MainLayout = () => {
  const location = useLocation();
  const hideNavRoutes = ["/login", "/register"];

  return (
    <div>
      {!hideNavRoutes.includes(location.pathname) && <Nav />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/about" element={<AboutPage />} />

        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/admin/events/:eventId" element={<EventDetail />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/events" element={<EventsPage />} />
        <Route path="/admin/scanner" element={<AdminScanner />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
