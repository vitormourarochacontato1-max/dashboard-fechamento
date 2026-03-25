import { useState } from "react";
import Dashboard from "./dashboard_racional_dante.jsx";

export default function App() {
  const [ok, setOk] = useState(false);
  const [senha, setSenha] = useState("");

  if (!ok) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Área restrita</h2>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={() => {
          if (senha === "4321") setOk(true);
          else alert("Senha errada");
        }}>
          Entrar
        </button>
      </div>
    );
  }

  return <Dashboard />;
}