import { config } from "../config";
import { MonitorEventType } from "../types/monitor-event";
import { Probe } from "../types/probe";
import { ProbeListener } from "../types/probe-listener";
import { ProbeResult, ProbeState, ProbeStatus } from "../types/probe-result";
import { EventBus } from "./event-bus";

export class StateManager implements ProbeListener {
  private readonly states = new Map<string, ProbeState>();

  constructor(private readonly eventBus: EventBus) {}

  async onResult(probe: Probe, result: ProbeResult): Promise<void> {
    const state = this.states.get(probe.id);

    if (!state) {
      this.states.set(probe.id, {
        status: result.status,
        consecutiveFailures: result.status === ProbeStatus.UNHEALTHY ? 1 : 0,
        consecutiveSuccesses: result.status === ProbeStatus.HEALTHY ? 1 : 0,
      });

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

    // Already healthy
    if (state.status === ProbeStatus.HEALTHY) {
      if (result.status === ProbeStatus.HEALTHY) {
        state.consecutiveFailures = 0;
        state.consecutiveSuccesses++;
        return;
      }

      state.consecutiveFailures++;
      state.consecutiveSuccesses = 0;

      if (state.consecutiveFailures >= config.failureThreshold) {
        state.status = ProbeStatus.UNHEALTHY;
        state.consecutiveFailures = 0;

        await this.eventBus.emit({
          probe: probe.displayName,
          type: MonitorEventType.DOWN,
          status: ProbeStatus.UNHEALTHY,
          message: result.message,
          latency: result.latency,
          timestamp: new Date(),
        });
      }

      return;
    }

    // Already unhealthy
    if (result.status === ProbeStatus.UNHEALTHY) {
      state.consecutiveFailures++;
      state.consecutiveSuccesses = 0;
      return;
    }

    state.consecutiveFailures = 0;
    state.consecutiveSuccesses++;

    if (state.consecutiveSuccesses >= config.recoveryThreshold) {
      state.status = ProbeStatus.HEALTHY;
      state.consecutiveSuccesses = 0;

      await this.eventBus.emit({
        probe: probe.displayName,
        type: MonitorEventType.RECOVERED,
        status: ProbeStatus.HEALTHY,
        message: result.message,
        latency: result.latency,
        timestamp: new Date(),
      });
    }
  }
}
