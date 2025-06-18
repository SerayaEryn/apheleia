const DEFAULT_LEVELS = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
  SILENT: Infinity,
};
const DEFAULT_LEVEL = "INFO";
const propertiesToIgnore = ["serializers", "genReqId"];

export { DEFAULT_LEVELS, DEFAULT_LEVEL, propertiesToIgnore };
