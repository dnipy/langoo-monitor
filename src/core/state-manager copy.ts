import { MonitorEventType } from "../types/monitor-event";
import { Probe } from "../types/probe";
import { ProbeListener } from "../types/probe-listener";
import { ProbeResult, ProbeStatus } from "../types/probe-result";
import { EventBus } from "./event-bus";

export class StateManager implements ProbeListener {
  private readonly states = new Map<string, ProbeStatus>();

  constructor(private readonly eventBus: EventBus) {}

  async onResult(probe: Probe, result: ProbeResult): Promise<void> {
    const previous = this.states.get(probe.id);

    this.states.set(probe.id, result.status);

    if (previous === undefined) {
      await this.eventBus.emit({
        probe: probe.displayName,

        type: MonitorEventType.INITIALIZED,

        status: result.status,

        message: result.message,

        latency: result.latency,

        timestamp: new Date(),
      });
      return;
    }

    if (
      previous === ProbeStatus.HEALTHY &&
      result.status === ProbeStatus.UNHEALTHY
    ) {
      await this.eventBus.emit({
        probe: probe.displayName,

        type: MonitorEventType.DOWN,

        status: result.status,

        message: result.message,

        latency: result.latency,

        timestamp: new Date(),
      });
      return;
    }

    if (
      previous === ProbeStatus.UNHEALTHY &&
      result.status === ProbeStatus.HEALTHY
    ) {
      await this.eventBus.emit({
        probe: probe.displayName,

        type: MonitorEventType.RECOVERED,

        status: result.status,

        message: result.message,

        latency: result.latency,

        timestamp: new Date(),
      });
    }
  }
}
