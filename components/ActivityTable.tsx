import Image from "next/image";
import type { ActivitySnapshot } from "@/types/activity";

type ActivityTableProps = {
  members: ActivitySnapshot[];
};

function formatDateTime(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function statusLabel(status: ActivitySnapshot["status"]) {
  switch (status) {
    case "subutilizado":
      return "Subutilizado";
    case "sobrecarregado":
      return "Sobrecarregado";
    default:
      return "Equilibrado";
  }
}

export function ActivityTable({ members }: ActivityTableProps) {
  const maxScore = members.reduce(
    (acc, member) => Math.max(acc, member.activityScore),
    1
  );

  if (!members.length) {
    return (
      <div className="panel empty-state">
        <strong>Nenhum dado disponível ainda</strong>
        Comece configurando a organização ou uma lista de membros a monitorar.
      </div>
    );
  }

  return (
    <div className="panel" style={{ padding: 0 }}>
      <table className="activity-table">
        <thead>
          <tr>
            <th>Colaborador</th>
            <th>Commits</th>
            <th>PRs Abertos</th>
            <th>PRs Merge</th>
            <th>Reviews</th>
            <th>Issues</th>
            <th>Comentários</th>
            <th>Score</th>
            <th>Status</th>
            <th>Última Atividade</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.username}>
              <td>
                <a
                  className="member-cell"
                  href={member.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    src={member.avatarUrl}
                    alt={member.username}
                    width={40}
                    height={40}
                  />
                  <div>
                    <strong>
                      {member.name ? `${member.name} · ` : ""}
                      {member.username}
                    </strong>
                  </div>
                </a>
              </td>
              <td>{member.commits}</td>
              <td>{member.prsOpened}</td>
              <td>{member.prsMerged}</td>
              <td>{member.reviews}</td>
              <td>{member.issuesOpened}</td>
              <td>{member.comments}</td>
              <td>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <strong>{member.activityScore.toFixed(1)}</strong>
                  <span className="score-bar">
                    <span
                      style={{
                        width: `${Math.max(
                          (member.activityScore / maxScore) * 100,
                          6
                        ).toFixed(0)}%`
                      }}
                    />
                  </span>
                </div>
              </td>
              <td>
                <span className={`status-chip status-${member.status === "equilibrado"
                    ? "balanced"
                    : member.status === "subutilizado"
                      ? "low"
                      : "high"
                  }`}
                >
                  {statusLabel(member.status)}
                </span>
              </td>
              <td>{formatDateTime(member.lastActivity)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
