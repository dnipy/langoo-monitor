import { MonitorEvent } from "../types/monitor-event";
import { EventListener } from "../types/event-listener";
import { logger } from "../logger";

export class EventBus {
  private readonly listeners: EventListener[] = [];

  constructor() {
    logger.info(`[EventBus] : init`);
  }

  register(listener: EventListener) {
    this.listeners.push(listener);
    logger.info(`[EventBus] : new listener registered`);
  }

  async emit(event: MonitorEvent): Promise<void> {
    await Promise.all(
      this.listeners.map((listener) => listener.onEvent(event))
    );
  }
}
