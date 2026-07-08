import { MonitorEvent } from "./monitor-event";

export interface EventListener {
  onEvent(event: MonitorEvent): Promise<void>;
}
