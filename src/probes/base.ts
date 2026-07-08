import { config } from "../config";
import { Probe } from "../types/probe";
import { CheckResult, ProbeResult, ProbeStatus } from "../types/probe-result";

export abstract class BaseProbe implements Probe {
  abstract readonly id: string;
  abstract readonly displayName: string;

  async run(): Promise<ProbeResult> {
    const started = performance.now();

    try {
      const result = await Promise.race([
        this.check(),
        this.timeout(config.probeTimeout),
      ]);

      return {
        ...result,
        latency: performance.now() - started,
      };
    } catch (error) {
      return {
        status: ProbeStatus.UNHEALTHY,
        latency: performance.now() - started,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Probe timed out")), ms);
    });
  }

  protected abstract check(): Promise<CheckResult>;
}
