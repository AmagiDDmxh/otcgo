/*
* flow@蓝鲸淘
* Licensed under the MIT License.
*/
//secp256r1
_p =  LJBigInteger('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFF');
_a =  LJBigInteger('0xFFFFFFFF00000001000000000000000000000000FFFFFFFFFFFFFFFFFFFFFFFC');
_b =  LJBigInteger('0x5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B');
_Gx = LJBigInteger('0x6B17D1F2E12C4247F8BCE6E563A440F277037D812DEB33A0F4A13945D898C296');
_Gy = LJBigInteger('0x4FE342E2FE1A7F9B8EE7EB4A7C0F9E162BCE33576B315ECECBB6406837BF51F5');
_r =  LJBigInteger('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551');

and = function(a,b){
	var small_len = a.length<=b.length?a.length:b.length;
	a = a.substring(a.length-small_len, a.length);
	b = b.substring(b.length-small_len, b.length);
	var and_result = new Array(small_len);
	for(var i=0;i<small_len;i++){
		if(a[i]==b[i] && '1'==a[i]){
			and_result[i]= '1';
		}else{
			and_result[i]='0';
		}		
	}
	return LJBigInteger.parse(and_result.join(''),2);
};
inverse_mod = function(a,m){
    if(-1==a.compare(0) || 0>=m.compare(a)){
        a = a.remainder(m);
        if(-1==a.compare(0)){
            a = m.add(a);
        }
    }
    var c = a;
    var d = m;
    var uc = LJBigInteger.ONE;
    var vc = LJBigInteger.ZERO; 
    var ud = LJBigInteger.ZERO;
    var vd = LJBigInteger.ONE;
    while(!c.isZero()){
        var result = d.divRem(c);
        d = c;
        var q = result[0];
        c = result[1];
        var t_uc = uc;
        var t_vc = vc;
        uc = ud.subtract(q.multiply(uc));
        vc = vd.subtract(q.multiply(vc));
        ud = t_uc;
        vd = t_vc;
    }
    if(0!=d.compare(1)){
        console.log('error d='+d.toJSValue());
    }
    if(ud.compare(0)==1){
        return ud;
    }else{
        return ud.add(m);
    }
};//test OK
LJCurveFp = function(p, a, b){
    this.__p = p;
    this.__a = a;
    this.__b = b;
};
LJCurveFp.prototype.p = function(){return this.__p;};
LJCurveFp.prototype.a = function(){return this.__a;};
LJCurveFp.prototype.b = function(){return this.__b;};
LJCurveFp.prototype.contains_point = function(x, y){
    //console.log('check point in cure:x='+x.toJSValue()+',y='+y.toJSValue());
    return (y.multiply(y).subtract(x.multiply(x).multiply(x).add(this.__a.multiply(x)).add(this.__b))).remainder(this.__p).isZero();
};

LJPoint = function(curve, x, y, order=null){
    this.__curve = curve;
    this.__x = x;
    this.__y = y;
    this.__order = order;
    if(this.__curve){
        if(!this.__curve.contains_point(x, y)){
            var msg = 'point no in the curve';
            console.log(msg);
            alert(msg);
        }
    }
};
LJPoint.prototype.x = function(){return this.__x;};
LJPoint.prototype.y = function(){return this.__y;};
LJPoint.prototype.curve = function(){return this.__curve;};
LJPoint.prototype.order = function(){return this.__order;};
LJPoint.prototype.double = function(){
    if(null==this.x() && null==this.y() && null==this.curve()){return INFINITY;}
    var p = this.__curve.p();
    var a = this.__curve.a();
    var l = this.__x.multiply(3).multiply(this.__x).add(a).multiply(inverse_mod(this.__y.multiply(2),p)).remainder(p);
    if(-1==l.compare(0)){
        l = p.add(l);
    }
    var x3 = l.multiply(l).subtract(this.__x.multiply(2)).remainder(p);
    if(-1==x3.compare(0)){
        x3 = p.add(x3);
    }
    var y3 = l.multiply(this.__x.subtract(x3)).subtract(this.__y).remainder(p);
    if(-1==y3.compare(0)){
        y3 = p.add(y3);
    }
    //console.log('---double---\nx:'+this.__x.toString()+'\ny:'+this.__y.toString()+'\np:'+p.toString()+'\na:'+a.toString()+'\nl:'+l.toString()+'\nx3:'+x3.toString()+'\ny3:'+y3.toString());
    return new LJPoint(this.__curve, x3, y3);
};
LJPoint.prototype.add = function(other){
    if(0==this.__x.compare(other.__x)){
        if(this.__y.add(other.__y).remainder(this.__curve.p()).isZero()){
            return INFINITY;
        }else{
            return this.double();
        }
    }
    var p = this.__curve.p();
    var l = other.__y.subtract(this.__y).multiply(inverse_mod(other.__x.subtract(this.__x),p)).remainder(p);
    //console.log('origin l:'+l.toString());
    if(-1==l.compare(0)){
        l = p.add(l);
    }
    var x3 = l.multiply(l).subtract(this.__x).subtract(other.__x).remainder(p);
    if(-1==x3.compare(0)){
        x3 = p.add(x3);
    }
    var y3 = l.multiply(this.__x.subtract(x3)).subtract(this.__y).remainder(p);
    if(-1==y3.compare(0)){
        y3 = p.add(y3);
    }
    //console.log('---add---\nx:'+this.__x.toString()+'\ny:'+this.__y.toString()+'\np:'+p.toString()+'\nl:'+l.toString()+'\nx3:'+x3.toString()+'\ny3:'+y3.toString());
    return new LJPoint(this.__curve, x3, y3);
}
LJPoint.prototype.mul = function(other){
    leftmost_bit = function(x){
        var result = LJBigInteger.ONE; 
        while(result.compare(x)<=0){
            result = result.multiply(2);
        }
        return result.divide(2);
    };//test OK
    var e = other;
    if(!this.__order.isZero()){
        e = e.remainder(this.__order);
    }
    //console.log('e = '+e.toString());
    if(e.isZero()){return INFINITY;}
    if(this.x()==null && this.y()==null && this.curve()==null){return INFINITY;}
    if(e.compare(0)<=0){alert('e must be a positive LJBigInteger');}
    var e3 = e.multiply(3);
    var negative_self = new LJPoint(this.__curve, this.__x, this.__y.multiply(-1), this.__order);
    var i = leftmost_bit(e3).divide(2);
    result = this;
    while(i.compare(1)==1){
        //console.log('situation:i > 1,double');
        result = result.double();
        //console.log('\ni:'+i.toString()+'\ne:'+e.toString()+'\ne3:'+e3.toString());
        if(!and(e3.toString(2),i.toString(2)).isZero() && and(e.toString(2),i.toString(2)).isZero()){
            //console.log('situation:0!=e3&i and 0==e&i,add this');
            result = result.add(this);
        }
        if(and(e3.toString(2),i.toString(2)).isZero() && !and(e.toString(2),i.toString(2)).isZero()){
            //console.log('situation:0==e3&i and 0!=e&i,add negative_self');
            result = result.add(negative_self);
        }
        i = i.divide(2);
    }
    return result;
};
INFINITY = new LJPoint(null, null, null);

LJSignature = function(r,s){
    this.r = r;
    this.s = s;
}

LJPublic_key = function(generator,point){
    this.curve = generator.curve();
    this.generator = generator;
    this.point = point;
}

LJPrivate_key = function(public_key, secret_multiplier){
    this.public_key = public_key;
    this.secret_multiplier = secret_multiplier;
};
LJPrivate_key.prototype.sign = function(hash, random_k){
    var G = this.public_key.generator;
    var n = G.order();
    var k = random_k.remainder(n);
    var p1 = G.mul(k);
    var r = p1.x();
    if(r.isZero()){alert('amazingly unlucky random number r');}
    var s = inverse_mod(k,n).multiply(hash.add(this.secret_multiplier.multiply(r).remainder(n))).remainder(n);
    if(s.isZero()){alert('amazingly unlucky random number s');}
    return new LJSignature(r,s);
}


LJCurve = function(name, curve, generator, oid, openssl_name=null){
    this.name = name;
    //this.openssl_name = openssl_name;
    this.curve = curve;
    this.generator = generator;
    this.order = generator.order();
    this.baselen = 32;
    //this.verifying_key_length = 2*this.baselen;
    //this.signature_length = 2*this.baselen;
    //this.oid = oid;
}

function calcHash(msghex) {
	var hashObj = new jsSHA("SHA-256","HEX",{numRounds: 1});
	hashObj.update(msghex);
	return hashObj.getHash("HEX");
}//test OK
function toHexString(bytes) {
	var s = '';
	var x = bytes;
	for(var i=0;i<x.length;i++){
		s = s + ('00'+(x[i]&0xFF).toString(16)).slice(-2);
	}
	return s;
}
randrange = function(order){
    while(true){
        var bytes = new Array(32);
        for(var i = 0;i<bytes.length;i++){bytes[i]=Math.floor(Math.random()*256);}
        k = LJBigInteger.parse(toHexString(bytes),16);
        if(k.compare(order) == -1 && k.compare(LJBigInteger.ZERO) == 1){
            return k;
        }
    }
}
number_to_hex = function(num_str){
    switch(num_str){
        case '10':return 'a';
        case '11':return 'b';
        case '12':return 'c';
        case '13':return 'd';
        case '14':return 'e';
        case '15':return 'f';
        default:return num_str;
    }
};
number_to_string = function(n){
    var hex_array = new Array();
    do{
        result = n.divRem(16);
        div = result[0];
        rem = result[1];
        hex_array = [number_to_hex(rem.toString())].concat(hex_array);
        n = div;
    }while(div.compare(16)>=0);
    hex_array = [number_to_hex(div.toString())].concat(hex_array);
    var s = hex_array.join('');
    if(s.length < 64){
        var pres = '';
        for(var i=0;i<64-s.length;i++){
            pres += '0';
        }
        s = pres + s;
    }
    return s;
};
sigencode_string = function(r,s){
    r_str = number_to_string(r);
    s_str = number_to_string(s);
    return r_str+s_str;
};
LJSigningKey = function(prvhex, curve=SECP256r1){
    this.curve = curve;
    //this.hashfunc = 'sha256';
    this.baselen = 32;
    var n = curve.order;
    this.order = n;
    this.secexp = LJBigInteger.parse(prvhex, 16);
    if(-1==this.secexp.compare(1) || 0<=this.secexp.compare(n)){alert('invalid private key for SECP256r1');}
    pubkey_point = curve.generator.mul(this.secexp);
    //console.log('x:'+pubkey_point.x().toString()+'\ny:'+pubkey_point.y().toString());
    pubkey = new LJPublic_key(curve.generator, pubkey_point);
    pubkey.order = n;
    this.prvkey = new LJPrivate_key(pubkey, this.secexp);
    //this.prvkey.order = n;
    return this;
};
LJSigningKey.prototype.sign = function(msghex){
    var msghash = calcHash(msghex);
    var bi_msghash = LJBigInteger.parse(msghash,16);
    var k = randrange(this.order);
    var ljsignatue = this.prvkey.sign(bi_msghash, k);
    return sigencode_string(ljsignatue.r,ljsignatue.s);
};

curve_secp256r1 = new LJCurveFp(_p, _a, _b);
generator_secp256r1 = new LJPoint(curve_secp256r1, _Gx, _Gy, _r);
SECP256r1 = new LJCurve("SECP256r1",curve_secp256r1,generator_secp256r1,[1,3,132,0,10],"SECP256r1");

ljSign = function(prvhex, msghex){
    var ljs = new LJSigningKey(prvhex);
    sighex = ljs.sign(msghex);
    return sighex;
};
ljWifkeyToBinkey = function(wif){
	return Base58.decode(wif).subarray(1,33);
};
ljWifkeyToHexkey = function(wif){
	var s = '';
	var x = ljWifkeyToBinkey(wif);
	for(var i=0;i<x.length;i++){
		s = s + ('00'+(x[i]&0xFF).toString(16)).slice(-2);
	}
	return s;
};
ljPrikeyToPubkey = function(prvhex){
	var secexp = LJBigInteger.parse(prvhex, 16);
	var n =  LJBigInteger('0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551');
	if(-1==secexp.compare(1) || 0<=secexp.compare(n)){
		alert('invalid private key for SECP256r1');
	}
	var pubkey_point = generator_secp256r1.mul(secexp);
	var s_x = pubkey_point.x().toString(16);
	var s_y = pubkey_point.y().toString(16);
	var s_x_length = s_x.length;
	var s_y_length = s_y.length;
	for(var i=0;i<64-s_x_length;i++){
		s_x = '0'+s_x;
	}
	for(var i=0;i<64-s_y_length;i++){
		s_y = '0'+s_y;
	}
	return ("04"+s_x+s_y).toLowerCase();
};
ljWifkeyToPubkey = function(wif){
	var prvhex = ljWifkeyToHexkey(wif);
	return ljPrikeyToPubkey(prvhex);
};