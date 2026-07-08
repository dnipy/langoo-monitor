import { logger } from "../logger";
import { EventListener } from "../types/event-listener";
import { MonitorEvent } from "../types/monitor-event";

export class ConsoleLogger implements EventListener {
  async onEvent(event: MonitorEvent): Promise<void> {
    logger.warn({
      event: event.type,
      probe: event.probe,
      status: event.status,
      latency: event.latency,
      message: event.message,
    });
  }
}
