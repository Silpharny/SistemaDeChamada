import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Navbar from "../../components/Navbar";

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  async function logoutUser() {
    await logout();
  }

  return (
    <div>
      <Navbar />
      <h1>Página Dashboard</h1>
      <button onClick={logoutUser}>Sair da conta</button>
    </div>
  );
}
