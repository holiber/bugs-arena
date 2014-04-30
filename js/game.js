(function () {

	var PROTOCOL_VERSION = 1;
	var TICK_DELAY = 25;
	var DEFAULT_MAP = 'Hello';
	var MAX_AGE_DIFF = 10;
	var SKIP_AGE_DIFF = 30;

	this.Game = Class.extend({

		init: function ($el) {
			this.idx = 0;
			this.$el = $el || this.$el;
			this.$arena = this. $el.find('.arena');
			this.arenaWidth = this.$arena.width();
			this.arenaHeight = this.$arena.height();
			this.objects = {}; // all game objects here
			this.collidingObjects = {}; // all colliding objects from gameObjects
			this.age = 0;
			this.serverAge = null;
			this.serverMap = null;
			this.map = null;
			this.players = {};
			this.player = null;
			this.panel = new Game.Panel(this); // gui
			this.socket = null;
			this.frames = {};
			this.randomizer = 0;
			this.gameIsRuning = false;
			this.gameIsOver = false;
			this.startAge = 0;
			this.connectionState = ''; // '', 'connecting', 'connected', 'error'
			this.rGen = null;
			this._attachEvents();
		},

		start: function () {
			this.age = this.serverAge;
			var Map =  Game.maps[this.serverMap];
			if (!Map) {
				alert('map "' + this.serverMap + '" not found!');
				this.disconnect();
				return;
			}
			this.map = new Map(this);
			this.map.build();
			setTimeout(this.loop.bind(this), TICK_DELAY);
			this.gameIsRuning = true;
			this.panel.onStartGame();
			this.gameIsRuning = true;
			this.$el.addClass('running');
		},

		create: function (objectName, param) {
			var object = new Game.classes[objectName](param);
			object.id = ++this.idx;
			object.game = this;
			this.objects[object.id] = object;
			if (object.isColliding) this.collidingObjects[object.id] = object;
			object.birth();
			return object;
		},

		createTarget: function (params) {
			this.create('Target', params);
			console.log('target created');
		},

		createPlayer: function (params) {
			var player = new Game.Player(params);
			player.game = this;
			this.players[player.id] = player;
			return player;
		},

		loop: function () {
			if (!this.gameIsRuning) return;

			// connection problem
			if (this.age == (this.serverAge + this.serverFramesCnt)) {
				setTimeout(this.loop.bind(this), TICK_DELAY);
				return;
			}

			if (this.frames[this.age]) {
				for (var i = 0; i < this.frames[this.age].length; i++) {
					var event = this.frames[this.age][i];
					switch (event.name) {
						case 'target': this.createTarget(event.data);break;
					}
				}
			}

			for (var id in this.objects) {
				var object = this.objects[id];
				if (object.isDead) {
					if (object.isColliding) delete this.collidingObjects[id];
					delete this.objects[id];
					continue;
				}
				object.step();
			}

			this.map.step();
			this.age++;

			var timeout = TICK_DELAY;

			//sync with server age
			var ageDiff = this.serverAge - this.age
			if (ageDiff > MAX_AGE_DIFF) timeout = Math.round(timeout /= 2);
			if (ageDiff > SKIP_AGE_DIFF) timeout = 0;
			setTimeout(this.loop.bind(this), timeout);
		},

		stop: function () {
			this.gameIsRuning = false;
			this.$el.removeClass('running');
		},

		_attachEvents: function () {
			this.$el.on('click', '.arena', this._onArenaClick.bind(this));
		},

		random: function () {
			//return Math.random();
			return this.rGen.next();
		},

		getRandomElement: function (arr) {
			if (!arr || !arr.length) return;
			return arr[ Math.floor( this.random() * arr.length )];
		},

		connect: function (address, name) {
			address = 'http://' + address;
			this.socket = io.connect(address, {'force new connection': true, timeout: 1000});
			this.socket.on('connect', function () {
				console.log('connected');
				this.send('hello', {name: name, protocol: PROTOCOL_VERSION});
			}.bind(this));
			this.socket.on('error', function () {
				this.connectionState = 'error';
				this.panel.render();
			}.bind(this));
			this.socket.on('message', this._onMessage.bind(this));
			this.connectionState = 'connecting';
			this.panel.render();
			console.log('connecting to ', address);
		},

		send: function (msg, data) {
			this.socket.emit('message', {msg: msg, data: data});
			console.log('send ', msg, data);
		},

		msg: function (msg, data) {
			this.panel.msg(msg, data);
		},

		gameOver: function (isServerDecision) {
			if (isServerDecision) {
				alert('Game has been over by server decision');
			}
			this.gameIsOver = true;
			this.panel.showDialog('results');
			this.stop();
			this.disconnect();
		},

		_onMessage: function (message) {
			switch (message.msg) {
				case 'hello': this._onHello(message.data);break;
				case 'newPlayer': this._onNewPlayer(message.data);break;
				case 'state': this._onState(message.data);break;
				case 'disconnect': this._onServerDisconnect(message.data);break;
			}
		},

		_onHello: function (data) {
			console.log('connected', data);
			var id = data.id;
			this.age = data.age;
			this.rGen = new Game.ParkMillerGenerator(data.randomizer);
			this.serverMap = data.map;

			for (var key in data.players) {
				var player = data.players[key];
				player = this.createPlayer(player);
				if (id == player.id) this.player = player;
			}
			this.panel.connected();
			this.$el.addClass('connected');
			for (var key in this.objects) {
				this.objects[key].die();
			}
			this.objects = {};
			this.collidingObjects = {};
		},

		_onServerDisconnect: function (reason) {
			this.disconnect();
			if (reason) alert('Disconnected: ' + reason);
		},

		_onNewPlayer: function (data) {
			var player = this.createPlayer(data);
			this.msg('player ' + player.name + ' connected');
			this.panel.render();
		},

		_onState: function (data) {
			if (this.gameIsOver) return;
			this.serverAge = data.age;
			this.serverFramesCnt = data.framesCnt;

			//clear old frames
			for (var frameAge in this.frames) {
				if (frameAge < this.age) delete this.frames[frameAge];
			}

			//add new frames
			if (data.frames) for (var frameAge in data.frames) {
				this.frames[frameAge] = data.frames[frameAge];
			}

			console.log('ageDiff:', data.age - this.age, 'client age:', this.age, 'state:', data);

			for (var i = 0; i < data.events.length;i++) {
				var event = data.events[i];
				switch (event.name) {
					case 'gameOver': this.gameOver.bind(true);break;
					case 'startAge': this._onStartAge(event.data);break;
					case 'start': this.start();break;
					case 'playerReady': this._onPlayerReady(event.data);break;
					case 'playerWaiting': this._onPlayerWaiting(event.data);break;
					case 'playerDisconnected': this._onPlayerDisconnected(event.data);break;
					case 'chatMessage': this._onChatMessage(event.data);break;
				}
			}

			this.panel.render();
		},

		_onPlayerReady: function (playerId) {
			this.players[playerId].isReady = true;
			this.panel.render();
		},

		_onPlayerWaiting: function (playerId) {
			this.players[playerId].isReady = false;
			this.panel.render();
		},

		_onPlayerDisconnected: function (playerId) {
			var player = this.players[playerId];
			if (!player) return;
			player.disconnect();
			if (!this.gameIsRuning && !this.gameIsOver) delete this.players[playerId];
		},

		_onStartAge: function (age) {
			this.startAge = age;
			this.panel.render();
		},

		onPlayerLoose: function (player) {
			if (player.id == this.player.id) this.send('loose');
			var activePlayersCnt = 0;
			for (var key in this.players) {
				if (this.players[key].isActive) activePlayersCnt++;
			}
			if (activePlayersCnt < 2) this.gameOver();
		},

		_onChatMessage: function (data) {
			data = $.extend({player: null, msg: null}, data);
			var player = this.players[data.player];
			this.msg('<span class="' + player.team + '">' + player.name + ':</span> ' + data.msg);
		},

		_onArenaClick: function (e) {
			var $el = $(e.target);
			var position = {x: e.offsetX, y: e.offsetY};
			if (!$el.hasClass('arena')) {
				var $el = $el.hasClass('go') ? $el : $el.closest('.go')
				var pos = $el.position();
				position = {x: pos.left + $el.width() / 2, y: pos.top + $el.height() / 2}
			}
			this.send('target', position);
			this.create('Sprite', {
				sprite: 'click',
				animation: 'grow',
				x: position.x,
				y: position.y,
				frames: 10,
				css: {
					borderColor: this.player.team
				}
			});
		},

		disconnect: function () {
			this.socket.disconnect();
			this.$el.removeClass('connected');
			if (!this.gameIsOver) this.reset();
		},

		reset: function () {
			this.$el.find('.go').remove();
			this.init();
		}

	},{
		classes: {},
		maps: {},
		GameObject: Class.extend({

			init: function () {
				this.width = 0;
				this.height = 0;
				this.x = 0;
				this.y = 0;
				this.size = 0;
				this.isDead = false;
				this.isColliding = false;
				this.$el = null;
				this.css = {};
			},

			birth: function () {
				//override me
			},
			die: function () {
				this.isDead = true;
				if (this.$el) this.$el.remove();
			},
			step: function () {
				//override me
			},

			render: function (css) {
				if (this.$el && !Game.utils.equal(css, this.css)) this.$el.css(css);
			},

			getCollisions: function () {
				var collisions = [];
				for (var id in this.game.collidingObjects) {
					if (id == this.id) continue;
					var object = this.game.collidingObjects[id];
					var distance = this.getWorldCenter().distanceTo(object.getWorldCenter());
					if (distance <= this.size / 2 + object.size / 2) collisions.push(id);
				}
				return collisions;
			},

			findNearest: function (filter) {
				var vec = new Game.Vec(this.x, this.y);
				var nearest = {id: null, distance: 0}
				for (var id in this.game.collidingObjects) {
					var unit = this.game.collidingObjects[id];
					if (filter && !filter(unit)) continue;
					var distance = vec.distanceTo(unit);
					if (!nearest.id || distance < nearest.distance) {
						nearest.id = unit.id
						nearest.distance = distance;
					}
				}
				if (nearest.id) {
					return this.game.collidingObjects[nearest.id];
				}
			},

			outOfRange: function () {
				return this.x <= 0 || this.x >= this.game.arenaWidth || this.y <= 0 || this.y >= this.game.arenaHeight;
			},

			getWorldCenter: function () {
				return new Game.Vec(this.x + this.size / 2, this.y + this.size / 2);
			}
		})
	});
})();