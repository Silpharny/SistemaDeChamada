import { createContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebaseConection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { json, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

export const AuthContext = createContext({});

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //Persistir o usuário
  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@ticketsPro");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  //Cadastrar usuário
  async function SignUp(name, email, password) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "users", uid), {
          name: name,
          avatarUrl: null,
        }).then(() => {
          let data = {
            uid: uid,
            name: name,
            email: value.user.email,
            avatarUrl: null,
          };
          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Seja bem-vindo ao sistema!");
          navigate("/dashboard");
        });
      })
      .catch((err) => {
        console.log(err);
        setLoadingAuth(false);
      });
  }

  //Guardar dados no localStorage
  function storageUser(data) {
    localStorage.setItem("@ticketsPro", JSON.stringify(data));
  }

  // Logar usuário
  async function SignIn(email, password) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        let data = {
          uid: uid,
          name: docSnap.data().name,
          email: value.user.email,
          avatarUrl: docSnap.data().avatarUrl,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Bem-Vindo(a) de volta!");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        setLoadingAuth(false);
        toast.error("Ops! Algo deu errado!");
      });
  }

  //Deslogar usuário
  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@ticketsPro");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        setUser,
        SignUp,
        SignIn,
        loadingAuth,
        loading,
        logout,
        storageUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
