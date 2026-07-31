import winston from 'winston';

const isDebug = process.env.CYBERQUEST_DEBUG === 'true';

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    const metaStr = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

const logger = winston.createLogger({
  level: 'debug',
  format,
  transports: [
    new winston.transports.Console({
      format,
    }),
  ],
});

export function traceUnlockFlow(step: string, data: Record<string, unknown>) {
  if (!isDebug) return;
  logger.debug(`[UnlockTrace] ${step}`, data);
}

export function traceProgressFlow(step: string, data: Record<string, unknown>) {
  if (!isDebug) return;
  logger.debug(`[ProgressTrace] ${step}`, data);
}

export default logger;
