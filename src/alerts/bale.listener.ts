import axios from "axios";
import { AlertFormatter } from "./base";
import { MonitorEvent } from "../types/monitor-event";
import { EventListener } from "../types/event-listener";
import { config } from "../config";

export class BaleNotifier implements EventListener {
  async onEvent(event: MonitorEvent): Promise<void> {
    const token = config.baleToken;
    const chatId = config.baleChatId;
    const env = config.nodeEnv;

    if (!token || !chatId) return;

    await axios.post(`https://tapi.bale.ai/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: AlertFormatter.format(event, env),
    });
  }
}
