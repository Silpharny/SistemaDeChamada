import "./styles.css";

import Navbar from "../../components/Navbar";
import Title from "../../components/Title";
import { FiPlusCircle } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { AuthContext } from "../../contexts/auth";
import { db } from "../../services/firebaseConection";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function New() {
  const [customers, setCustomers] = useState([]);
  const [loadCustomer, setLoadCustomer] = useState(true);

  const [customerSelected, setCustomerSelected] = useState(0);

  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const { id } = useParams();

  const [complemento, setComplemento] = useState("");
  const [assunto, setAssunto] = useState("Suporte");
  const [status, setStatus] = useState("Aberto");

  const [idCustomer, setIdCustomer] = useState(false);

  function handleOptionChange(e) {
    setStatus(e.target.value);
  }

  function handleChangeSelect(e) {
    setAssunto(e.target.value);
  }

  useEffect(() => {
    async function getCustomers() {
      const listRef = collection(db, "customers");

      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {
          let list = [];

          snapshot.forEach((doc) => {
            list.push({
              id: doc.id,
              nomeFantasia: doc.data().nomeFantasia,
            });
          });
          if (snapshot.docs.size === 0) {
            console.log("Nenhuma Empresa Encontrada");
            setCustomers([{ id: "1", nomeFantasia: "Freela" }]);
            setLoadCustomer(false);
            return;
          }
          setCustomers(list);
          setLoadCustomer(false);

          if (id) {
            loadId(list);
          }
        })

        .catch((err) => {
          console.log(err);
          toast.error("Erro ao buscar os clientes");
          setLoadCustomer(false);
          setCustomers([{ id: "1", nomeFantasia: "Freela" }]);
        });
    }

    getCustomers();
  }, [id]);

  async function loadId(list) {
    const docRef = doc(db, "called", id);
    await getDoc(docRef)
      .then((snapshot) => {
        setAssunto(snapshot.data().assunto);
        setStatus(snapshot.data().status);
        setComplemento(snapshot.data().complemento);

        let index = list.findIndex(
          (item) => item.id === snapshot.data().clientId
        );

        setCustomerSelected(index);
        setIdCustomer(true);
      })
      .catch((error) => {
        console.log(error);
        navigate("/dashboard");
        setIdCustomer(false);
      });
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value);
  }

  async function handleRegister(e) {
    e.preventDefault();

    if (idCustomer) {
      const docRef = doc(db, "called", id);
      await updateDoc(docRef, {
        client: customers[customerSelected].nomeFantasia,
        clientId: customers[customerSelected].id,
        assunto: assunto,
        complemento: complemento,
        status: status,
        userId: user.uid,
      })
        .then(() => {
          toast.info("Chamado atualizado com sucesso!");
          setCustomerSelected(0);
          setComplemento("");
          navigate("/dashboard");
        })
        .catch((err) => {
          toast.error("Ops! Erro ao atualizar!");
          console.log(err);
        });
      return;
    }

    await addDoc(collection(db, "called"), {
      created: new Date(),
      client: customers[customerSelected].nomeFantasia,
      clientId: customers[customerSelected].id,
      assunto: assunto,
      complemento: complemento,
      status: status,
      userId: user.uid,
    })
      .then(() => {
        toast.success("Chamado Registrado!");
        setComplemento("");
        setCustomerSelected(0);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erro ao registrar!");
      });
  }

  return (
    <div>
      <Navbar />

      <div className="content">
        <Title titlePage={id ? "Editando chamado" : "Criando chamado"}>
          <FiPlusCircle size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Cliente</label>
            {loadCustomer ? (
              <input type="text" disabled={true} value="Carregando..." />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer}>
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index}>
                      {item.nomeFantasia}
                    </option>
                  );
                })}
              </select>
            )}
            <label>Assunto</label>
            <select value={assunto} onChange={handleChangeSelect}>
              <option value="Suporte">Suporte</option>
              <option value="Visita tecnica">Visita Técnica</option>
              <option value="Financeiro">Financeiro</option>
            </select>

            <label>Status</label>
            <div className="status">
              <input
                type="radio"
                name="radio"
                value="Aberto"
                onChange={handleOptionChange}
                checked={status === "Aberto"}
              />
              <span>Em aberto</span>
              <input
                type="radio"
                name="radio"
                value="Progresso"
                onChange={handleOptionChange}
                checked={status === "Progresso"}
              />
              <span>Progresso</span>
              <input
                type="radio"
                name="radio"
                value="Atendido"
                onChange={handleOptionChange}
                checked={status === "Atendido"}
              />
              <span>Atendido</span>
            </div>
            <label>Complemento</label>
            <textarea
              placeholder="Descreva o seu problema(opcional)"
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
            <button type="submit">Registrar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
