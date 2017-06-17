/*
 * @Author: Lyp 
 * @Date: 2017-06-15 17:33:14 
 * @Last Modified by: Lyp
 * @Last Modified time: 2017-06-15 18:06:23
 */

export const formatPrice = (value) => {
  if (typeof value !== 'number') {
    throw Error('请传入数字')
  }
  return (value || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
}
