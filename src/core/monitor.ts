import { logger } from "../logger";
import { ConsoleLogger } from "../alerts/console.listener";
import { Probe } from "../types/probe";
import { EventBus } from "./event-bus";
import { Registry } from "./registry";
import { Scheduler } from "./scheduler";
import { StateManager } from "./state-manager";
import { TelegramNotifier } from "../alerts/telegram.listener";
import { BaleNotifier } from "../alerts/bale.listener";
import { config } from "../config";

export class Monitor {
  private readonly registry = new Registry();
  constructor() {
    logger.info("[Monitor] : init");
  }

  register(probe: Probe) {
    this.registry.register(probe);
  }

  start() {
    const bus = new EventBus();

    bus.register(new ConsoleLogger());

    if (config.nodeEnv == "production") {
      bus.register(new TelegramNotifier());
      bus.register(new BaleNotifier());
    }

    const scheduler = new Scheduler(
      this.registry,
      new StateManager(bus),
      30_000
    );
    scheduler.start();
  }
}
