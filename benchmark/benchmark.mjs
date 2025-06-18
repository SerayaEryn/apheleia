import simpleFormat from "./benchmarkSimpleFormat.mjs";
import jsonFormat from "./benchmarkJsonFormat.mjs";
import childLogging from "./benchmarkChildLogging.mjs";
import childChildLogging from "./benchmarkChildChildLogging.mjs";
import childCreation from "./benchmarkChildCreation.mjs";
import objectJsonFormat from "./benchmarkObjectJsonFormat.mjs";

async function benchmark() {
  await simpleFormat();
  await jsonFormat();
  await childLogging();
  await childChildLogging();
  await childCreation();
  await objectJsonFormat();
}

benchmark();
