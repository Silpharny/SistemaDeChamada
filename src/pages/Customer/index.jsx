import "./styles.css";

import Navbar from "../../components/Navbar";
import Title from "../../components/Title";
import { FiUser } from "react-icons/fi";
import { useState } from "react";
import { db } from "../../services/firebaseConection";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

export default function Customer() {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    if (name !== "" && cnpj !== "" && address !== "") {
      await addDoc(collection(db, "customers"), {
        nomeFantasia: name,
        cnpj: cnpj,
        endereco: address,
      })
        .then(() => {
          setName("");
          setCnpj("");
          setAddress("");
          toast.success("Empresa Registrada!");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Erro ao registrar Empresa!");
        });
    } else {
      toast.error("Preencha os todos os campos!");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="content">
        <Title titlePage="Clientes">
          <FiUser size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="Digite o CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />

            <label>Endereço da Empresa</label>
            <input
              type="text"
              placeholder="Nome da Empresa"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
