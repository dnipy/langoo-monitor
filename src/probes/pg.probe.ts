import { Client } from "pg";
import { BaseProbe } from "./base";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { config } from "../config";

export class PostgresProbe extends BaseProbe {
  readonly id = "postgres";

  readonly displayName = "PostgreSQL";

  protected async check(): Promise<CheckResult> {
    const client = new Client({
      host: config.postgresHost,
      port: config.postgresPort,
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
