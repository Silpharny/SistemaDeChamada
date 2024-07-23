import { useContext } from "react";
import Avatar from "../../assets/avatar.png";
import { AuthContext } from "../../contexts/auth";

import { FiHome, FiUser, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";

import "./styles.css";

export default function Navbar() {
  const { user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? Avatar : user.avatarUrl}
          alt="Foto do usuário"
        />
      </div>

      <Link to="/dashboard">
        <FiHome color="#fff" size={24} />
        <p>Chamados</p>
      </Link>
      <Link to="/customers">
        <FiUser color="#fff" size={24} />
        <p>Clientes</p>
      </Link>
      <Link to="/profile">
        <FiSettings color="#fff" size={24} />
        <p>Perfil</p>
      </Link>
    </div>
  );
}
