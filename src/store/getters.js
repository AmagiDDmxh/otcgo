/**
 * Created by Administrator on 3/26/2017.
 */
let _check = [ 'add r', 'pk c', 'pb k', 'pk r' ];

export const ADD = state => state.wa['add r']
export const HAS = state => _check.every(f => state.wa.hasOwnProperty(f))

export default { ADD, HAS }