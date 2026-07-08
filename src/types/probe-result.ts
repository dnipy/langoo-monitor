export enum ProbeStatus {
  HEALTHY = "healthy",
  UNHEALTHY = "unhealthy",
}

export interface ProbeState {
  status: ProbeStatus;
  consecutiveFailures: number;
  consecutiveSuccesses: number;
}

export interface ProbeResult {
  status: ProbeStatus;

  latency: number;

  message?: string;

  metadata?: Record<string, unknown>;
}

export interface CheckResult {
  status: ProbeStatus;
  message?: string;
  metadata?: Record<string, unknown>;
}
