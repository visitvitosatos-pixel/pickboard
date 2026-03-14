export type PickStatus = "pending" | "won" | "lost";

export type StoredPick = {
  id: string;
  author: string;
  sport: string;
  league: string;
  eventName: string;
  market: string;
  odds: string;
  stakeUnits: string;
  startTime: string;
  note: string;
  status: PickStatus;
  createdAt: string;
};