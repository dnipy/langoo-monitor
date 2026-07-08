import axios from "axios";
import { CheckResult, ProbeStatus } from "../types/probe-result";
import { BaseProbe } from "./base";
import { config } from "../config";

export class FrontendProbe extends BaseProbe {
  readonly id = "frontend";

  readonly displayName = "Frontend";

  protected async check(): Promise<CheckResult> {
    const response = await axios.get(config.frontendUrl);

    return {
      status:
        response.status === 200 ? ProbeStatus.HEALTHY : ProbeStatus.UNHEALTHY,
    };
  }
}
