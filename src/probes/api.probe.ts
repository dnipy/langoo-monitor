import axios from "axios";

import { BaseProbe } from "./base";
import { ProbeStatus } from "../types/probe-result";
import { config } from "../config";
import { logger } from "../logger";

export class ApiProbe extends BaseProbe {
  readonly id = "api";

  readonly displayName = "Backend API";

  protected async check() {
    const response = await axios.get(config.apiUrl);
    if (response.status !== 200) {
      return {
        status: ProbeStatus.UNHEALTHY,
        message: `HTTP ${response.status}`,
      };
    }

    return {
      status: ProbeStatus.HEALTHY,
    };
  }
}
