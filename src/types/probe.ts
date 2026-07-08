import { ProbeResult } from "./probe-result";

export interface Probe {
  readonly id: string;

  readonly displayName: string;

  run(): Promise<ProbeResult>;
}
