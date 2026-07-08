import { logger } from "../logger";
import { ProbeListener } from "../types/probe-listener";
import { Registry } from "./registry";

export class Scheduler {
  constructor(
    private readonly registry: Registry,
    private readonly listener: ProbeListener,
    private readonly interval: number
  ) {
    logger.info(`[Scheduler] : init`);
  }

  start() {
    this.run();

    setInterval(() => {
      this.run();
    }, this.interval);
  }

  private async run() {
    logger.info(`[Scheduler] : run called`);
    await Promise.all(
      this.registry.all().map(async (probe) => {
        const result = await probe.run();

        await this.listener.onResult(probe, result);
      })
    );
  }
}
