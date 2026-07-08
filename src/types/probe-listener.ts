import { Probe } from "./probe";
import { ProbeResult } from "./probe-result";

export interface ProbeListener {
  onResult(probe: Probe, result: ProbeResult): Promise<void>;
}
