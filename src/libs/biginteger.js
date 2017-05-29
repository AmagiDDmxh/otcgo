/*
	JavaScript BigInteger library version 0.9.1
	http://silentmatt.com/biginteger/

	Copyright (c) 2009 Matthew Crumley <email@matthewcrumley.com>
	Copyright (c) 2010,2011 by John Tobey <John.Tobey@gmail.com>
	Licensed under the MIT license.

	Support for arbitrary internal representation base was added by
	Vitaly Magerya.
*/

/*
	File: biginteger.js

	Exports:

		<BigInteger>
*/
(function(exports) {
  'use strict'
/*
	Class: LJBigInteger
	An arbitrarily-large integer.

	<LJBigInteger> objects should be considered immutable. None of the "built-in"
	methods modify *this* or their arguments. All properties should be
	considered private.

	All the methods of <LJBigInteger> instances can be called "statically". The
	static versions are convenient if you don't already have a <LJBigInteger>
	object.

	As an example, these calls are equivalent.

	> LJBigInteger(4).multiply(5); // returns LJBigInteger(20);
	> LJBigInteger.multiply(4, 5); // returns LJBigInteger(20);

	> var a = 42;
	> var a = LJBigInteger.toJSValue("0b101010"); // Not completely useless...
*/

  var CONSTRUCT = {} // Unique token to call "private" version of constructor

/*
	Constructor: LJBigInteger()
	Convert a value to a <LJBigInteger>.

	Although <LJBigInteger()> is the constructor for <LJBigInteger> objects, it is
	best not to call it as a constructor. If *n* is a <LJBigInteger> object, it is
	simply returned as-is. Otherwise, <LJBigInteger()> is equivalent to <parse>
	without a radix argument.

	> var n0 = LJBigInteger();      // Same as <LJBigInteger.ZERO>
	> var n1 = LJBigInteger("123"); // Create a new <LJBigInteger> with value 123
	> var n2 = LJBigInteger(123);   // Create a new <LJBigInteger> with value 123
	> var n3 = LJBigInteger(n2);    // Return n2, unchanged

	The constructor form only takes an array and a sign. *n* must be an
	array of numbers in little-endian order, where each digit is between 0
	and LJBigInteger.base.  The second parameter sets the sign: -1 for
	negative, +1 for positive, or 0 for zero. The array is *not copied and
	may be modified*. If the array contains only zeros, the sign parameter
	is ignored and is forced to zero.

	> new LJBigInteger([5], -1): create a new LJBigInteger with value -5

	Parameters:

		n - Value to convert to a <LJBigInteger>.

	Returns:

		A <LJBigInteger> value.

	See Also:

		<parse>, <LJBigInteger>
*/
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

// Base-10 speedup hacks in parse, toString, exp10 and log functions
// require base to be a power of 10. 10^7 is the largest such power
// that won't cause a precision loss when digits are multiplied.
  var LJBigInteger_base = 10000000
  var LJBigInteger_base_log10 = 7

  LJBigInteger.base = LJBigInteger_base
  LJBigInteger.base_log10 = LJBigInteger_base_log10

  var ZERO = new LJBigInteger([], 0, CONSTRUCT)
// Constant: ZERO
// <LJBigInteger> 0.
  LJBigInteger.ZERO = ZERO

  var ONE = new LJBigInteger([1], 1, CONSTRUCT)
// Constant: ONE
// <LJBigInteger> 1.
  LJBigInteger.ONE = ONE

  var M_ONE = new LJBigInteger(ONE._d, -1, CONSTRUCT)
// Constant: M_ONE
// <LJBigInteger> -1.
  LJBigInteger.M_ONE = M_ONE

// Constant: _0
// Shortcut for <ZERO>.
  LJBigInteger._0 = ZERO

// Constant: _1
// Shortcut for <ONE>.
  LJBigInteger._1 = ONE

/*
	Constant: small
	Array of <LJBigIntegers> from 0 to 36.

	These are used internally for parsing, but useful when you need a "small"
	<LJBigInteger>.

	See Also:

		<ZERO>, <ONE>, <_0>, <_1>
*/
  LJBigInteger.small = [
    ZERO,
    ONE,
	/* Assuming LJBigInteger_base > 36 */
    new LJBigInteger([2], 1, CONSTRUCT),
    new LJBigInteger([3], 1, CONSTRUCT),
    new LJBigInteger([4], 1, CONSTRUCT),
    new LJBigInteger([5], 1, CONSTRUCT),
    new LJBigInteger([6], 1, CONSTRUCT),
    new LJBigInteger([7], 1, CONSTRUCT),
    new LJBigInteger([8], 1, CONSTRUCT),
    new LJBigInteger([9], 1, CONSTRUCT),
    new LJBigInteger([10], 1, CONSTRUCT),
    new LJBigInteger([11], 1, CONSTRUCT),
    new LJBigInteger([12], 1, CONSTRUCT),
    new LJBigInteger([13], 1, CONSTRUCT),
    new LJBigInteger([14], 1, CONSTRUCT),
    new LJBigInteger([15], 1, CONSTRUCT),
    new LJBigInteger([16], 1, CONSTRUCT),
    new LJBigInteger([17], 1, CONSTRUCT),
    new LJBigInteger([18], 1, CONSTRUCT),
    new LJBigInteger([19], 1, CONSTRUCT),
    new LJBigInteger([20], 1, CONSTRUCT),
    new LJBigInteger([21], 1, CONSTRUCT),
    new LJBigInteger([22], 1, CONSTRUCT),
    new LJBigInteger([23], 1, CONSTRUCT),
    new LJBigInteger([24], 1, CONSTRUCT),
    new LJBigInteger([25], 1, CONSTRUCT),
    new LJBigInteger([26], 1, CONSTRUCT),
    new LJBigInteger([27], 1, CONSTRUCT),
    new LJBigInteger([28], 1, CONSTRUCT),
    new LJBigInteger([29], 1, CONSTRUCT),
    new LJBigInteger([30], 1, CONSTRUCT),
    new LJBigInteger([31], 1, CONSTRUCT),
    new LJBigInteger([32], 1, CONSTRUCT),
    new LJBigInteger([33], 1, CONSTRUCT),
    new LJBigInteger([34], 1, CONSTRUCT),
    new LJBigInteger([35], 1, CONSTRUCT),
    new LJBigInteger([36], 1, CONSTRUCT)
  ]

// Used for parsing/radix conversion
  LJBigInteger.digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

/*
	Method: toString
	Convert a <LJBigInteger> to a string.

	When *base* is greater than 10, letters are upper case.

	Parameters:

		base - Optional base to represent the number in (default is base 10).
		       Must be between 2 and 36 inclusive, or an Error will be thrown.

	Returns:

		The string representation of the <LJBigInteger>.
*/
  LJBigInteger.prototype.toString = function(base) {
    base = +base || 10
    if (base < 2 || base > 36) {
      throw new Error('illegal radix ' + base + '.')
    }
    if (this._s === 0) {
      return '0'
    }
    if (base === 10) {
      var str = this._s < 0 ? '-' : ''
      str += this._d[this._d.length - 1].toString()
      for (var i = this._d.length - 2; i >= 0; i--) {
        var group = this._d[i].toString()
        while (group.length < LJBigInteger_base_log10) group = '0' + group
        str += group
      }
      return str
    } else {
      var numerals = LJBigInteger.digits
      base = LJBigInteger.small[base]
      var sign = this._s

      var n = this.abs()
      var digits = []
      var digit

      while (n._s !== 0) {
        var divmod = n.divRem(base)
        n = divmod[0]
        digit = divmod[1]
			// TODO: This could be changed to unshift instead of reversing at the end.
			// Benchmark both to compare speeds.
        digits.push(numerals[digit.valueOf()])
      }
      return (sign < 0 ? '-' : '') + digits.reverse().join('')
    }
  }

// Verify strings for parsing
  LJBigInteger.radixRegex = [
    /^$/,
    /^$/,
    /^[01]*$/,
    /^[012]*$/,
    /^[0-3]*$/,
    /^[0-4]*$/,
    /^[0-5]*$/,
    /^[0-6]*$/,
    /^[0-7]*$/,
    /^[0-8]*$/,
    /^[0-9]*$/,
    /^[0-9aA]*$/,
    /^[0-9abAB]*$/,
    /^[0-9abcABC]*$/,
    /^[0-9a-dA-D]*$/,
    /^[0-9a-eA-E]*$/,
    /^[0-9a-fA-F]*$/,
    /^[0-9a-gA-G]*$/,
    /^[0-9a-hA-H]*$/,
    /^[0-9a-iA-I]*$/,
    /^[0-9a-jA-J]*$/,
    /^[0-9a-kA-K]*$/,
    /^[0-9a-lA-L]*$/,
    /^[0-9a-mA-M]*$/,
    /^[0-9a-nA-N]*$/,
    /^[0-9a-oA-O]*$/,
    /^[0-9a-pA-P]*$/,
    /^[0-9a-qA-Q]*$/,
    /^[0-9a-rA-R]*$/,
    /^[0-9a-sA-S]*$/,
    /^[0-9a-tA-T]*$/,
    /^[0-9a-uA-U]*$/,
    /^[0-9a-vA-V]*$/,
    /^[0-9a-wA-W]*$/,
    /^[0-9a-xA-X]*$/,
    /^[0-9a-yA-Y]*$/,
    /^[0-9a-zA-Z]*$/
  ]

/*
	Function: parse
	Parse a string into a <LJBigInteger>.

	*base* is optional but, if provided, must be from 2 to 36 inclusive. If
	*base* is not provided, it will be guessed based on the leading characters
	of *s* as follows:

	- "0x" or "0X": *base* = 16
	- "0c" or "0C": *base* = 8
	- "0b" or "0B": *base* = 2
	- else: *base* = 10

	If no base is provided, or *base* is 10, the number can be in exponential
	form. For example, these are all valid:

	> LJBigInteger.parse("1e9");              // Same as "1000000000"
	> LJBigInteger.parse("1.234*10^3");       // Same as 1234
	> LJBigInteger.parse("56789 * 10 ** -2"); // Same as 567

	If any characters fall outside the range defined by the radix, an exception
	will be thrown.

	Parameters:

		s - The string to parse.
		base - Optional radix (default is to guess based on *s*).

	Returns:

		a <LJBigInteger> instance.
*/
  LJBigInteger.parse = function(s, base) {
	// Expands a number in exponential form to decimal form.
	// expandExponential("-13.441*10^5") === "1344100";
	// expandExponential("1.12300e-1") === "0.112300";
	// expandExponential(1000000000000000000000000000000) === "1000000000000000000000000000000";
    function expandExponential(str) {
      str = str.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/, 'e')

      return str.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/, function(x, s, n, f, c) {
        c = +c
        var l = c < 0
        var i = n.length + c
        x = (l ? n : f).length
        c = ((c = Math.abs(c)) >= x ? c - x + l : 0)
        var z = (new Array(c + 1)).join('0')
        var r = n + f
        return (s || '') + (l ? r = z + r : r += z).substr(0, i += l ? z.length : 0) + (i < r.length ? '.' + r.substr(i) : '')
      })
    }

    s = s.toString()
    if (typeof base === 'undefined' || +base === 10) {
      s = expandExponential(s)
    }

    var prefixRE
    if (typeof base === 'undefined') {
      prefixRE = '0[xcb]'
    } else if (base == 16) {
      prefixRE = '0x'
    } else if (base == 8) {
      prefixRE = '0c'
    } else if (base == 2) {
      prefixRE = '0b'
    } else {
      prefixRE = ''
    }
    var parts = new RegExp('^([+\\-]?)(' + prefixRE + ')?([0-9a-z]*)(?:\\.\\d*)?$', 'i').exec(s)
    if (parts) {
      var sign = parts[1] || '+'
      var baseSection = parts[2] || ''
      var digits = parts[3] || ''

      if (typeof base === 'undefined') {
			// Guess base
        if (baseSection === '0x' || baseSection === '0X') { // Hex
          base = 16
        } else if (baseSection === '0c' || baseSection === '0C') { // Octal
          base = 8
        } else if (baseSection === '0b' || baseSection === '0B') { // Binary
          base = 2
        } else {
          base = 10
        }
      }		else if (base < 2 || base > 36) {
        throw new Error('Illegal radix ' + base + '.')
      }

      base = +base

		// Check for digits outside the range
      if (!(LJBigInteger.radixRegex[base].test(digits))) {
        throw new Error('Bad digit for radix ' + base)
      }

		// Strip leading zeros, and convert to array
      digits = digits.replace(/^0+/, '').split('')
      if (digits.length === 0) {
        return ZERO
      }

		// Get the sign (we know it's not zero)
      sign = (sign === '-') ? -1 : 1

		// Optimize 10
      if (base == 10) {
        var d = []
        while (digits.length >= LJBigInteger_base_log10) {
          d.push(parseInt(digits.splice(digits.length - LJBigInteger.base_log10, LJBigInteger.base_log10).join(''), 10))
        }
        d.push(parseInt(digits.join(''), 10))
        return new LJBigInteger(d, sign, CONSTRUCT)
      }

		// Do the conversion
      var d = ZERO
      base = LJBigInteger.small[base]
      var small = LJBigInteger.small
      for (var i = 0; i < digits.length; i++) {
        d = d.multiply(base).add(small[parseInt(digits[i], 36)])
      }
      return new LJBigInteger(d._d, sign, CONSTRUCT)
    } else {
      throw new Error('Invalid LJBigInteger format: ' + s)
    }
  }

/*
	Function: add
	Add two <LJBigIntegers>.

	Parameters:

		n - The number to add to *this*. Will be converted to a <LJBigInteger>.

	Returns:

		The numbers added together.

	See Also:

		<subtract>, <multiply>, <quotient>, <next>
*/
  LJBigInteger.prototype.add = function(n) {
    if (this._s === 0) {
      return LJBigInteger(n)
    }

    n = LJBigInteger(n)
    if (n._s === 0) {
      return this
    }
    if (this._s !== n._s) {
      n = n.negate()
      return this.subtract(n)
    }

    var a = this._d
    var b = n._d
    var al = a.length
    var bl = b.length
    var sum = new Array(Math.max(al, bl) + 1)
    var size = Math.min(al, bl)
    var carry = 0
    var digit

    for (var i = 0; i < size; i++) {
      digit = a[i] + b[i] + carry
      sum[i] = digit % LJBigInteger_base
      carry = (digit / LJBigInteger_base) | 0
    }
    if (bl > al) {
      a = b
      al = bl
    }
    for (i = size; carry && i < al; i++) {
      digit = a[i] + carry
      sum[i] = digit % LJBigInteger_base
      carry = (digit / LJBigInteger_base) | 0
    }
    if (carry) {
      sum[i] = carry
    }

    for (; i < al; i++) {
      sum[i] = a[i]
    }

    return new LJBigInteger(sum, this._s, CONSTRUCT)
  }

/*
	Function: negate
	Get the additive inverse of a <LJBigInteger>.

	Returns:

		A <LJBigInteger> with the same magnatude, but with the opposite sign.

	See Also:

		<abs>
*/
  LJBigInteger.prototype.negate = function() {
    return new LJBigInteger(this._d, (-this._s) | 0, CONSTRUCT)
  }

/*
	Function: abs
	Get the absolute value of a <LJBigInteger>.

	Returns:

		A <LJBigInteger> with the same magnatude, but always positive (or zero).

	See Also:

		<negate>
*/
  LJBigInteger.prototype.abs = function() {
    return (this._s < 0) ? this.negate() : this
  }

/*
	Function: subtract
	Subtract two <LJBigIntegers>.

	Parameters:

		n - The number to subtract from *this*. Will be converted to a <LJBigInteger>.

	Returns:

		The *n* subtracted from *this*.

	See Also:

		<add>, <multiply>, <quotient>, <prev>
*/
  LJBigInteger.prototype.subtract = function(n) {
    if (this._s === 0) {
      return LJBigInteger(n).negate()
    }

    n = LJBigInteger(n)
    if (n._s === 0) {
      return this
    }
    if (this._s !== n._s) {
      n = n.negate()
      return this.add(n)
    }

    var m = this
	// negative - negative => -|a| - -|b| => -|a| + |b| => |b| - |a|
    if (this._s < 0) {
      m = new LJBigInteger(n._d, 1, CONSTRUCT)
      n = new LJBigInteger(this._d, 1, CONSTRUCT)
    }

	// Both are positive => a - b
    var sign = m.compareAbs(n)
    if (sign === 0) {
      return ZERO
    } else if (sign < 0) {
		// swap m and n
      var t = n
      n = m
      m = t
    }

	// a > b
    var a = m._d
    var b = n._d
    var al = a.length
    var bl = b.length
    var diff = new Array(al) // al >= bl since a > b
    var borrow = 0
    var i
    var digit

    for (i = 0; i < bl; i++) {
      digit = a[i] - borrow - b[i]
      if (digit < 0) {
        digit += LJBigInteger_base
        borrow = 1
      } else {
        borrow = 0
      }
      diff[i] = digit
    }
    for (i = bl; i < al; i++) {
      digit = a[i] - borrow
      if (digit < 0) {
        digit += LJBigInteger_base
      } else {
        diff[i++] = digit
        break
      }
      diff[i] = digit
    }
    for (; i < al; i++) {
      diff[i] = a[i]
    }

    return new LJBigInteger(diff, sign, CONSTRUCT)
  };

  (function() {
    function addOne(n, sign) {
      var a = n._d
      var sum = a.slice()
      var carry = true
      var i = 0

      while (true) {
        var digit = (a[i] || 0) + 1
        sum[i] = digit % LJBigInteger_base
        if (digit <= LJBigInteger_base - 1) {
          break
        }
        ++i
      }

      return new LJBigInteger(sum, sign, CONSTRUCT)
    }

    function subtractOne(n, sign) {
      var a = n._d
      var sum = a.slice()
      var borrow = true
      var i = 0

      while (true) {
        var digit = (a[i] || 0) - 1
        if (digit < 0) {
          sum[i] = digit + LJBigInteger_base
        } else {
          sum[i] = digit
          break
        }
        ++i
      }

      return new LJBigInteger(sum, sign, CONSTRUCT)
    }

	/*
		Function: next
		Get the next <LJBigInteger> (add one).

		Returns:

			*this* + 1.

		See Also:

			<add>, <prev>
	*/
    LJBigInteger.prototype.next = function() {
      switch (this._s) {
        case 0:
          return ONE
        case -1:
          return subtractOne(this, -1)
		// case 1:
        default:
          return addOne(this, 1)
      }
    }

	/*
		Function: prev
		Get the previous <LJBigInteger> (subtract one).

		Returns:

			*this* - 1.

		See Also:

			<next>, <subtract>
	*/
    LJBigInteger.prototype.prev = function() {
      switch (this._s) {
        case 0:
          return M_ONE
        case -1:
          return addOne(this, -1)
		// case 1:
        default:
          return subtractOne(this, 1)
      }
    }
  })()

/*
	Function: compareAbs
	Compare the absolute value of two <LJBigIntegers>.

	Calling <compareAbs> is faster than calling <abs> twice, then <compare>.

	Parameters:

		n - The number to compare to *this*. Will be converted to a <LJBigInteger>.

	Returns:

		-1, 0, or +1 if *|this|* is less than, equal to, or greater than *|n|*.

	See Also:

		<compare>, <abs>
*/
  LJBigInteger.prototype.compareAbs = function(n) {
    if (this === n) {
      return 0
    }

    if (!(n instanceof LJBigInteger)) {
      if (!isFinite(n)) {
        return (isNaN(n) ? n : -1)
      }
      n = LJBigInteger(n)
    }

    if (this._s === 0) {
      return (n._s !== 0) ? -1 : 0
    }
    if (n._s === 0) {
      return 1
    }

    var l = this._d.length
    var nl = n._d.length
    if (l < nl) {
      return -1
    } else if (l > nl) {
      return 1
    }

    var a = this._d
    var b = n._d
    for (var i = l - 1; i >= 0; i--) {
      if (a[i] !== b[i]) {
        return a[i] < b[i] ? -1 : 1
      }
    }

    return 0
  }

/*
	Function: compare
	Compare two <LJBigIntegers>.

	Parameters:

		n - The number to compare to *this*. Will be converted to a <LJBigInteger>.

	Returns:

		-1, 0, or +1 if *this* is less than, equal to, or greater than *n*.

	See Also:

		<compareAbs>, <isPositive>, <isNegative>, <isUnit>
*/
  LJBigInteger.prototype.compare = function(n) {
    if (this === n) {
      return 0
    }

    n = LJBigInteger(n)

    if (this._s === 0) {
      return -n._s
    }

    if (this._s === n._s) { // both positive or both negative
      var cmp = this.compareAbs(n)
      return cmp * this._s
    } else {
      return this._s
    }
  }

/*
	Function: isUnit
	Return true iff *this* is either 1 or -1.

	Returns:

		true if *this* compares equal to <LJBigInteger.ONE> or <LJBigInteger.M_ONE>.

	See Also:

		<isZero>, <isNegative>, <isPositive>, <compareAbs>, <compare>,
		<LJBigInteger.ONE>, <LJBigInteger.M_ONE>
*/
  LJBigInteger.prototype.isUnit = function() {
    return this === ONE ||
		this === M_ONE ||
		(this._d.length === 1 && this._d[0] === 1)
  }

/*
	Function: multiply
	Multiply two <LJBigIntegers>.

	Parameters:

		n - The number to multiply *this* by. Will be converted to a
		<LJBigInteger>.

	Returns:

		The numbers multiplied together.

	See Also:

		<add>, <subtract>, <quotient>, <square>
*/
  LJBigInteger.prototype.multiply = function(n) {
	// TODO: Consider adding Karatsuba multiplication for large numbers
    if (this._s === 0) {
      return ZERO
    }

    n = LJBigInteger(n)
    if (n._s === 0) {
      return ZERO
    }
    if (this.isUnit()) {
      if (this._s < 0) {
        return n.negate()
      }
      return n
    }
    if (n.isUnit()) {
      if (n._s < 0) {
        return this.negate()
      }
      return this
    }
    if (this === n) {
      return this.square()
    }

    var r = (this._d.length >= n._d.length)
    var a = (r ? this : n)._d // a will be longer than b
    var b = (r ? n : this)._d
    var al = a.length
    var bl = b.length

    var pl = al + bl
    var partial = new Array(pl)
    var i
    for (i = 0; i < pl; i++) {
      partial[i] = 0
    }

    for (i = 0; i < bl; i++) {
      var carry = 0
      var bi = b[i]
      var jlimit = al + i
      var digit
      for (var j = i; j < jlimit; j++) {
        digit = partial[j] + bi * a[j - i] + carry
        carry = (digit / LJBigInteger_base) | 0
        partial[j] = (digit % LJBigInteger_base) | 0
      }
      if (carry) {
        digit = partial[j] + carry
        carry = (digit / LJBigInteger_base) | 0
        partial[j] = digit % LJBigInteger_base
      }
    }
    return new LJBigInteger(partial, this._s * n._s, CONSTRUCT)
  }

// Multiply a LJBigInteger by a single-digit native number
// Assumes that this and n are >= 0
// This is not really intended to be used outside the library itself
  LJBigInteger.prototype.multiplySingleDigit = function(n) {
    if (n === 0 || this._s === 0) {
      return ZERO
    }
    if (n === 1) {
      return this
    }

    var digit
    if (this._d.length === 1) {
      digit = this._d[0] * n
      if (digit >= LJBigInteger_base) {
        return new LJBigInteger([(digit % LJBigInteger_base) | 0,
          (digit / LJBigInteger_base) | 0], 1, CONSTRUCT)
      }
      return new LJBigInteger([digit], 1, CONSTRUCT)
    }

    if (n === 2) {
      return this.add(this)
    }
    if (this.isUnit()) {
      return new LJBigInteger([n], 1, CONSTRUCT)
    }

    var a = this._d
    var al = a.length

    var pl = al + 1
    var partial = new Array(pl)
    for (var i = 0; i < pl; i++) {
      partial[i] = 0
    }

    var carry = 0
    for (var j = 0; j < al; j++) {
      digit = n * a[j] + carry
      carry = (digit / LJBigInteger_base) | 0
      partial[j] = (digit % LJBigInteger_base) | 0
    }
    if (carry) {
      partial[j] = carry
    }

    return new LJBigInteger(partial, 1, CONSTRUCT)
  }

/*
	Function: square
	Multiply a <LJBigInteger> by itself.

	This is slightly faster than regular multiplication, since it removes the
	duplicated multiplcations.

	Returns:

		> this.multiply(this)

	See Also:
		<multiply>
*/
  LJBigInteger.prototype.square = function() {
	// Normally, squaring a 10-digit number would take 100 multiplications.
	// Of these 10 are unique diagonals, of the remaining 90 (100-10), 45 are repeated.
	// This procedure saves (N*(N-1))/2 multiplications, (e.g., 45 of 100 multiplies).
	// Based on code by Gary Darby, Intellitech Systems Inc., www.DelphiForFun.org

    if (this._s === 0) {
      return ZERO
    }
    if (this.isUnit()) {
      return ONE
    }

    var digits = this._d
    var length = digits.length
    var imult1 = new Array(length + length + 1)
    var product, carry, k
    var i

	// Calculate diagonal
    for (i = 0; i < length; i++) {
      k = i * 2
      product = digits[i] * digits[i]
      carry = (product / LJBigInteger_base) | 0
      imult1[k] = product % LJBigInteger_base
      imult1[k + 1] = carry
    }

	// Calculate repeating part
    for (i = 0; i < length; i++) {
      carry = 0
      k = i * 2 + 1
      for (var j = i + 1; j < length; j++, k++) {
        product = digits[j] * digits[i] * 2 + imult1[k] + carry
        carry = (product / LJBigInteger_base) | 0
        imult1[k] = product % LJBigInteger_base
      }
      k = length + i
      var digit = carry + imult1[k]
      carry = (digit / LJBigInteger_base) | 0
      imult1[k] = digit % LJBigInteger_base
      imult1[k + 1] += carry
    }

    return new LJBigInteger(imult1, 1, CONSTRUCT)
  }

/*
	Function: quotient
	Divide two <LJBigIntegers> and truncate towards zero.

	<quotient> throws an exception if *n* is zero.

	Parameters:

		n - The number to divide *this* by. Will be converted to a <LJBigInteger>.

	Returns:

		The *this* / *n*, truncated to an integer.

	See Also:

		<add>, <subtract>, <multiply>, <divRem>, <remainder>
*/
  LJBigInteger.prototype.quotient = function(n) {
    return this.divRem(n)[0]
  }

/*
	Function: divide
	Deprecated synonym for <quotient>.
*/
  LJBigInteger.prototype.divide = LJBigInteger.prototype.quotient

/*
	Function: remainder
	Calculate the remainder of two <LJBigIntegers>.

	<remainder> throws an exception if *n* is zero.

	Parameters:

		n - The remainder after *this* is divided *this* by *n*. Will be
		    converted to a <LJBigInteger>.

	Returns:

		*this* % *n*.

	See Also:

		<divRem>, <quotient>
*/
  LJBigInteger.prototype.remainder = function(n) {
    return this.divRem(n)[1]
  }

/*
	Function: divRem
	Calculate the integer quotient and remainder of two <LJBigIntegers>.

	<divRem> throws an exception if *n* is zero.

	Parameters:

		n - The number to divide *this* by. Will be converted to a <LJBigInteger>.

	Returns:

		A two-element array containing the quotient and the remainder.

		> a.divRem(b)

		is exactly equivalent to

		> [a.quotient(b), a.remainder(b)]

		except it is faster, because they are calculated at the same time.

	See Also:

		<quotient>, <remainder>
*/
  LJBigInteger.prototype.divRem = function(n) {
    n = LJBigInteger(n)
    if (n._s === 0) {
      throw new Error('Divide by zero')
    }
    if (this._s === 0) {
      return [ZERO, ZERO]
    }
    if (n._d.length === 1) {
      return this.divRemSmall(n._s * n._d[0])
    }

	// Test for easy cases -- |n1| <= |n2|
    switch (this.compareAbs(n)) {
      case 0: // n1 == n2
        return [this._s === n._s ? ONE : M_ONE, ZERO]
      case -1: // |n1| < |n2|
        return [ZERO, this]
    }

    var sign = this._s * n._s
    var a = n.abs()
    var b_digits = this._d
    var b_index = b_digits.length
    var digits = n._d.length
    var quot = []
    var guess

    var part = new LJBigInteger([], 0, CONSTRUCT)

    while (b_index) {
      part._d.unshift(b_digits[--b_index])
      part = new LJBigInteger(part._d, 1, CONSTRUCT)

      if (part.compareAbs(n) < 0) {
        quot.push(0)
        continue
      }
      if (part._s === 0) {
        guess = 0
      } else {
        var xlen = part._d.length, ylen = a._d.length
        var highx = part._d[xlen - 1] * LJBigInteger_base + part._d[xlen - 2]
        var highy = a._d[ylen - 1] * LJBigInteger_base + a._d[ylen - 2]
        if (part._d.length > a._d.length) {
				// The length of part._d can either match a._d length,
				// or exceed it by one.
          highx = (highx + 1) * LJBigInteger_base
        }
        guess = Math.ceil(highx / highy)
      }
      do {
        var check = a.multiplySingleDigit(guess)
        if (check.compareAbs(part) <= 0) {
          break
        }
        guess--
      } while (guess)

      quot.push(guess)
      if (!guess) {
        continue
      }
      var diff = part.subtract(check)
      part._d = diff._d.slice()
    }

    return [new LJBigInteger(quot.reverse(), sign, CONSTRUCT),
            new LJBigInteger(part._d, this._s, CONSTRUCT)]
  }

// Throws an exception if n is outside of (-LJBigInteger.base, -1] or
// [1, LJBigInteger.base).  It's not necessary to call this, since the
// other division functions will call it if they are able to.
  LJBigInteger.prototype.divRemSmall = function(n) {
    var r
    n = +n
    if (n === 0) {
      throw new Error('Divide by zero')
    }

    var n_s = n < 0 ? -1 : 1
    var sign = this._s * n_s
    n = Math.abs(n)

    if (n < 1 || n >= LJBigInteger_base) {
      throw new Error('Argument out of range')
    }

    if (this._s === 0) {
      return [ZERO, ZERO]
    }

    if (n === 1 || n === -1) {
      return [(sign === 1) ? this.abs() : new LJBigInteger(this._d, sign, CONSTRUCT), ZERO]
    }

	// 2 <= n < LJBigInteger_base

	// divide a single digit by a single digit
    if (this._d.length === 1) {
      var q = new LJBigInteger([(this._d[0] / n) | 0], 1, CONSTRUCT)
      r = new LJBigInteger([(this._d[0] % n) | 0], 1, CONSTRUCT)
      if (sign < 0) {
        q = q.negate()
      }
      if (this._s < 0) {
        r = r.negate()
      }
      return [q, r]
    }

    var digits = this._d.slice()
    var quot = new Array(digits.length)
    var part = 0
    var diff = 0
    var i = 0
    var guess

    while (digits.length) {
      part = part * LJBigInteger_base + digits[digits.length - 1]
      if (part < n) {
        quot[i++] = 0
        digits.pop()
        diff = LJBigInteger_base * diff + part
        continue
      }
      if (part === 0) {
        guess = 0
      } else {
        guess = (part / n) | 0
      }

      var check = n * guess
      diff = part - check
      quot[i++] = guess
      if (!guess) {
        digits.pop()
        continue
      }

      digits.pop()
      part = diff
    }

    r = new LJBigInteger([diff], 1, CONSTRUCT)
    if (this._s < 0) {
      r = r.negate()
    }
    return [new LJBigInteger(quot.reverse(), sign, CONSTRUCT), r]
  }

/*
	Function: isEven
	Return true iff *this* is divisible by two.

	Note that <LJBigInteger.ZERO> is even.

	Returns:

		true if *this* is even, false otherwise.

	See Also:

		<isOdd>
*/
  LJBigInteger.prototype.isEven = function() {
    var digits = this._d
    return this._s === 0 || digits.length === 0 || (digits[0] % 2) === 0
  }

/*
	Function: isOdd
	Return true iff *this* is not divisible by two.

	Returns:

		true if *this* is odd, false otherwise.

	See Also:

		<isEven>
*/
  LJBigInteger.prototype.isOdd = function() {
    return !this.isEven()
  }

/*
	Function: sign
	Get the sign of a <LJBigInteger>.

	Returns:

		* -1 if *this* < 0
		* 0 if *this* == 0
		* +1 if *this* > 0

	See Also:

		<isZero>, <isPositive>, <isNegative>, <compare>, <LJBigInteger.ZERO>
*/
  LJBigInteger.prototype.sign = function() {
    return this._s
  }

/*
	Function: isPositive
	Return true iff *this* > 0.

	Returns:

		true if *this*.compare(<LJBigInteger.ZERO>) == 1.

	See Also:

		<sign>, <isZero>, <isNegative>, <isUnit>, <compare>, <LJBigInteger.ZERO>
*/
  LJBigInteger.prototype.isPositive = function() {
    return this._s > 0
  }

/*
	Function: isNegative
	Return true iff *this* < 0.

	Returns:

		true if *this*.compare(<LJBigInteger.ZERO>) == -1.

	See Also:

		<sign>, <isPositive>, <isZero>, <isUnit>, <compare>, <LJBigInteger.ZERO>
*/
  LJBigInteger.prototype.isNegative = function() {
    return this._s < 0
  }

/*
	Function: isZero
	Return true iff *this* == 0.

	Returns:

		true if *this*.compare(<LJBigInteger.ZERO>) == 0.

	See Also:

		<sign>, <isPositive>, <isNegative>, <isUnit>, <LJBigInteger.ZERO>
*/
  LJBigInteger.prototype.isZero = function() {
    return this._s === 0
  }

/*
	Function: exp10
	Multiply a <LJBigInteger> by a power of 10.

	This is equivalent to, but faster than

	> if (n >= 0) {
	>     return this.multiply(LJBigInteger("1e" + n));
	> }
	> else { // n <= 0
	>     return this.quotient(LJBigInteger("1e" + -n));
	> }

	Parameters:

		n - The power of 10 to multiply *this* by. *n* is converted to a
		javascipt number and must be no greater than <LJBigInteger.MAX_EXP>
		(0x7FFFFFFF), or an exception will be thrown.

	Returns:

		*this* * (10 ** *n*), truncated to an integer if necessary.

	See Also:

		<pow>, <multiply>
*/
  LJBigInteger.prototype.exp10 = function(n) {
    n = +n
    if (n === 0) {
      return this
    }
    if (Math.abs(n) > Number(MAX_EXP)) {
      throw new Error('exponent too large in LJBigInteger.exp10')
    }
	// Optimization for this == 0. This also keeps us from having to trim zeros in the positive n case
    if (this._s === 0) {
      return ZERO
    }
    if (n > 0) {
      var k = new LJBigInteger(this._d.slice(), this._s, CONSTRUCT)

      for (; n >= LJBigInteger_base_log10; n -= LJBigInteger_base_log10) {
        k._d.unshift(0)
      }
      if (n == 0) { return k }
      k._s = 1
      k = k.multiplySingleDigit(Math.pow(10, n))
      return (this._s < 0 ? k.negate() : k)
    } else if (-n >= this._d.length * LJBigInteger_base_log10) {
      return ZERO
    } else {
      var k = new LJBigInteger(this._d.slice(), this._s, CONSTRUCT)

      for (n = -n; n >= LJBigInteger_base_log10; n -= LJBigInteger_base_log10) {
        k._d.shift()
      }
      return (n == 0) ? k : k.divRemSmall(Math.pow(10, n))[0]
    }
  }

/*
	Function: pow
	Raise a <LJBigInteger> to a power.

	In this implementation, 0**0 is 1.

	Parameters:

		n - The exponent to raise *this* by. *n* must be no greater than
		<LJBigInteger.MAX_EXP> (0x7FFFFFFF), or an exception will be thrown.

	Returns:

		*this* raised to the *nth* power.

	See Also:

		<modPow>
*/
  LJBigInteger.prototype.pow = function(n) {
    if (this.isUnit()) {
      if (this._s > 0) {
        return this
      } else {
        return LJBigInteger(n).isOdd() ? this : this.negate()
      }
    }

    n = LJBigInteger(n)
    if (n._s === 0) {
      return ONE
    } else if (n._s < 0) {
      if (this._s === 0) {
        throw new Error('Divide by zero')
      }		else {
        return ZERO
      }
    }
    if (this._s === 0) {
      return ZERO
    }
    if (n.isUnit()) {
      return this
    }

    if (n.compareAbs(MAX_EXP) > 0) {
      throw new Error('exponent too large in LJBigInteger.pow')
    }
    var x = this
    var aux = ONE
    var two = LJBigInteger.small[2]

    while (n.isPositive()) {
      if (n.isOdd()) {
        aux = aux.multiply(x)
        if (n.isUnit()) {
          return aux
        }
      }
      x = x.square()
      n = n.quotient(two)
    }

    return aux
  }

/*
	Function: modPow
	Raise a <LJBigInteger> to a power (mod m).

	Because it is reduced by a modulus, <modPow> is not limited by
	<LJBigInteger.MAX_EXP> like <pow>.

	Parameters:

		exponent - The exponent to raise *this* by. Must be positive.
		modulus - The modulus.

	Returns:

		*this* ^ *exponent* (mod *modulus*).

	See Also:

		<pow>, <mod>
*/
  LJBigInteger.prototype.modPow = function(exponent, modulus) {
    var result = ONE
    var base = this

    while (exponent.isPositive()) {
      if (exponent.isOdd()) {
        result = result.multiply(base).remainder(modulus)
      }

      exponent = exponent.quotient(LJBigInteger.small[2])
      if (exponent.isPositive()) {
        base = base.square().remainder(modulus)
      }
    }

    return result
  }

/*
	Function: log
	Get the natural logarithm of a <LJBigInteger> as a native JavaScript number.

	This is equivalent to

	> Math.log(this.toJSValue())

	but handles values outside of the native number range.

	Returns:

		log( *this* )

	See Also:

		<toJSValue>
*/
  LJBigInteger.prototype.log = function() {
    switch (this._s) {
      case 0:	 return -Infinity
      case -1: return NaN
      default: // Fall through.
    }

    var l = this._d.length

    if (l * LJBigInteger_base_log10 < 30) {
      return Math.log(this.valueOf())
    }

    var N = Math.ceil(30 / LJBigInteger_base_log10)
    var firstNdigits = this._d.slice(l - N)
    return Math.log((new LJBigInteger(firstNdigits, 1, CONSTRUCT)).valueOf()) + (l - N) * Math.log(LJBigInteger_base)
  }

/*
	Function: valueOf
	Convert a <LJBigInteger> to a native JavaScript integer.

	This is called automatically by JavaScipt to convert a <LJBigInteger> to a
	native value.

	Returns:

		> parseInt(this.toString(), 10)

	See Also:

		<toString>, <toJSValue>
*/
  LJBigInteger.prototype.valueOf = function() {
    return parseInt(this.toString(), 10)
  }

/*
	Function: toJSValue
	Convert a <LJBigInteger> to a native JavaScript integer.

	This is the same as valueOf, but more explicitly named.

	Returns:

		> parseInt(this.toString(), 10)

	See Also:

		<toString>, <valueOf>
*/
  LJBigInteger.prototype.toJSValue = function() {
    return parseInt(this.toString(), 10)
  }

  var MAX_EXP = LJBigInteger(0x7FFFFFFF)
// Constant: MAX_EXP
// The largest exponent allowed in <pow> and <exp10> (0x7FFFFFFF or 2147483647).
  LJBigInteger.MAX_EXP = MAX_EXP;

  (function() {
    function makeUnary(fn) {
      return function(a) {
        return fn.call(LJBigInteger(a))
      }
    }

    function makeBinary(fn) {
      return function(a, b) {
        return fn.call(LJBigInteger(a), LJBigInteger(b))
      }
    }

    function makeTrinary(fn) {
      return function(a, b, c) {
        return fn.call(LJBigInteger(a), LJBigInteger(b), LJBigInteger(c))
      }
    }

    (function() {
      var i, fn
      var unary = 'toJSValue,isEven,isOdd,sign,isZero,isNegative,abs,isUnit,square,negate,isPositive,toString,next,prev,log'.split(',')
      var binary = 'compare,remainder,divRem,subtract,add,quotient,divide,multiply,pow,compareAbs'.split(',')
      var trinary = ['modPow']

      for (i = 0; i < unary.length; i++) {
        fn = unary[i]
        LJBigInteger[fn] = makeUnary(LJBigInteger.prototype[fn])
      }

      for (i = 0; i < binary.length; i++) {
        fn = binary[i]
        LJBigInteger[fn] = makeBinary(LJBigInteger.prototype[fn])
      }

      for (i = 0; i < trinary.length; i++) {
        fn = trinary[i]
        LJBigInteger[fn] = makeTrinary(LJBigInteger.prototype[fn])
      }

      LJBigInteger.exp10 = function(x, n) {
        return LJBigInteger(x).exp10(n)
      }
    })()
  })()

  exports.LJBigInteger = LJBigInteger
})(typeof exports !== 'undefined' ? exports : this)
