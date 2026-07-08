import { MonitorEvent, MonitorEventType } from "../types/monitor-event";
import { ProbeStatus } from "../types/probe-result";

export class AlertFormatter {
  static format(event: MonitorEvent, env: string): string {
    const icon =
      event.type === MonitorEventType.DOWN
        ? "🔴"
        : event.type === MonitorEventType.RECOVERED
        ? "🟢"
        : "🔵";

    const time = new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Tehran",
    }).format(event.timestamp);
    return [
      `${icon} ${event.type}`,
      "",
      `🖥️ Service: monitor-service`,
      `🌍 Environment: ${env}`,
      "",
      `🔎 Probe: ${event.probe}`,
      `❤️ Status: ${event.status} ${
        event.status == ProbeStatus.HEALTHY ? "✅" : "❌"
      }`,
      `⚡ Latency: ${event.latency?.toFixed(0)} ms`,
      ...(event.message ? [`💬 Message: ${event.message}`] : []),
      ` ${time}`,
    ].join("\n");
  }
}
