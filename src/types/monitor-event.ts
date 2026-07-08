import { ProbeStatus } from "./probe-result";

export enum MonitorEventType {
  INITIALIZED = "INITIALIZED",
  DOWN = "DOWN",
  RECOVERED = "RECOVERED",
}

export interface MonitorEvent {
  probe: string;

  status: ProbeStatus;

  type: MonitorEventType;

  message?: string;

  latency?: number;

  timestamp: Date;
}
