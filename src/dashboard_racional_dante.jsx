import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const fmt = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const fmtFull = (v) => "R$ " + v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (v) => (v * 100).toFixed(1) + "%";

const CUSTOS_MENSAIS = [
  { mes: "Out/24", valor: 91221 }, { mes: "Nov/24", valor: 99335 }, { mes: "Dez/24", valor: 109891 },
  { mes: "Jan/25", valor: 189806 }, { mes: "Fev/25", valor: 96216 }, { mes: "Mar/25", valor: 196486 },
  { mes: "Abr/25", valor: 40424 }, { mes: "Mai/25", valor: 225649 }, { mes: "Jun/25", valor: 244991 },
  { mes: "Jul/25", valor: 229996 }, { mes: "Ago/25", valor: 59853 }, { mes: "Set/25", valor: 161568 },
  { mes: "Out/25", valor: 54197 }, { mes: "Nov/25", valor: 118733 }, { mes: "Dez/25", valor: 71264 },
  { mes: "Jan/26", valor: 80765 }, { mes: "Fev/26", valor: 59669 }, { mes: "Mar/26", valor: 77300 },
];

const DESPESAS = [
  { name: "Custos Diretos", value: 2210571, color: "#3b82f6" },
  { name: "Mão de Obra", value: 911299, color: "#f59e0b" },
  { name: "Indiretos", value: 648900, color: "#a78bfa" },
  { name: "Impostos", value: 443531, color: "#ef4444" },
];

const MEDICOES = [
  { med: "SINAL", data: "27/11/24", valor: 153767 }, { med: "001", data: "04/12/24", valor: 272618 },
  { med: "002", data: "13/01/25", valor: 444184 }, { med: "003", data: "20/02/25", valor: 85203 },
  { med: "004", data: "12/03/25", valor: 158190 }, { med: "005", data: "26/03/25", valor: 121792 },
  { med: "006", data: "29/04/25", valor: 215456 }, { med: "007", data: "17/06/25", valor: 150065 },
  { med: "008", data: "03/07/25", valor: 422646 }, { med: "009", data: "30/07/25", valor: 309805 },
  { med: "010", data: "04/09/25", valor: 178957 }, { med: "010B", data: "30/09/25", valor: 245165 },
  { med: "011", data: "06/10/25", valor: 308537 }, { med: "012", data: "29/10/25", valor: 186666 },
  { med: "013", data: "09/12/25", valor: 423859 }, { med: "014", data: "06/01/26", valor: 199615 },
  { med: "015", data: "03/02/26", valor: 294206 },
  { med: "MNT.1", data: "12/01/26", valor: 81000 }, { med: "MNT.2", data: "10/02/26", valor: 81000 },
  { med: "OFF.1", data: "11/08/25", valor: 42366 }, { med: "OFF.2", data: "01/09/25", valor: 16002 },
  { med: "OFF.3", data: "02/10/25", valor: 7650 }, { med: "OFF.4", data: "03/02/26", valor: 8250 },
];

const FORMAS = [
  { name: "PIX", value: 345, color: "#22c55e" }, { name: "Boleto", value: 110, color: "#3b82f6" },
  { name: "Cheque", value: 37, color: "#f59e0b" }, { name: "Espécie", value: 5, color: "#ef4444" },
];

const EQUIPE = [
  { nome: "EDINELSON", funcao: "Coordenador", sal: 9500 },
  { nome: "ADAUTO", funcao: "Encarregado", sal: 1878.75 },
  { nome: "CARLOS ALEXANDRE RIBEIRO", funcao: "Op. Motosserra", sal: 1858.54 },
  { nome: "JOÃO HENRIQUE DOS SANTOS ROSA", funcao: "Op. Motosserra", sal: 1858.54 },
  { nome: "TIAGO PONTES DOS SANTOS", funcao: "Op. Motosserra", sal: 1858.54 },
  { nome: "VANILDO SANTOS DA SILVA", funcao: "Op. Motosserra", sal: 1858.54 },
  { nome: "WILLIAN DUARTE", funcao: "Op. Motosserra", sal: 1858.54 },
  { nome: "ROGERIO DO NASCIMENTO", funcao: "Op. Motosserra", sal: 1858.48 },
  { nome: "BRAYAN PIOKER", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "DAVI RIBEIRO KOMIYAMA", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "GILBERTO", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "GILMAR A. VECHIATTO", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "JATANIEL", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "PAULO D. CALLEGARI", funcao: "Op. Roçadeira", sal: 1725 },
  { nome: "CARLOS EDUARDO VITOR", funcao: "Jardineiro", sal: 1725 },
  { nome: "DIEGO CAMILO", funcao: "Jardineiro", sal: 1725 },
  { nome: "MAURICIO OLIVEIRA", funcao: "Jardineiro", sal: 1725 },
  { nome: "ADERSON EDUARDO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ADRIANO B. OLIVEIRA", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ANDRE LUIS MACEDO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "CHRISTOPHER BERNARDO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "DANIEL ALVES", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ENAYAN R. ALVES", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "FRANCISCO FRANKLIN", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "GUSTAVO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "JADSON D. CAMILO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "JOÃO R. SOUZA SANTOS", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "JUBERTO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "KELVIN", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "LUCAS TEIXEIRA", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "MARIO SERGIO MARTINS", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "MATHEUS DOS SANTOS", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ROBERTO AUGUSTO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ROBSON DOS SANTOS SILVA", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "VITOR E. CELESTINO", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "WELLINGTON DOS SANTOS", funcao: "Ajud. Jardineiro", sal: 1559.58 },
  { nome: "ANTONIO FRANCISCO", funcao: "Ajudante Geral", sal: 1559.58 },
  { nome: "JOSÉ GERALDO", funcao: "Ajudante Geral", sal: 1559.58 },
];

const FUNCOES = (() => {
  const map = {};
  EQUIPE.forEach((e) => { map[e.funcao] = (map[e.funcao] || 0) + 1; });
  const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#a78bfa", "#ef4444", "#06b6d4", "#f97316"];
  return Object.entries(map).map(([name, value], i) => ({ name, value, color: colors[i % colors.length] }));
})();

const KPI = ({ label, value, sub, accent = "#3b82f6" }) => (
  <div style={{ background: "#141821", borderRadius: 10, padding: "16px 18px", border: "1px solid #252b3a", borderTop: `3px solid ${accent}`, flex: "1 1 180px", minWidth: 170 }}>
    <div style={{ fontSize: 11, color: "#8a92a6", textTransform: "uppercase", letterSpacing: 0.8, fontWeight: 600 }}>{label}</div>
    <div style={{ fontSize: 21, fontWeight: 700, marginTop: 5, fontFamily: "monospace", color: "#e8ecf4" }}>{value}</div>
    {sub && <div style={{ fontSize: 11, color: "#8a92a6", marginTop: 3 }}>{sub}</div>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1f2b", border: "1px solid #252b3a", borderRadius: 8, padding: "8px 12px", fontSize: 12 }}>
      <div style={{ color: "#8a92a6", marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color || "#e8ecf4", fontFamily: "monospace" }}>{fmtFull(p.value)}</div>)}
    </div>
  );
};

const TABS = ["Resumo", "Custos", "Faturamento", "Equipe"];

export default function Dashboard() {
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filteredEquipe = useMemo(() => {
    let list = [...EQUIPE];
    if (search) list = list.filter((e) => e.nome.toLowerCase().includes(search.toLowerCase()) || e.funcao.toLowerCase().includes(search.toLowerCase()));
    if (sortCol) {
      list.sort((a, b) => {
        const av = a[sortCol], bv = b[sortCol];
        if (typeof av === "number") return sortDir === "asc" ? av - bv : bv - av;
        return sortDir === "asc" ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
      });
    }
    return list;
  }, [search, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const totalEmitido = 4325999;
 
  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#0c0f14", color: "#e8ecf4", minHeight: "100vh", padding: "20px 16px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #252b3a", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.3 }}>📊 Fechamento de Obra</div>
          <div style={{ display: "inline-block", background: "#22c55e", color: "#000", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, marginTop: 6, letterSpacing: 0.5 }}>RACIONAL DANTE — PAISAGISMO</div>
        </div>
        <div style={{ textAlign: "right", color: "#8a92a6", fontSize: 12, lineHeight: 1.8 }}>
          Cliente: <span style={{ color: "#e8ecf4", fontWeight: 600 }}>RACIONAL</span><br />
          Ref: <span style={{ color: "#e8ecf4", fontWeight: 600 }}>AVP_100-2024-E</span><br />
          Contrato: <span style={{ color: "#e8ecf4", fontWeight: 600 }}>R$ 3.239.981</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 3, marginBottom: 24, background: "#141821", borderRadius: 10, padding: 4, width: "fit-content" }}>
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)} style={{ padding: "7px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: tab === i ? "#22c55e" : "transparent", color: tab === i ? "#000" : "#8a92a6", transition: ".15s" }}>{t}</button>
        ))}
      </div>

      {/* === RESUMO === */}
      {tab === 0 && (
        <div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
            <KPI label="Total Emitido" value="R$ 4.325.999" sub="+33,5% vs contrato" accent="#3b82f6" />
            <KPI label="Total Despesas" value="R$ 4.214.302" sub="Custos+MO+Ind+Imp" accent="#ef4444" />
            <KPI label="Lucro Líquido" value="R$ 111.697" sub="2,58% margem" accent="#22c55e" />
            <KPI label="Custos Pagos" value="R$ 2.210.571" sub="512 lançamentos" accent="#f59e0b" />
            <KPI label="Mão de Obra" value="R$ 911.299" sub="21,6% do emitido" accent="#3b82f6" />
            <KPI label="Impostos" value="R$ 443.531" sub="10,5% do emitido" accent="#f59e0b" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            {/* Pie */}
            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Composição das Despesas</div>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={DESPESAS} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={2} stroke="none">
                    {DESPESAS.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => fmtFull(v)} contentStyle={{ background: "#1a1f2b", border: "1px solid #252b3a", borderRadius: 8, fontSize: 12 }} />
                  <Legend formatter={(v) => <span style={{ color: "#8a92a6", fontSize: 11 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Waterfall-style bars */}
            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Receita vs Despesa</div>
              {[
                { label: "Emitido (NFs)", val: 4325999, pctW: 100, color: "#22c55e" },
                { label: "Custos Diretos", val: 2210571, pctW: 51.1, color: "#3b82f6" },
                { label: "Mão de Obra", val: 911299, pctW: 21.1, color: "#f59e0b" },
                { label: "Indiretos", val: 648900, pctW: 15, color: "#a78bfa" },
                { label: "Impostos", val: 443531, pctW: 10.3, color: "#ef4444" },
              ].map((item, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                    <span style={{ color: "#8a92a6" }}>{item.label}</span>
                    <span style={{ fontFamily: "monospace", color: item.color }}>{fmt(item.val)}</span>
                  </div>
                  <div style={{ height: 18, background: "#1a1f2b", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${item.pctW}%`, background: item.color, borderRadius: 3, transition: "width .6s" }} />
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px dashed #252b3a", paddingTop: 10, marginTop: 6, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ fontWeight: 700 }}>Lucro</span>
                <span style={{ fontFamily: "monospace", color: "#22c55e", fontWeight: 700 }}>R$ 111.697 (2,58%)</span>
              </div>
            </div>
          </div>

          {/* Monthly bar chart */}
          <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Custos Mensais — Out/2024 a Mar/2026</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={CUSTOS_MENSAIS} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b3a" />
                <XAxis dataKey="mes" tick={{ fill: "#8a92a6", fontSize: 10 }} axisLine={{ stroke: "#252b3a" }} />
                <YAxis tick={{ fill: "#8a92a6", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={{ stroke: "#252b3a" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
                  {CUSTOS_MENSAIS.map((d, i) => <Cell key={i} fill={d.valor > 200000 ? "#ef4444" : d.valor > 150000 ? "#f59e0b" : "#22c55e"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* === CUSTOS === */}
      {tab === 1 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Formas de Pagamento (512 lanç.)</div>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={FORMAS} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} stroke="none">
                    {FORMAS.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} lançamentos`} contentStyle={{ background: "#1a1f2b", border: "1px solid #252b3a", borderRadius: 8, fontSize: 12 }} />
                  <Legend formatter={(v) => <span style={{ color: "#8a92a6", fontSize: 11 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Custos Acumulados por Mês</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={CUSTOS_MENSAIS} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#252b3a" />
                  <XAxis dataKey="mes" tick={{ fill: "#8a92a6", fontSize: 9 }} axisLine={{ stroke: "#252b3a" }} />
                  <YAxis tick={{ fill: "#8a92a6", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={{ stroke: "#252b3a" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="valor" fill="#3b82f6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top custos por mês - table */}
          <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Detalhamento Mensal</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>{["Mês", "Valor (R$)", "% do Total", "Acumulado"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Mês" ? "left" : "right", padding: "8px 10px", color: "#8a92a6", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5, borderBottom: "1px solid #252b3a" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(() => {
                    let acc = 0;
                    return CUSTOS_MENSAIS.map((d, i) => {
                      acc += d.valor;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #1a1f2b" }}>
                          <td style={{ padding: "7px 10px" }}>{d.mes}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmtFull(d.valor)}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "monospace", color: "#8a92a6" }}>{pct(d.valor / 2210571)}</td>
                          <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "monospace", color: "#22c55e" }}>{fmt(acc)}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === FATURAMENTO === */}
      {tab === 2 && (
        <div>
          <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18, marginBottom: 14 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Valor por Medição</div>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MEDICOES} margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#252b3a" />
                <XAxis dataKey="med" tick={{ fill: "#8a92a6", fontSize: 9 }} axisLine={{ stroke: "#252b3a" }} />
                <YAxis tick={{ fill: "#8a92a6", fontSize: 10, fontFamily: "monospace" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} axisLine={{ stroke: "#252b3a" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="valor" radius={[3, 3, 0, 0]}>
                  {MEDICOES.map((d, i) => (
                    <Cell key={i} fill={d.med.includes("OFF") || d.med.includes("MNT") ? "#f59e0b" : "#22c55e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Detalhamento — {MEDICOES.length} medições</div>
            <div style={{ overflowX: "auto", maxHeight: 400, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr>{["Medição", "Emissão", "Valor Total", "% s/ Emitido"].map((h) => (
                    <th key={h} style={{ textAlign: h === "Medição" || h === "Emissão" ? "left" : "right", padding: "8px 10px", color: "#8a92a6", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #252b3a", position: "sticky", top: 0, background: "#141821" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {MEDICOES.map((m, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #1a1f2b" }}>
                      <td style={{ padding: "7px 10px", fontWeight: 600 }}>
                        <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: m.med.includes("OFF") ? "#f59e0b" : m.med.includes("MNT") ? "#a78bfa" : "#22c55e", marginRight: 8 }} />
                        {m.med}
                      </td>
                      <td style={{ padding: "7px 10px", fontFamily: "monospace", color: "#8a92a6" }}>{m.data}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmtFull(m.valor)}</td>
                      <td style={{ padding: "7px 10px", textAlign: "right", fontFamily: "monospace", color: "#8a92a6" }}>{pct(m.valor / totalEmitido)}</td>
                    </tr>
                  ))}
                  <tr style={{ background: "#1a1f2b" }}>
                    <td colSpan={2} style={{ padding: "8px 10px", fontWeight: 700 }}>TOTAL</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontFamily: "monospace", fontWeight: 700, color: "#22c55e" }}>{fmtFull(MEDICOES.reduce((s, m) => s + m.valor, 0))}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* === EQUIPE === */}
      {tab === 3 && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Distribuição por Função</div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={FUNCOES} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} stroke="none">
                    {FUNCOES.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v} pessoas`} contentStyle={{ background: "#1a1f2b", border: "1px solid #252b3a", borderRadius: 8, fontSize: 12 }} />
                  <Legend formatter={(v) => <span style={{ color: "#8a92a6", fontSize: 10 }}>{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 12, padding: "10px 12px", background: "#1a1f2b", borderRadius: 6, fontSize: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#8a92a6", marginBottom: 4 }}>
                  <span>Total colaboradores</span><span style={{ color: "#e8ecf4", fontWeight: 700 }}>{EQUIPE.length}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#8a92a6" }}>
                  <span>Folha base estimada</span><span style={{ color: "#22c55e", fontFamily: "monospace", fontWeight: 700 }}>{fmt(EQUIPE.reduce((s, e) => s + e.sal, 0))}</span>
                </div>
              </div>
            </div>

            <div style={{ background: "#141821", border: "1px solid #252b3a", borderRadius: 10, padding: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Quadro Operacional — {EQUIPE.length} colaboradores</div>
                <input
                  type="text" placeholder="Buscar nome ou função..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ background: "#1a1f2b", border: "1px solid #252b3a", color: "#e8ecf4", padding: "6px 12px", borderRadius: 6, fontSize: 12, width: 200, fontFamily: "inherit" }}
                />
              </div>
              <div style={{ overflowY: "auto", maxHeight: 380 }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr>
                      {[{ key: "nome", label: "Nome" }, { key: "funcao", label: "Função" }, { key: "sal", label: "Salário Base" }].map((h) => (
                        <th key={h.key} onClick={() => handleSort(h.key)} style={{ textAlign: h.key === "sal" ? "right" : "left", padding: "8px 10px", color: "#8a92a6", fontSize: 10, textTransform: "uppercase", borderBottom: "1px solid #252b3a", cursor: "pointer", position: "sticky", top: 0, background: "#141821", userSelect: "none" }}>
                          {h.label} {sortCol === h.key ? (sortDir === "asc" ? "▲" : "▼") : ""}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEquipe.map((e, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #1a1f2b" }}>
                        <td style={{ padding: "6px 10px" }}>{e.nome}</td>
                        <td style={{ padding: "6px 10px", color: "#8a92a6" }}>{e.funcao}</td>
                        <td style={{ padding: "6px 10px", textAlign: "right", fontFamily: "monospace" }}>{fmtFull(e.sal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
