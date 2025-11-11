export type ActivitySnapshot = {
  username: string;
  name?: string;
  avatarUrl: string;
  profileUrl: string;
  commits: number;
  prsOpened: number;
  prsMerged: number;
  reviews: number;
  issuesOpened: number;
  comments: number;
  pushes: number;
  deployments: number;
  lastActivity?: string;
  activityScore: number;
  status: "subutilizado" | "equilibrado" | "sobrecarregado";
};

export type ActivityResponse = {
  generatedAt: string;
  lookbackDays: number;
  organization: string;
  totals: {
    commits: number;
    prsOpened: number;
    prsMerged: number;
    reviews: number;
    issuesOpened: number;
    comments: number;
    pushes: number;
    deployments: number;
    activityScore: number;
  };
  members: ActivitySnapshot[];
  trend: "up" | "down" | "steady";
};
