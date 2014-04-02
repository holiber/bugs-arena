!function () {

	// some 2d vector methods got from box2djs http://box2d-js.sourceforge.net/
		var Vec = Game.Vec = Class.extend({

		init: function(x_, y_) {
			this.x= typeof x_ == 'number' ? x_ : 0;
			this.y= typeof y_ == 'number' ? y_ : 0;
		},

		setZero: function() {
			this.x = 0.0;
			this.y = 0.0;
		},

		set: function(x_, y_) {this.x=x_; this.y=y_;},

		setV: function(v) {
			this.x=v.x;
			this.y=v.y;
		},

		negative: function(){
			return new Vec(-this.x, -this.y);
		},

		copy: function(){
			return new Vec(this.x,this.y);
		},

		add: function(v) {
			this.x += v.x; this.y += v.y;
		},

		mubtract: function(v) {
			this.x -= v.x; this.y -= v.y;
		},

		multiply: function(a) {
			this.x *= a; this.y *= a;
			return this;
		},


		div: function(a) {
			this.x /= a; this.y /= a;
			return this;
		},

		minV: function(b) {
			this.x = this.x < b.x ? this.x : b.x;
			this.y = this.y < b.y ? this.y : b.y;
		},

		maxV: function(b) {
			if (Math.abs(this.x) > b.x) {
				this.x = this.x > 0 ? b.x : -b.x;
			}
			if (Math.abs(this.y) > b.y) {
				this.y = this.y > 0 ? b.y : -b.y;
			}
		},

		abs: function() {
			this.x = Math.abs(this.x);
			this.y = Math.abs(this.y);
		},

		length: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},

		normalize: function() {
			var length = this.length();
			if (length < Number.MIN_VALUE)
			{
				return 0.0;
			}
			var invLength = 1.0 / length;
			this.x *= invLength;
			this.y *= invLength;

			return length;
		},

		angle: function () {
			var x = this.x;
			var y = this.y;
			if (x == 0) {
				return (y > 0) ? (3 * Math.PI) / 2 : Math.PI / 2;
			}
			var result = Math.atan(y/x);
			//box2d angle fix
			result += Math.PI/2;
			if (x < 0) result = result - Math.PI;
			return result;
		},

		distanceTo: function (v) {
			return Math.sqrt((v.x - this.x) * (v.x - this.x) + (v.y - this.y) * (v.y - this.y));
		},

		vectorTo: function (v) {
			return new Vec(v.x - this.x, v.y - this.y);
		},

		rotate: function (angle) {
			var length = this.length();
			this.x = Math.sin(angle) * length;
			this.y = Math.cos(angle) * (-length);
			return this;
		}
	});

	var XorShiftGenerator = Game.XorShiftGenerator = function (initializer) {
		this.w = 88675123 //initializer || 88675123;
		this.x = 123456789;
		this.y = 362436069;
		this.z = 521288629;
	}

	XorShiftGenerator.prototype = {
		next: function () {
			var t = this.x ^ (this.x << 11);
			this.x = this.y;
			this.y = this.z; this.z = this.w;
			this.w = this.w ^ (this.w >> 19) ^ t ^ (t >> 8);
			return (this.w / 1000000000) % 1;
		}
	}

	var ParkMillerGenerator = Game.ParkMillerGenerator = function (initializer) {
		this.a = 16807;
		this.m = 2147483647;
		this.val = initializer || Math.round(2147483647 / 3);
	}

	ParkMillerGenerator.prototype = {
		next: function () {
			this.val = (this.a * this.val) % this.m;
			return (this.val / 1000000) % 1;
		}
	}

	var utils = Game.utils = {

		angleDistance: function (angle1, angle2) {
			angle1 = angle1 % (Math.PI * 2);
			angle2 = angle2 % (Math.PI * 2);
			if (angle1 < 0 ) angle1 = (Math.PI * 2) + angle1;
			if (angle2 < 0 ) angle2 = (Math.PI * 2) + angle2;

			var angle2 = angle2 - angle1;
			var result = angle2;
			if (Math.abs(angle2) > Math.PI) {
				result = -((Math.PI * 2) - Math.abs(angle2));
				if (angle2 < 0) result = -result;
			}
			return result;

			var result1 = angle1 - angle2;
			var result2 = ((Math.PI * 2) - Math.abs(result1));
			return ( Math.abs(result1) < Math.abs(result2)) ? result1 : result2;
		},

		getRandomElement: function (arr) {
			if (!arr || !arr.length) return;
			return arr[ Math.floor( Math.random() * arr.length )];
		},

		length: function (obj) {
			if (obj instanceof Array) return obj.length;
			if (typeof obj == 'object') {
				var i = 0;
				for (var key in obj) i++;
				return i;
			}
		},

		lastKey: function (obj) {
			for (var key in obj);
			return key;
		},

		equal: function (obj1, obj2) {
			if (Game.utils.length(obj1) != Game.utils.length(obj2)) return false;
			for (var key in obj1) {
				if (obj1[key] !== obj2[key]) return false;
			}
			return true;
		}
	}
}();