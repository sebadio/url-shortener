import { pino } from "pino";
import fs from "fs";

const logsPath = "./logs";
const logsFileName = "warn-errors.log";

if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath, { recursive: true });
}

const consoleTransport = pino.transport({
  target: "pino-pretty",
  options: { colorize: true },
  level: "trace",
});

const fileDestination = pino.destination({
  dest: `${logsPath}/${logsFileName}`,
  sync: false,
  minLength: 4096,
});

const logger = pino(
  { level: "trace" },
  pino.multistream([
    {
      stream: consoleTransport,
    },
    {
      level: "warn",
      stream: fileDestination,
    },
  ])
);

export const flushLogger = () => () => {
  fileDestination.flushSync();
  setTimeout(() => process.exit(0), 100);
};

export default logger;
