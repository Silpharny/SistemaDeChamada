import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";

import "../SignIn/styles.css";

import { AuthContext } from "../../contexts/auth";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { SignUp, loadingAuth } = useContext(AuthContext);

  async function registerUser(e) {
    e.preventDefault();

    if (name == "" || email === "" || password === "") {
      return;
    }

    await SignUp(name, email, password);
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={Logo} alt="Logo do sistema" />
        </div>

        <form onSubmit={registerUser}>
          <h1>Cadastrar nova conta</h1>
          <input
            type="text"
            placeholder="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            {loadingAuth ? "Carregando..." : "Cadastrar"}
          </button>
        </form>

        <Link to="/">Já possui uma conta? Faça Login</Link>
      </div>
    </div>
  );
}
