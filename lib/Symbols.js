'use strict'

const addMethodsForLevelsSym = Symbol('apheleia.addMethodsForLevels')
const transportsSym = Symbol('apheleia.transports')
const levelsArraySym = Symbol('apheleia.levelsArray')
const levelsSym = Symbol('apheleia.levels')
const levelSym = Symbol('apheleia.level')
const preparedMetasSym = Symbol('apheleia.preparedMeta')
const prepareMetaSym = Symbol('apheleia.prepareMeta')
const levelStringSym = Symbol('apheleia.levelString')
const stderrLevelsSym = Symbol('apheleia.stderrLevels')
const streamSym = Symbol('apheleia.stream')
const formatSym = Symbol('apheleia.format')
const logSym = Symbol('apheleia.log')
const dateFormatterSym = Symbol('apheleia.dateFormatter')
const rawMetaSym = Symbol('apheleia.rawMeta')
const areMetaPreparedSym = Symbol('apheleia.areMetaPrepared')

module.exports = {
  addMethodsForLevelsSym,
  dateFormatterSym,
  formatSym,
  levelsArraySym,
  levelStringSym,
  levelSym,
  levelsSym,
  logSym,
  transportsSym,
  preparedMetasSym,
  prepareMetaSym,
  stderrLevelsSym,
  streamSym,
  rawMetaSym,
  areMetaPreparedSym
}
