import { Monitor } from "./core/monitor";
import { ApiProbe } from "./probes/api.probe";
import { PgBouncerProbe } from "./probes/bouncer.probe";
import { CaddyProbe } from "./probes/caddy.probe";
import { FrontendProbe } from "./probes/frontend.probe";
import { MongoProbe } from "./probes/mongo.probe";
import { PostgresProbe } from "./probes/pg.probe";
import { RedisProbe } from "./probes/redis.probe";
import { WorkerProbe } from "./probes/worker.probe";

const monitor = new Monitor();

monitor.register(new ApiProbe());
monitor.register(new WorkerProbe());
monitor.register(new RedisProbe());
monitor.register(new PostgresProbe());
monitor.register(new PgBouncerProbe());
monitor.register(new MongoProbe());
monitor.register(new FrontendProbe());
monitor.register(new CaddyProbe());

monitor.start();
