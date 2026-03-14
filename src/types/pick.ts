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
  matchStartTime: string;
  betPlacedTime: string;
  note: string;
  status: PickStatus;
  createdAt: string;
};