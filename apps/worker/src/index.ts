import pino from "pino";

const logger = pino({ name: "reviewhub-worker" });

logger.info("Worker scaffold booted.");
