import test from "ava";
import { SimpleFormat } from "../lib/Apheleia.mjs";

test("should handle undefined meta", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const preparedMeta = format.formatMetaDataObject();

  t.is(preparedMeta, "");
});

test("should handle undefined value", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const preparedMeta = format.formatMetaData("key");

  t.is(preparedMeta, "");
});

test("simple message", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.transform("INFO", "hello world", [], undefined);

  t.true(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line),
  );
});

test("should not log serializers & genReqId", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.transform(
    "INFO",
    "hello world",
    [{ serializers: null, genReqId: null }],
    undefined,
  );

  t.true(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line),
  );
});

test("simple message with object with null/undefined", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.transform(
    "INFO",
    "hello world",
    [{ test1: null, test2: undefined }],
    undefined,
  );

  t.true(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world test1=null/.test(
      line,
    ),
  );
});

test("undefined arg", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.transform("INFO", "hello world", [undefined], undefined);

  t.true(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line),
  );
});

test("simple message with timestamp caching", (t) => {
  t.plan(1);
  const format = new SimpleFormat({ fastTimestamp: true });

  const line = format.transform("INFO", "hello world", [], undefined);

  t.true(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z INFO hello world/.test(line),
  );
});

test("should ignore serializers property", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.formatMetaDataObject({ serializers: 42, genReqId: null });

  t.is(line, "");
});

test("should ignore level property", (t) => {
  t.plan(1);
  const format = new SimpleFormat();

  const line = format.formatMetaDataObject({ level: 42 });

  t.is(line, "");
});
