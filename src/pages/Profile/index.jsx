import "./styles.css";

import Navbar from "../../components/Navbar";
import Title from "../../components/Title";

import Avatar from "../../assets/avatar.png";

import { FiSettings, FiUpload } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConection";
import { toast } from "react-toastify";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function Profile() {
  const { user, logout, storageUser, setUser } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);

  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);

  function changeFile(e) {
    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
        return;
      }

      alert("Envie uma imagem do tipo PNG ou JPEG");
      setImageAvatar(null);
      return;
    }
  }

  async function handleUpload() {
    const currentUid = user.uid;

    const uploadRef = ref(storage, `image/${currentUid}/${imageAvatar.name}`);

    const uploadTask = uploadBytes(uploadRef, imageAvatar).then((snapshot) => {
      getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        let urlPic = downloadURL;

        const docRef = doc(db, "users", user.uid);

        await updateDoc(docRef, {
          avatarUrl: urlPic,
          name: name,
        }).then(() => {
          let data = {
            ...user,
            name: name,
            avatarUrl: urlPic,
          };

          setUser(data);
          storageUser(data);
          toast.success("Atualizado com sucesso!");
        });
      });
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (imageAvatar == null && name !== "") {
      const docRef = doc(db, "users", user.uid);

      await updateDoc(docRef, {
        name: name,
      }).then(() => {
        let data = {
          ...user,
          name: name,
        };

        setUser(data);
        storageUser(data);
        toast.success("Atualizado com sucesso!");
      });
    } else if (name !== "" && imageAvatar !== null) {
      handleUpload();
    }
  }

  return (
    <div>
      <Navbar />
      <div className="content">
        <Title titlePage="Meu perfil">
          <FiSettings size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload size={25} color="#fff" />
              </span>
              <input type="file" accept="image/*" onChange={changeFile} />
              <br />
              {avatarUrl === null ? (
                <img
                  src={Avatar}
                  alt="Foto de perfil"
                  width={250}
                  height={250}
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Foto de perfil"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <label>Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Email</label>
            <input type="email" value={email} disabled={true} />
            <button type="submit">Salvar</button>
          </form>
        </div>
        <div className="container">
          <button className="logout-btn" onClick={() => logout()}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
