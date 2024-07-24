import { FiX } from "react-icons/fi";
import "./styles.css";

export default function Modal({ closeModal, modalDatails }) {
  return (
    <div className="modal">
      <div className="container">
        <button className="close" onClick={closeModal}>
          <FiX size={25} color="#fff" />
          <span>Voltar</span>
        </button>

        <main>
          <h2>Detalhes do chamado</h2>

          <div className="row">
            <span>
              Clientes: <i>{modalDatails.client}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Assunto: <i>{modalDatails.assunto}</i>
            </span>
            <span>
              Cadastrado em: <i>{modalDatails.createdFormat}</i>
            </span>
          </div>
          <div className="row">
            <span>
              Status:
              <i
                style={{
                  marginLeft: 10,
                  borderRadius: 4,
                  color: "#FFF",
                  backgroundColor:
                    (modalDatails.status === "Aberto" && "#b85c5c") ||
                    (modalDatails.status === "Progresso" && "#b8a75c") ||
                    (modalDatails.status === "Atendido" && "#5cb85c"),
                }}
              >
                {modalDatails.status}
              </i>
            </span>
          </div>

          {modalDatails.complemento !== "" && (
            <>
              <h3>Complemento</h3>
              <p>{modalDatails.complemento}</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
