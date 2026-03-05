export interface IHealthResponse {
  status: "ok";
  service: string;
  timestamp: string;
}

export interface ICacheEntry {
  data: unknown;
  expiresIn: string;
}

export interface ICacheResponse {
  entries: Record<string, ICacheEntry>;
  timestamp: string;
}
