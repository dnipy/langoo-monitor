import { Redis } from "ioredis";
import { BaseProbe } from "./base";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { config } from "../config";

export class RedisProbe extends BaseProbe {
  readonly id = "redis";

  readonly displayName = "Redis";

  protected async check(): Promise<CheckResult> {
    const client = new Redis({
      host: config.redisHost,
      port: config.redisPort,
      lazyConnect: true,
    });

    await client.connect();

    await client.ping();

    await client.quit();

    return {
      status: ProbeStatus.HEALTHY,
    };
  }
}
