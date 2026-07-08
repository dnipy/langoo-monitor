import axios from "axios";
import { AlertFormatter } from "./base";
import { MonitorEvent } from "../types/monitor-event";
import { EventListener } from "../types/event-listener";
import { config } from "../config";
import { logger } from "../logger";

export class TelegramNotifier implements EventListener {
  async onEvent(event: MonitorEvent): Promise<void> {
    const token = config.telegramToken;
    const chatId = config.telegramChatId;
    const env = config.nodeEnv;
    if (!token || !chatId) return;

    await axios
      .post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: chatId,
        text: AlertFormatter.format(event, env),
        parse_mode: "HTML",
      })
      .catch((error) => {
        logger.error(`[TELEGRAM] : failed to send alert ${error}`);
      });
  }
}
