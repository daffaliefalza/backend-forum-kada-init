import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { getMe, logoutUser } from "./api/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";

function App() {
  // sTATE VARIABLES
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const data = await getMe();

      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  });

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} onLogout={handleLogout} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<Posts user={user} />} />
            <Route path="/login" element={<Login onLogin={fetchUser} />} />
            <Route
              path="/register"
              element={<Register onRegister={fetchUser} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
