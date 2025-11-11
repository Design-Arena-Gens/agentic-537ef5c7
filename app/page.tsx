"use client";

import { useMemo, useState } from "react";
import { ControlPanel } from "@/components/ControlPanel";
import { SummaryCards } from "@/components/SummaryCards";
import { ActivityTable } from "@/components/ActivityTable";
import type { ActivityResponse } from "@/types/activity";

type FetchParams = {
  organization: string;
  usernames: string[];
  lookbackDays: number;
};

async function fetchActivity(params: FetchParams): Promise<ActivityResponse> {
  const response = await fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error ?? "Não foi possível atualizar os dados.");
  }

  return response.json();
}

function extractInsights(data: ActivityResponse | null): string[] {
  if (!data || !data.members.length) {
    return [
      "Rode a varredura para descobrir quem está sem entregar nada e quem precisa de reforços."
    ];
  }

  const insights: string[] = [];
  const subutilizados = data.members.filter((m) => m.status === "subutilizado");
  const sobrecarregados = data.members.filter((m) => m.status === "sobrecarregado");
  const equilibrados = data.members.filter((m) => m.status === "equilibrado");
  const avgScore = data.members.reduce((acc, curr) => acc + curr.activityScore, 0) / data.members.length;

  if (subutilizados.length) {
    insights.push(
      `${subutilizados.length} pessoa(s) com score abaixo de ${Math.round(avgScore * 0.5)}. ⚠️`
    );
  }
  if (sobrecarregados.length) {
    insights.push(
      `${sobrecarregados.length} pessoa(s) sobrecarregadas acima de ${Math.round(
        avgScore * 1.5
      )}. Hora de dividir o peso.`
    );
  }
  if (!insights.length) {
    insights.push("Squad aparentemente equilibrada. Mantenha o ritmo. ✨");
  } else if (equilibrados.length > data.members.length * 0.6) {
    insights.push("Maioria do time está equilibrada. Continue monitorando para evitar surpresas.");
  }

  if (data.totals.prsMerged === 0 && data.totals.prsOpened > 0) {
    insights.push("Tem PR aberta travada sem merge. Verifique quem está aguardando revisão.");
  }
  if (data.totals.reviews < data.totals.prsOpened * 0.8) {
    insights.push("Reviews estão lentas em relação à quantidade de PRs. Reforce disciplina.");
  }

  return insights;
}

export default function Page() {
  const [snapshot, setSnapshot] = useState<ActivityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(params: FetchParams) {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActivity(params);
      setSnapshot(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  const insights = useMemo(() => extractInsights(snapshot), [snapshot]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Dedo Duro do GitHub</h1>
        <p>
          Radar implacável para descobrir rapidamente quem está sem entregar nada e quem está
          carregando o piano no repositório da empresa. Ajuste prioridades, redistribua tarefas e
          mantenha o time no ritmo certo.
        </p>
      </header>

      <main className="content">
        <ControlPanel loading={loading} onSubmit={handleSubmit} />

        {error && (
          <div className="panel error-box">
            <strong>Ops!</strong> {error}
          </div>
        )}

        <SummaryCards data={snapshot} />

        <div className="panel">
          <h2>Insights rápidos</h2>
          <div className="legend">
            {insights.map((insight) => (
              <span key={insight}>
                <i style={{ backgroundColor: "#6366f1" }} />
                {insight}
              </span>
            ))}
          </div>
        </div>

        <ActivityTable members={snapshot?.members ?? []} />
      </main>
    </div>
  );
}
