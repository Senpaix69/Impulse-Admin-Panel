import { useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import axios from "axios";
import { auth } from "../firebase";
import host from "../consts/auth_consts";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(
    JSON.parse(localStorage.getItem("user") ?? null)
  );

  const getUserData = async () => {
    try {
      if (user === null) {
        const res = await axios.get(`${host}/api/getUser/${dbUser.email}`);
        if (res.status === 200) {
          setUser(res.data);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, [dbUser]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        email: result.user.email,
        name: result.user.displayName,
        emailVerified: result.user.emailVerified,
        phone: result.user.phoneNumber,
        profileUrl: result.user.photoURL,
        uid: result.user.uid,
      };
      console.log(userData);

      await axios.post(`${host}/api/signUp`, {
        user: {
          name: userData.name,
          email: userData.email,
          password: userData.uid,
          phone: userData.phone,
          downloadableProfileUrl: userData.profileUrl,
        },
        method: 1,
      });

      localStorage.setItem("user", JSON.stringify(userData));
      setDbUser(userData);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    setUser(null);
  };

  return { user, handleSignIn, handleSignOut };
};

export default useAuth;
