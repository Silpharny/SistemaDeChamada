import "./styles.css";

export default function Title({ children, titlePage }) {
  return (
    <div className="title">
      {children}
      <span>{titlePage}</span>
    </div>
  );
}
