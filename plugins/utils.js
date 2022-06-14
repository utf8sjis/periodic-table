const utils = {
  /**
   * 原子番号からelementListのインデクスを返す
   * 見つからなかった場合は-1を返す
   * @param {number} atomicNumber - 原子番号
   * @returns {number} elementListのインデクスか-1
   */
  atomicNumberToIndex(atomicNumber, elementList) {
    return elementList.findIndex(
      (element) => element.atomicNumber === atomicNumber
    )
  },
}

export default ({ app }, inject) => {
  inject('utils', utils)
}
