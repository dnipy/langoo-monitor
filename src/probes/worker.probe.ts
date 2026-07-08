import Redis from "ioredis";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { BaseProbe } from "./base";
import { config } from "../config";

export class WorkerProbe extends BaseProbe {
  readonly id = "worker";
  readonly displayName = "Worker";

  protected async check(): Promise<CheckResult> {
    const redis = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      lazyConnect: true,
    });
    await redis.connect();

    try {
      const value = await redis.get("monitor:worker:heartbeat");

      if (!value) {
        return {
          status: ProbeStatus.UNHEALTHY,
          message: "No heartbeat received",
        };
      }

      const age = Date.now() - Number(value);

      if (age > 15_000) {
        return {
          status: ProbeStatus.UNHEALTHY,
          message: `Heartbeat stale (${Math.round(age / 1000)}s old)`,
        };
      }

      return {
        status: ProbeStatus.HEALTHY,
      };
    } finally {
      await redis.quit();
    }
  }
}
