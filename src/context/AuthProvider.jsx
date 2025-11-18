import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false); // prevent multiple popups

  // Email Sign-Up
  const createUserWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Update Profile
  const updateProfileFunc = (displayName, photoURL) => {
    return updateProfile(auth.currentUser, { displayName, photoURL });
  };

  const sendEmailVerificationFunc = () => {
    return sendEmailVerification(auth.currentUser);
  };

  const signInWithEmailAndPasswordFunc = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign-In
  const signInWithGoogleFunc = async () => {
    if (popupOpen) return;
    setPopupOpen(true);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      throw error;
    } finally {
      setLoading(false);
      setPopupOpen(false);
    }
  };

  // GitHub Sign-In
  const signInWithGithubFunc = async () => {
    if (popupOpen) return;
    setPopupOpen(true);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      return result.user;
    } catch (error) {
      console.error("GitHub Sign-In Error:", error);
      throw error;
    } finally {
      setLoading(false);
      setPopupOpen(false);
    }
  };

  const signoutUserFunc = () => {
    setLoading(true);
    return signOut(auth);
  };

  const sendPassResetEmailFunc = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const authInfo = {
    user,
    setUser,
    loading,
    setLoading,
    createUserWithEmailAndPasswordFunc,
    signInWithEmailAndPasswordFunc,
    signInWithGoogleFunc,
    signInWithGithubFunc,
    signoutUserFunc,
    sendPassResetEmailFunc,
    sendEmailVerificationFunc,
    updateProfileFunc,
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
