import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import "./App.css";
import Login from "./components/Login";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import CategoryScreen from "./components/CategoryScreen";
import ProductScreen from "./components/ProductScreen";
import Dashboard from "./components/Dashboard";
import useAuth from "./auth/auth";

function App() {
  const { user, handleSignIn, handleSignOut } = useAuth();

  return (
    <div className="m-auto w-full min-w-[400px] md:w-[1000px] h-screen">
      {user ? (
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <HomeScreen
                  handleSignOut={handleSignOut}
                  user={user}
                  RightScreen={Dashboard}
                />
              }
            />
            <Route
              path="/product"
              element={
                <HomeScreen
                  handleSignOut={handleSignOut}
                  user={user}
                  RightScreen={ProductScreen}
                />
              }
            />
            <Route
              path="/category"
              element={
                <HomeScreen
                  handleSignOut={handleSignOut}
                  user={user}
                  RightScreen={CategoryScreen}
                />
              }
            />
          </Routes>
        </Router>
      ) : (
        <Login handleSignIn={handleSignIn} />
      )}
    </div>
  );
}

export default App;
