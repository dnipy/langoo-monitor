import { MongoClient } from "mongodb";
import { BaseProbe } from "./base";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { config } from "../config";
import { logger } from "../logger";

export class MongoProbe extends BaseProbe {
  readonly id = "mongo";

  readonly displayName = "MongoDB";

  protected async check(): Promise<CheckResult> {
    const mongoUri = `mongodb://${config.mongoUser}:${config.mongoPassword}@${config.mongoHost}:${config.mongoPort}?authSource=admin`;
    const client = new MongoClient(mongoUri, { appName: "monitoring" });

    await client.connect();

    await client.db(config.mongoDB).command({ ping: 1 });

    await client.close();

    return {
      status: ProbeStatus.HEALTHY,
    };
  }
}
