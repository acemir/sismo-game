define({
	createTrail: function(){
		var $ = this;

		$.Particle = function( opt ) {
		  this.radius = 7;
		  this.x = opt.x;
		  this.y = opt.y;
		  this.angle = opt.angle;
		  this.speed = opt.speed;
		  this.accel = opt.accel;
		  this.decay = 0.01;
		  this.life = 1;
		};

		$.Particle.prototype.step = function( i ) {
		  this.speed += this.accel;
		  this.x += Math.cos( this.angle ) * this.speed - (i*0.05);
		  this.y += Math.sin( this.angle ) * this.speed;
		  this.angle += $.PI / 64;
		  this.accel *= 1.01;
		  this.life -= this.decay;
		  
		  if( this.life <= 0 ) {
		    $.particles.splice( i, 1 );
		  }
		};

		$.Particle.prototype.draw = function( i ) {
		  $.ctx.fillStyle = $.ctx.strokeStyle = 'hsla(' + ( $.tick + ( this.life * 120 ) ) + ', 100%, 60%, ' + this.life + ')';
		  $.ctx.beginPath();
		  if( $.particles[ i - 1 ] ) {
		    $.ctx.moveTo( this.x, this.y );
		    $.ctx.lineTo( $.particles[ i - 1 ].x, $.particles[ i - 1 ].y );
		  }
		  $.ctx.stroke();
		  
		  $.ctx.beginPath();
		  $.ctx.arc( this.x, this.y, Math.max( 0.001, this.life * this.radius ), 0, $.TWO_PI );
		  $.ctx.fill();
		  
		  var size = Math.random() * 1.25;
		  $.ctx.fillRect( ~~( this.x + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), ~~( this.y + ( ( Math.random() - 0.5 ) * 35 ) * this.life ), size, size );
		}

		$.step = function(posX,posY) {
		  $.particles.push( new $.Particle({
		    x: posX,
		    y: posY,
		    angle: $.globalRotation + $.globalAngle,
		    speed: 0,
		    accel: 0.01
		  }));
		  
		  $.particles.forEach( function( elem, index ) {
		    elem.step( index );
		  });
		  
		  $.globalRotation += $.PI / 6;
		  $.globalAngle += $.PI / 6;
		};

		$.draw = function() {
		  $.ctx.clearRect( 0, 0, $.width, $.height );
		  
		  $.particles.forEach( function( elem, index ) {
		    elem.draw( index );
		  });
		};

		$.init = function(bitmapData) {
		  $.canvas = bitmapData;
		  $.ctx = $.canvas.ctx;
		  $.width = $.canvas.width;
		  $.height = $.canvas.height;
		  $.min = $.width * 0.5;
		  $.particles = [];
		  $.globalAngle = 0;
		  $.globalRotation = 0;
		  $.tick = 0;
		  $.PI = Math.PI;
		  $.TWO_PI = $.PI * 2;
		  $.ctx.globalCompositeOperation = 'lighter';
		  // document.body.appendChild( $.canvas );
		  // $.loop();
		};

		$.loop = function(posX,posY) {
		  // requestAnimationFrame( $.loop );
		  $.step(posX,posY);
		  $.draw();
		  $.tick++;
		};

		return $
	},
	createStarfield: function(bitmapData){
		// Define Basics //
		var textmain = "Matt & Aims ♥";
		var textblue = "rgba(180, 209, 253, 0.3)";
		var textpink = "rgba(253, 180, 245, 0.3)";
		var textcolor = textpink;

		// Define Stars //
		var starcolor = "rgba(180, 209, 253,"; //Random Opcatiy Added Later

		// Define Gradient BG //
		var grad0 = "rgba(189, 188, 194, 1)";
		var grad05 = "rgba(50, 1, 38, 1)";
		var grad08 = "rgba(8, 1, 25, 1)";
		var grad1 = "rgba(13, 13, 13, 1)";

		// Begin Main Script //
		// var c = document.getElementById("starfield");
		// var $ = c.getContext("2d");

		var c = bitmapData;
		var $ = c.ctx


		// var w = c.width = window.innerWidth;
		// var h = c.height = window.innerHeight;

		var w = c.width;
		var h = c.height;

		var arr = [];
		var u = 0;
		var dep = w;
		var dp = 0.70;
		var ms = {
			x: 0,
			y: 0
		};
		var msd = {
			x: 0.0005,
			y: 0.0005
		};

		function Obj(x, y, z) {
			this.set(x, y, z);
		}

		Obj.prototype = {
			set: function(x, y, z) {
				this.x = x || 0;
				this.y = y || 0;
				this.z = z || 0;
			},
			rotX: function(ang) {
				var y = this.y;
				var z = this.z;
				this.y = y * Math.cos(ang) - z * Math.sin(ang);
				this.z = z * Math.cos(ang) + y * Math.sin(ang);
			},
			rotY: function(ang) {
				var x = this.x;
				var z = this.z;
				this.x = x * Math.cos(ang) - z * Math.sin(ang);
				this.z = z * Math.cos(ang) + x * Math.sin(ang);
			},
			rotZ: function(ang) {
				var x = this.x;
				var y = this.y;
				this.x = x * Math.cos(ang) - y * Math.sin(ang);
				this.y = y * Math.cos(ang) + x * Math.sin(ang);
			}
		};

		function Part(x, y, z) {
			this.op = new Obj(x, y, z);
			this.rp = new Obj(x, y, z);
			this.rot = new Obj();
			this.vel = new Obj();
			this.col = starcolor + rnd(0.5, 1) + ')';
		}

		function upd(rot) {
			var pos;
			var rot;
			var vel;
			var op;
			var rp;
			var col;
			var size;
			var i = arr.length;
			while (i--) {
				op = arr[i].op;
				rp = arr[i].rp;
				rot = arr[i].rot;
				vel = arr[i].vel;
				col = arr[i].col;
				vel.x += msd.x * 0.15;
				vel.y += msd.y * 0.15;
				rp.set(op.x, op.y, op.z);

				rot.x += vel.x;
				rot.y += vel.y;
				rot.z += vel.z;

				rot.x = rot.x > Math.PI * 2 ? 0 : rot.x;
				rot.y = rot.y > Math.PI * 2 ? 0 : rot.y;

				rp.rotY(rot.y);
				rp.rotX(rot.x);

				vel.set(
					vel.x * dp,
					vel.y * dp,
					0
				);
			}
			// msd.x = 0.0005;
			// msd.y = 0.0005;
		}

		function draw() {
			// var t = textmain.split("").join(String.fromCharCode(0x2004));
			// $.font = "4em Poiret One";
			// $.fillStyle = textcolor;
			// $.textBaseline = 'middle';
			// $.fillText(t, (c.width - $.measureText(t).width) * 0.5, c.height * 0.5);
			var p, dth;
			var i = arr.length;
			while (i--) {
				p = arr[i];
				dth = ((p.rp.z / dep) + 1);
				$.fillStyle = p.col;
				$.fillRect(w + p.rp.x, h + p.rp.y, rnd(dth / 0.8, dth / 2), dth / 0.9);
			}
		}

		function rnd(min, max) {
			return Math.random() * (max - min) + min;
		}

		function go() {
			for (var i = 0; i < 6800; i++) {
				var d = new Part(
					rnd(-w, h),
					rnd(-w, h),
					rnd(-dep, dep)
				);
				d.vel.set(0, 0, 0);
				arr.push(d);
			}
		}

		// window.addEventListener('mousemove', function(e) {
		// 	msd.x = (e.clientY - ms.y) / w;
		// 	msd.y = (e.clientX - ms.x) / h;
		// 	ms.x = e.clientX;
		// 	ms.y = e.clientY;
		// }, false);

		// window.addEventListener('touchmove', function(e) {
		// 	e.preventDefault();
		// 	msd.x = (e.touches[0].clientY - ms.y) / w;
		// 	msd.y = (e.touches[0].clientX - ms.x) / h;
		// 	ms.x = e.touches[0].clientX;
		// 	ms.y = e.touches[0].clientY;
		// }, false);

		// window.addEventListener('resize', function(e) {
		// 	c.width = w = window.innerWidth;
		// 	c.height = h = window.innerHeight;
		// }, false);

		function run() {
			$.clearRect(0, 0, w, h);
			var g_ = $.createLinearGradient(c.width + c.width,
				c.height + c.height * 1.5,
				c.width + c.width, 1);
			g_.addColorStop(0, grad0);
			g_.addColorStop(0.5, grad05);
			g_.addColorStop(0.8, grad08);
			g_.addColorStop(1, grad1);
			$.globalCompositeOperation = 'normal';
			$.fillStyle = g_;
			$.fillRect(0, 0, w, h);
			$.globalCompositeOperation = 'lighter';
			upd();
			draw();
			// window.requestAnimationFrame(run);
		}

		function velocity(x,y) {
			msd.x = x;
			msd.y = y;
		}

		// go();
		// run();

		return {
			go: go,
			run: run,
			velocity: velocity
		}		
	}
});
