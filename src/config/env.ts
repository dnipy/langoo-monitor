import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  nodeEnv: required("NODE_ENV"),
  checkInterval: Number(process.env.CHECK_INTERVAL ?? 30_000),

  apiUrl: required("API_URL"),

  postgresHost: required("POSTGRES_HOST"),
  postgresPort: Number(process.env.POSTGRES_PORT ?? 5432),
  postgresUser: required("POSTGRES_USER"),
  postgresPassword: required("POSTGRES_PASSWORD"),
  postgresDB: required("POSTGRES_DB"),

  bouncerHost: required("BOUNCER_HOST"),
  bouncerPort: Number(process.env.BOUNCER_PORT ?? 5432),

  redisHost: required("REDIS_HOST"),
  redisPort: Number(process.env.REDIS_PORT ?? 6379),

  mongoHost: required("MONGO_HOST"),
  mongoPort: Number(process.env.MONGO_PORT ?? 27017),
  mongoUser: required("MONGO_USER"),
  mongoPassword: required("MONGO_PASSWORD"),
  mongoDB: required("MONGO_DB"),

  frontendUrl: required("FRONTEND_URL"),
  caddyUrl: required("CADDY_URL"),

  failureThreshold: Number(process.env.FAILURE_THRESHOLD ?? 3),

  recoveryThreshold: Number(process.env.RECOVERY_THRESHOLD ?? 2),

  probeTimeout: Number(process.env.PROBE_TIMEOUT ?? 5000),

  telegramToken: required("TELEGRAM_BOT_TOKEN"),

  telegramChatId: required("TELEGRAM_CHAT_ID"),

  baleToken: required("BALE_BOT_TOKEN"),

  baleChatId: required("BALE_CHAT_ID"),
};
