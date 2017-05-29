/**
 * Created by Amagi on 5/29/2017.
 */
(function(exports) {

  const CONSTRUCT = {}

  function LJBigInteger(n, s, token) {
    if (token !== CONSTRUCT) {
      if (n instanceof LJBigInteger) {
        return n
      } else if (typeof n === 'undefined') {
        return ZERO
      }
      return LJBigInteger.parse(n)
    }

    n = n || []  // Provide the nullary constructor for subclasses.
    while (n.length && !n[n.length - 1]) {
      --n.length
    }
    this._d = n
    this._s = n.length ? (s || 1) : 0
  }

  LJBigInteger._construct = function(n, s) {
    return new LJBigInteger(n, s, CONSTRUCT)
  }

  exports.LJBigInteger = LJBigInteger
})(typeof exports !== 'undefined' ? exports : this)
