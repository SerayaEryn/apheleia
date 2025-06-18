import test from "ava";
import { Transport } from "../lib/Apheleia.mjs";

test("should call format.formatMetaData()", (t) => {
  t.plan(1);
  const format = {
    formatMetaData() {
      t.pass();
    },
  };
  const transport = new Transport({ format });

  transport.formatMetaData();
});
