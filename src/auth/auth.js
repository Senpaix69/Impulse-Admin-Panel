import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { auth } from "../firebase";

const useAuth = () => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") ?? null)
  );

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const userData = {
      email: result.user.email,
      name: result.user.displayName,
      emailVerified: result.user.emailVerified,
      phone: result.user.phoneNumber,
      profileUrl: result.user.photoURL,
      uid: result.user.uid,
    };
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, handleSignIn, handleSignOut };
};

export default useAuth;
