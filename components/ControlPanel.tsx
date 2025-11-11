import { FormEvent, useState } from "react";

type ControlPanelProps = {
  loading: boolean;
  onSubmit: (params: { organization: string; usernames: string[]; lookbackDays: number }) => void;
};

export function ControlPanel({ loading, onSubmit }: ControlPanelProps) {
  const [organization, setOrganization] = useState("");
  const [usernamesText, setUsernamesText] = useState("");
  const [lookbackDays, setLookbackDays] = useState(14);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const usernames = usernamesText
      .split(/\r?\n|,/)
      .map((value) => value.trim())
      .filter(Boolean);
    onSubmit({ organization, usernames, lookbackDays });
  }

  function handlePrefill(org: string) {
    setOrganization(org);
    setLookbackDays(14);
  }

  return (
    <form className="panel input-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="org">Organização do GitHub</label>
        <input
          id="org"
          placeholder="ex: minha-empresa"
          value={organization}
          onChange={(event) => setOrganization(event.target.value)}
          required
        />
      </div>
      <div className="field">
        <label htmlFor="lookback">Janela de análise</label>
        <select
          id="lookback"
          value={lookbackDays}
          onChange={(event) => setLookbackDays(Number(event.target.value))}
        >
          {[7, 14, 21, 30, 45, 60, 90].map((days) => (
            <option key={days} value={days}>
              Últimos {days} dias
            </option>
          ))}
        </select>
      </div>
      <div className="field" style={{ gridColumn: "1 / span 2" }}>
        <label htmlFor="members">
          Siga apenas estes logins (opcional, um por linha ou separados por vírgula)
        </label>
        <textarea
          id="members"
          placeholder="fulano\nciclano\nbeltrano"
          value={usernamesText}
          onChange={(event) => setUsernamesText(event.target.value)}
        />
      </div>
      <div className="actions" style={{ gridColumn: "1 / span 2" }}>
        <button type="submit" className="primary" disabled={loading}>
          {loading ? "Sincronizando..." : "Rodar varredura"}
        </button>
        <button
          type="button"
          className="ghost"
          onClick={() => handlePrefill("octokit")}
          disabled={loading}
        >
          Exemplo público (octokit)
        </button>
      </div>
    </form>
  );
}
