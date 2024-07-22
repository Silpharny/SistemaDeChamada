import { useContext, useState } from "react";
import Logo from "../../assets/logo.png";
import { Link, Navigate } from "react-router-dom";

import "./styles.css";
import { AuthContext } from "../../contexts/auth";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { SignIn, loadingAuth, signed } = useContext(AuthContext);

  if (signed) {
    return <Navigate to="/dashboard" />;
  }

  async function LoginUser(e) {
    e.preventDefault();
    if (email === "" || password === "") {
      return;
    }

    await SignIn(email, password);
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={Logo} alt="Logo do sistema" />
        </div>

        <form onSubmit={LoginUser}>
          <h1>Entrar</h1>
          <input
            type="text"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? "Carregando..." : "Acessar"}
          </button>
        </form>

        <Link to="/register">Criar uma conta</Link>
      </div>
    </div>
  );
}
