import axios from "axios";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { BaseProbe } from "./base";
import { config } from "../config";

export class CaddyProbe extends BaseProbe {
  readonly id = "caddy";

  readonly displayName = "Caddy";

  protected async check(): Promise<CheckResult> {
    const response = await axios.get(config.caddyUrl);

    return {
      status:
        response.status === 200 ? ProbeStatus.HEALTHY : ProbeStatus.UNHEALTHY,
    };
  }
}
