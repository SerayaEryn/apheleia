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

module.exports = {
  addMethodsForLevelsSym,
  formatSym,
  levelsArraySym,
  levelStringSym,
  levelSym,
  levelsSym,
  transportsSym,
  preparedMetasSym,
  prepareMetaSym,
  stderrLevelsSym,
  streamSym
}
