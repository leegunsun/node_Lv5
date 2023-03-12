const { createLogger, transports, format } = require("winston");
const { combine, timestamp, json, colorize, printf, label } = format;

const WinstonDaily = require("winston-daily-rotate-file");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

// print 형식(최종 출력)을 커스텀 할 수 있다.
const printFormat = printf(({ timestamp, label, level, message }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
});

// fotmat 속성을 combine을 통해서 커스텀 할 수 있다.
const printLogFormat = combine(
  label({
    label: "에러 테스트",
  }),
  //   colorize(),
  timestamp({
    format: "YYYY-MM-DD HH:mm:dd",
  }),
  printFormat
);

const logger = createLogger({
  transports: [
    // 지정한 파일과 폴더의 경로로 자동으로 로그를 생성 할 수 있게 해준다.
    new transports.File({
      filename: "access.log",
      dirname: "./logs",
      level: "info",
      format: printLogFormat,
    }),

    // error 레벨 로그를 저장할 파일 설정
    new WinstonDaily({
      level: "error",
      datePattern: "YYYY-MM-DD",
      dirname: path.join(__dirname, "../logs/error"),
      filename: "%DATE%.error.log",
      maxFiles: 30,
      zippedArchive: true,
      format: printLogFormat,
    }),

    // 모든 레벨 로그를 저장할 파일 설정
    // new WinstonDaily({
    //   level: "debug",
    //   datePattern: "YYYY-MM-DD",
    //   dirname: path.join(__dirname, "../logs/all"),
    //   filename: "%DATE%.all.log",
    //   maxFiles: 7,
    //   zippedArchive: true,
    //   format: printLogFormat,
    // }),
  ],
});

// 환경변수를 판별하여 dev에서 작동시 console를 출력하게 해준다.
if (process.env.NODE_ENVI == "dev") {
  logger.add(
    new transports.Console({
      level: "info",
      format: printLogFormat,
    })
  );
}

module.exports = logger;
