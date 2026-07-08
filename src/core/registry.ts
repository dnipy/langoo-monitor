import { logger } from "../logger";
import { Probe } from "../types/probe";

export class Registry {
  private readonly probes: Probe[] = [];
  constructor() {
    logger.info("[Registry] : init");
  }
  register(probe: Probe) {
    this.probes.push(probe);
    logger.info(`[Registry] : ${probe.displayName} Added `);
  }

  all(): readonly Probe[] {
    return this.probes;
  }
}
