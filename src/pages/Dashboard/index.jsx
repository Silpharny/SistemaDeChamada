import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import Navbar from "../../components/Navbar";
import Title from "../../components/Title";
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from "react-icons/fi";

import "./styles.css";
import { Link } from "react-router-dom";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { db } from "../../services/firebaseConection";

import { format } from "date-fns";

export default function Dashboard() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEmpty, setIsEmpty] = useState(false);

  const [lastDocs, setLastDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);

  const { logout } = useContext(AuthContext);

  async function logoutUser() {
    await logout();
  }

  useEffect(() => {
    async function loadChamadas() {
      const listRef = collection(db, "called");
      const q = query(listRef, orderBy("created", "desc"), limit(5));

      const querySnapshot = await getDocs(q);
      setChamados([]);

      await updateState(querySnapshot);
      setLoading(false);
    }
    loadChamadas();

    return () => {};
  }, []);

  async function updateState(querySnapshot) {
    const isCollectionEmpty = querySnapshot.size === 0;

    if (!isCollectionEmpty) {
      let list = [];

      querySnapshot.forEach((doc) => {
        list.push({
          id: doc.id,
          assunto: doc.data().assunto,
          client: doc.data().client,
          clientId: doc.data().clientId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; //pegando o último item

      setLastDocs(lastDoc);

      setChamados((chamados) => [...chamados, ...list]);
    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);
  }

  async function handleMore() {
    setLoadingMore(true);

    const listRef = collection(db, "called");
    const q = query(
      listRef,
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    );

    const querySnapshot = await getDocs(q);

    await updateState(querySnapshot);
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="content">
          <Title titlePage="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div className="content">
        <Title titlePage="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span>Nenhum chamado encontrado...</span>
              <Link to="/new" className="new">
                <FiPlus size={25} color="#fff" />
                <span>Novo Chamado</span>
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus size={25} color="#fff" />
                <span>Novo Chamado</span>
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrado Em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{item.client}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                (item.status === "Aberto" && "#b85c5c") ||
                                (item.status === "Progresso" && "#b8a75c") ||
                                (item.status === "Atendido" && "#5cb85c"),
                            }}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td data-label="CadastradoEm">{item.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f3" }}
                          >
                            <FiSearch color="#fff" size={17} />
                          </button>

                          <Link
                            to={`/new/${item.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#fff" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && (
                <button className="btn-more" onClick={handleMore}>
                  Buscar mais
                </button>
              )}
            </>
          )}
        </>
      </div>
      <button onClick={logoutUser}>Sair da conta</button>
    </div>
  );
}
