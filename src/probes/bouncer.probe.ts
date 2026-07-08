import { Client } from "pg";
import { BaseProbe } from "./base";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { config } from "../config";

export class PgBouncerProbe extends BaseProbe {
  readonly id = "pgbouncer";

  readonly displayName = "PG Bouncer";

  protected async check(): Promise<CheckResult> {
    const client = new Client({
      host: config.bouncerHost,
      port: config.bouncerPort,
      user: config.postgresUser,
      password: config.postgresPassword,
      database: config.postgresDB,
    });

    await client.connect();

    await client.query("SELECT 1");

    await client.end();

    return {
      status: ProbeStatus.HEALTHY,
    };
  }
}
