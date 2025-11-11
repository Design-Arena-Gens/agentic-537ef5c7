import type { ActivityResponse } from "@/types/activity";

type SummaryCardsProps = {
  data: ActivityResponse | null;
};

const formatter = new Intl.NumberFormat("pt-BR");

export function SummaryCards({ data }: SummaryCardsProps) {
  if (!data) {
    return null;
  }

  const { totals, members, lookbackDays, trend } = data;
  const avgScore = members.length ? totals.activityScore / members.length : 0;
  const subutilizados = members.filter((m) => m.status === "subutilizado").length;
  const sobrecarregados = members.filter((m) => m.status === "sobrecarregado").length;

  return (
    <div className="metrics-grid">
      <div className="metric-card">
        <h3>Score total (últimos {lookbackDays} dias)</h3>
        <strong>{formatter.format(Math.round(totals.activityScore))}</strong>
        <p>
          Média individual: <strong>{avgScore.toFixed(1)}</strong>
        </p>
        <span className={`badge ${trend === "up" ? "trend-up" : trend === "down" ? "trend-down" : "trend-steady"
          }`}
        >
          {trend === "up" && "Tendência de alta"}
          {trend === "down" && "Tendência de queda"}
          {trend === "steady" && "Estável"}
        </span>
      </div>
      <div className="metric-card">
        <h3>Outputs técnicos</h3>
        <strong>{formatter.format(totals.commits)}</strong>
        <p>
          {totals.prsOpened} PRs abertas • {totals.prsMerged} merges • {totals.reviews} reviews
        </p>
      </div>
      <div className="metric-card">
        <h3>Saúde da Squad</h3>
        <strong>{members.length}</strong>
        <p>
          {subutilizados} subutilizados • {sobrecarregados} sobrecarregados
        </p>
      </div>
      <div className="metric-card">
        <h3>Interações</h3>
        <strong>{formatter.format(totals.comments + totals.issuesOpened)}</strong>
        <p>
          {totals.comments} comentários • {totals.issuesOpened} issues
        </p>
      </div>
    </div>
  );
}
