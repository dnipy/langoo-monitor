# Langoo Monitor

A lightweight, extensible service-monitoring system built with TypeScript and Node.js.

Langoo Monitor periodically checks the health of application and infrastructure services, tracks health transitions, and sends alerts when services go down or recover.

## Features

- **Extensible probe architecture** — Add new monitored services by implementing the `Probe` interface.
- **Service health monitoring** — Monitor APIs, frontend, worker, Redis, PostgreSQL, PgBouncer, MongoDB, and Caddy.
- **Failure and recovery thresholds** — Avoid noisy alerts caused by transient failures.
- **Event-driven alerting** — Decouple monitoring logic from notification channels through an event bus.
- **Multiple notification channels** — Console, Telegram, and Bale.
- **Latency tracking** — Include probe latency in health results and alerts.
- **Environment-based configuration** — Configure monitoring and notification behavior through environment variables.
- **Docker support** — Multi-stage production image with development dependencies removed.
- **TypeScript** — Strong typing across probes, events, results, and monitoring components.

## Architecture

```text
                         ┌──────────────────┐
                         │     Scheduler    │
                         │  Periodic checks │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │     Registry     │
                         │ Registered probes│
                         └────────┬─────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │           Probes          │
                    │ API · Redis · PostgreSQL  │
                    │ MongoDB · Caddy · Worker  │
                    │ Frontend · PgBouncer      │
                    └─────────────┬─────────────┘
                                  │
                         ┌────────▼─────────┐
                         │   StateManager   │
                         │ Failure/recovery │
                         │    thresholds    │
                         └────────┬─────────┘
                                  │
                         ┌────────▼─────────┐
                         │     EventBus     │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 ▼                ▼                ▼
          ┌────────────┐   ┌────────────┐   ┌────────────┐
          │  Console   │   │  Telegram  │   │    Bale    │
          │  Listener  │   │  Notifier  │   │  Notifier  │
          └────────────┘   └────────────┘   └────────────┘
```

## Project Structure

```text
src/
├── alerts/
│   ├── base.ts
│   ├── bale.listener.ts
│   ├── console.listener.ts
│   └── telegram.listener.ts
├── config/
│   ├── env.ts
│   └── index.ts
├── core/
│   ├── event-bus.ts
│   ├── monitor.ts
│   ├── registry.ts
│   ├── scheduler.ts
│   └── state-manager.ts
├── logger/
│   └── index.ts
├── probes/
│   ├── base.ts
│   ├── api.probe.ts
│   ├── bouncer.probe.ts
│   ├── caddy.probe.ts
│   ├── frontend.probe.ts
│   ├── mongo.probe.ts
│   ├── pg.probe.ts
│   ├── redis.probe.ts
│   └── worker.probe.ts
├── types/
│   ├── event-listener.ts
│   ├── monitor-event.ts
│   ├── probe-listener.ts
│   ├── probe-result.ts
│   └── probe.ts
└── index.ts
```

## How It Works

1. The `Scheduler` periodically executes all registered probes.
2. Each probe returns a health result containing its status, latency, and optional message.
3. The `StateManager` tracks the current state of each probe.
4. Consecutive failures and successful checks are counted according to configured thresholds.
5. When a meaningful state transition occurs, the `EventBus` emits a monitoring event.
6. Registered listeners receive the event and send notifications through their respective channels.

### Health State Transitions

```text
                    ┌─────────────────────┐
                    │       HEALTHY       │
                    └──────────┬──────────┘
                               │
                     Consecutive failures
                         reach threshold
                               │
                               ▼
                    ┌─────────────────────┐
                    │      UNHEALTHY      │
                    └──────────┬──────────┘
                               │
                     Consecutive successes
                         reach threshold
                               │
                               ▼
                    ┌─────────────────────┐
                    │       HEALTHY       │
                    └─────────────────────┘
```

An alert is emitted only when the configured threshold is reached, helping reduce false positives and notification noise.

## Monitored Services

The current implementation includes probes for:

| Probe            | Purpose                        |
| ---------------- | ------------------------------ |
| `ApiProbe`       | Checks the application API     |
| `WorkerProbe`    | Checks the background worker   |
| `RedisProbe`     | Checks Redis availability      |
| `PostgresProbe`  | Checks PostgreSQL availability |
| `PgBouncerProbe` | Checks PgBouncer availability  |
| `MongoProbe`     | Checks MongoDB availability    |
| `FrontendProbe`  | Checks frontend availability   |
| `CaddyProbe`     | Checks Caddy availability      |

## Alert Channels

### Console

Console logging is always registered.

### Telegram

Telegram notifications are registered when:

```env
NODE_ENV=production
```

### Bale

Bale notifications are registered when:

```env
NODE_ENV=production
```

## Configuration

Create a `.env` file based on the provided example:

```bash
cp .env.sample .env
```

Configure the required environment variables in `.env`.

> Never commit your `.env` file or expose notification tokens and other secrets.

## Installation

### Prerequisites

- Node.js 22+
- npm

### Install dependencies

```bash
npm ci
```

### Development

```bash
npm run start:dev
```

### Build

```bash
npm run build
```

### Run the compiled application

```bash
npm start
```

> The exact available scripts are defined in `package.json`.

## Docker

The project includes a multi-stage Dockerfile.

### Build the image

```bash
docker build -t langoo-monitor .
```

### Run the container

```bash
docker run --env-file .env langoo-monitor
```

The production image:

- Uses Node.js 22 Alpine.
- Installs dependencies in a builder stage.
- Builds the TypeScript application.
- Removes development dependencies.
- Runs as the non-root `node` user.
- Starts the compiled application from `dist/index.js`.

## Adding a New Probe

Implement the `Probe` interface and register the probe in `src/index.ts`.

Example:

```ts
import { Probe } from "../types/probe";
import { ProbeResult } from "../types/probe-result";

export class ExampleProbe implements Probe {
  readonly id = "example";
  readonly displayName = "Example Service";

  async check(): Promise<ProbeResult> {
    return {
      status: "HEALTHY",
      latency: 0,
    };
  }
}
```

Then register it:

```ts
monitor.register(new ExampleProbe());
```

> The exact `Probe` and `ProbeResult` types should be followed when implementing a real probe.

## Design Principles

- **Separation of concerns** — Probes, scheduling, state management, and notifications have distinct responsibilities.
- **Open for extension** — New probes and alert listeners can be added without changing the core monitoring flow.
- **Event-driven communication** — State transitions are communicated through events rather than direct dependencies on notification channels.
- **Noise reduction** — Failure and recovery thresholds prevent alerts for isolated transient failures.
- **Simple deployment** — The application is packaged as a small production-oriented Docker image.

## License

This project is private and intended for internal use.
