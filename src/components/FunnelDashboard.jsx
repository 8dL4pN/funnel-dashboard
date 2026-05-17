import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, FunnelChart, Funnel, Cell, LabelList } from "recharts";

const DATASETS = {
  thisWeek: {
    label: "This Week",
    stages: [
      { name: "Visit", icon: "???", users: 12400, color: "#6ee7f7" },
      { name: "Product View", icon: "???", users: 7820, color: "#a78bfa" },
      { name: "Add to Cart", icon: "??", users: 3210, color: "#f9a8d4" },
      { name: "Purchase", icon: "??", users: 1340, color: "#6ee7b7" },
    ],
  },
  lastWeek: {
    label: "Last Week",
    stages: [
      { name: "Visit", icon: "???", users: 10900, color: "#6ee7f7" },
      { name: "Product View", icon: "???", users: 6500, color: "#a78bfa" },
      { name: "Add to Cart", icon: "??", users: 2800, color: "#f9a8d4" },
      { name: "Purchase", icon: "??", users: 980, color: "#6ee7b7" },
    ],
  },
  lastMonth: {
    label: "Last Month",
    stages: [
      { name: "Visit", icon: "???", users: 48200, color: "#6ee7f7" },
      { name: "Product View", icon: "???", users: 29100, color: "#a78bfa" },
      { name: "Add to Cart", icon: "??", users: 11400, color: "#f9a8d4" },
      { name: "Purchase", icon: "??", users: 4900, color: "#6ee7b7" },
    ],
  },
};

export default function FunnelDashboard() {
  const [active, setActive] = useState("thisWeek");
  const data = DATASETS[active];

  const stages = data.stages.map((s, i) => {
    const prev = i === 0 ? s.users : data.stages[i - 1].users;
    return {
      ...s,
      dropoff: i === 0 ? 0 : prev - s.users,
      convRate: i === 0 ? 100 : +((s.users / prev) * 100).toFixed(1),
      overallRate: +((s.users / data.stages[0].users) * 100).toFixed(1),
    };
  });

  const bottleneck = stages.slice(1).reduce((w, s) => s.convRate < w.convRate ? s : w);

  const funnelData = stages.map(s => ({ name: s.name, value: s.users, fill: s.color }));
  const barData = stages.slice(1).map(s => ({ name: s.name, dropoff: s.dropoff, rate: s.convRate }));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", padding: "24px", fontFamily: "sans-serif", color: "#e8e8f0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "#6ee7f7", letterSpacing: -1 }}>? Funnel Dashboard</h1>
            <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>Visit ? Product View ? Add to Cart ? Purchase</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {Object.entries(DATASETS).map(([k, v]) => (
              <button key={k} onClick={() => setActive(k)} style={{
                padding: "8px 16px", borderRadius: 8, border: "1px solid",
                borderColor: active === k ? "#6ee7f7" : "#333",
                background: active === k ? "rgba(110,231,247,0.1)" : "transparent",
                color: active === k ? "#6ee7f7" : "#666", cursor: "pointer", fontSize: 13
              }}>{v.label}</button>
            ))}
          </div>
        </div>

        {/* Alert */}
        <div style={{ background: "rgba(249,168,84,0.08)", border: "1px solid rgba(249,168,84,0.3)", borderRadius: 12, padding: "14px 20px", marginBottom: 24, color: "#f9c874", fontSize: 14 }}>
          ?? <strong>Bottleneck:</strong> "{bottleneck.name}" has lowest conversion at <strong>{bottleneck.convRate}%</strong> — {bottleneck.dropoff.toLocaleString()} users dropped off.
        </div>

        {/* Stage Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {stages.map((s, i) => (
            <div key={s.name} style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${s.color}40`, borderRadius: 16, padding: 20, borderTop: `3px solid ${s.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontSize: 24 }}>{s.icon}</span>
                <span style={{ fontSize: 11, color: "#555" }}>STEP {i + 1}</span>
              </div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 6, textTransform: "uppercase" }}>{s.name}</div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#f0f0fa", marginBottom: 4 }}>{s.users.toLocaleString()}</div>
              <div style={{ fontSize: 11, color: "#444", marginBottom: 12 }}>users</div>
              <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: s.color }}>{s.overallRate}%</div>
                  <div style={{ fontSize: 10, color: "#555" }}>of total</div>
                </div>
                {i > 0 && <>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: s.convRate > 50 ? "#6ee7b7" : s.convRate > 30 ? "#f9c874" : "#f87171" }}>{s.convRate}%</div>
                    <div style={{ fontSize: 10, color: "#555" }}>from prev</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#f87171" }}>-{s.dropoff.toLocaleString()}</div>
                    <div style={{ fontSize: 10, color: "#555" }}>dropped</div>
                  </div>
                </>}
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 99 }}>
                <div style={{ height: "100%", width: `${s.overallRate}%`, background: s.color, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
          {/* Funnel Chart */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>Funnel Visualization</h2>
            <ResponsiveContainer width="100%" height={280}>
              <FunnelChart>
                <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} />
                <Funnel dataKey="value" data={funnelData} isAnimationActive>
                  {funnelData.map((entry, i) => <Cell key={i} fill={entry.fill} fillOpacity={0.8} />)}
                  <LabelList position="center" fill="#fff" fontSize={13} formatter={(v) => v.toLocaleString()} />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </div>

          {/* Dropoff Bar Chart */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>Drop-off Analysis</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#666", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid #333", borderRadius: 8 }} formatter={(v) => v.toLocaleString()} />
                <Bar dataKey="dropoff" fill="#f87171" radius={[6, 6, 0, 0]} fillOpacity={0.8} name="Users Dropped" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion Table + Suggestions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Conversion Matrix */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>Conversion Rates</h2>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>{["Stage", "Users", "From Prev", "Overall", "Dropped"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#555", fontSize: 11, textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {stages.map((s, i) => (
                  <tr key={s.name}>
                    <td style={{ padding: "12px", color: s.color, fontWeight: 600 }}>{s.icon} {s.name}</td>
                    <td style={{ padding: "12px", color: "#ccc" }}>{s.users.toLocaleString()}</td>
                    <td style={{ padding: "12px", color: s.convRate > 50 ? "#6ee7b7" : s.convRate > 30 ? "#f9c874" : "#f87171", fontWeight: 700 }}>{i === 0 ? "—" : `${s.convRate}%`}</td>
                    <td style={{ padding: "12px", color: s.color }}>{s.overallRate}%</td>
                    <td style={{ padding: "12px", color: "#f87171" }}>{i === 0 ? "—" : `-${s.dropoff.toLocaleString()}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Suggestions */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 28 }}>
            <h2 style={{ fontSize: 13, color: "#888", textTransform: "uppercase", letterSpacing: 2, marginBottom: 20 }}>?? Suggestions</h2>
            <div style={{ fontSize: 13, color: "#f9c874", marginBottom: 16, padding: "8px 12px", background: "rgba(249,200,116,0.08)", borderRadius: 8 }}>
              Focused on: <strong>{bottleneck.name}</strong> (worst drop-off at {bottleneck.convRate}%)
            </div>
            {[
              { icon: "??", tip: "Simplify checkout — reduce steps, offer guest checkout." },
              { icon: "??", tip: "Use high-quality images and video demos on product pages." },
              { icon: "?", tip: "Show ratings, reviews, and social proof badges." },
              { icon: "??", tip: "Send cart abandonment emails within 1 hour." },
              { icon: "??", tip: "Show clear pricing, discounts and limited-time offers." },
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "12px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>{t.icon}</span>
                <p style={{ fontSize: 13, color: "#b0b0c0", lineHeight: 1.6 }}>{t.tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
