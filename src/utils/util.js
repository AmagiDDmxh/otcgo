/*
 * @Author: Lyp 
 * @Date: 2017-06-15 17:33:14 
 * @Last Modified by: Lyp
 * @Last Modified time: 2017-06-20 20:54:17
 */

export const formatPrice = (value) => {
  if (typeof value !== 'number') {
    throw Error('请传入数字')
  }
  return (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}

// Find data from balances
export const findBalances = (balances, marketSign) => {
  return balances.filter(item => item.marketSign === marketSign)
}

/**
 * Fill array when length less num
 * @param {*} array 
 * @param {*} num 
 * @param {*} node 
 */
export const fillArray = (array, num, node) => {
  if (typeof array !== 'object' && !(array instanceof Array)) return console.warn('the first argument must be Array')
  if (array.length < num) {
    while (num - array.length) {
      array.push(node)
    }
  }
  return array
}