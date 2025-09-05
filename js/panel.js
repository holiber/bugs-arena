!function () {

	var LOBBY_SERVER = window.location.hostname === 'localhost' ?
	 'http://localhost:8095' :
	 'https://bugs-arena-lobby.onrender.com';
	var MAX_MESSAGES = 6;

	var Panel = Game.Panel = Class.extend({

		init: function (game) {
			this.game = game;
			this.dialog = null;
			this.lastName = $.cookie('lastName');
			this.lastAddress = $.cookie('lastAddress');
			this.$el = this.game.$el.find('.panel')
			this.$playersList = this.$el.find('.players .list');
			this.$messages = this.$el.find('.messages .list');
			this.servers = new Qstore();
			this._attachEvents();
			this.closeDialog();
			this.render();
		},

		reset: function () {
			this.$messages.empty();
			this.$playersList.empty();
		},

		getServers: function () {
			var $dlg = this.$el.find('.dlg.games');
			$dlg.find('.load-state').hide();
			$dlg.find('.loading').show();
			var $tbody = $dlg.find('tbody').empty();
			var req = $.getJSON(LOBBY_SERVER + '?callback=?');
			var onFail = function () {
				$dlg.find('.load-state').hide();
				$dlg.find('.error').show();
			}

			req.done(function (servers) {
				this.servers = new Qstore(servers);

				if (!this.servers.rows.length) {
					onFail();
					return;
				}

				this.servers.each(function (server) {
					$tbody.append('<tr rel="' + server.id + '"><td>' + server.name + '</td><td>' + server.id + '</td><td>' + server.playersCnt + '</td><td>' + server.map + '</td><td>' + server.protocol + '</td></tr>');
				});
				$dlg.find('.load-state').hide();
				$dlg.find('.done').show();
			});
			req.fail(onFail)
		},

		render: function () {
			this.$playersList.empty();
			for (var id in this.game.players) {
				var player = this.game.players[id];
				var unitsCnt = Game.utils.length(player.units);
				var $player = $('<div class="player">' +
					'<div class="header ' + player.team +'" >' + player.name + ' (' + unitsCnt + ')</div>' +
					'</div>');

				if (this.game.gameIsRuning && !player.isActive && player.isConnected) {
					$player.append('<div class="looser">No units alive</div>');
				}

				if (!player.isConnected) {
					$player.append('<div class="looser">Player offline</div>');
				}

				for (var unitId in player.units) {
					var unit = player.units[unitId];
					$player.append('<div class="unit">' +
						'<div class="image"></div>' +
						'<div class="hp">'+ unit.hp + '/' + unit.maxHp + '</div>' +
						'<div class="dm">' + unit.weapon.min + '-' + unit.weapon.max + '</div>' +
						'<div class="xp">'+ unit.spawnXp + '/' + unit.maxSpawnXp + '</div>' +
					'</div>');
				}
				this.$playersList.append($player);
			}

			if (this.dialog == 'connection') {
				var $dlg = $('.dlg.connection');
				$dlg.find('[name="name"]').val(this.lastName);
				$dlg.find('[name="address"]').val(this.lastAddress);
				$dlg.find('>').hide();
				if (!this.game.connectionState) {
					$dlg.find('.form').show();
				} else {
					$dlg.find('.' + this.game.connectionState).show();
				}
			}

			if (this.dialog == 'wait-room') {
				var $dlg = $('.dlg.wait-room');
				$dlg.find('.title').html('Server: ' + this.lastAddress + ', map: ' + this.game.serverMap);
				var $tbody = $dlg.find('tbody').empty();
				for (var key in this.game.players) {
					var p = this.game.players[key];
					var state = p.isReady ? 'ready' : 'waiting';
					$tbody.append('<tr><td>' + p.name +'</td><td class="' + p.team +'">' + p.team + '</td><td>' + state +'</td></tr>');
				}
				var $readyBtn = $dlg.find('.ready');
				if (this.game.player.isReady) {
					if (this.game.startAge) {
						$readyBtn.html('All players ready, game starting...');
					} else {
						$readyBtn.html('Waiting for other players...');
					}
				} else {
					$readyBtn.html('Ready');
				}
			}

			if (this.dialog == 'results') {
				var $dlg = $('.dlg.results');
				var $tbody = $dlg.find('tbody').empty();
				var winner = null;
				for (var key in this.game.players) {
					var player = this.game.players[key];
					if (player.isActive) winner = player;
					$tbody.append('<tr><td><span class="' + player.team +'">' + player.name + '</td><td>' + player.stats.kills + '</td><td>' + player.stats.units + '</td><td>' + player.stats.items + '</td></tr>');
				}
				$dlg.find('.title').html('<span class="' + winner.team + '">' + winner.name + '</span> wins!');
			}
		},

		onStartGame: function () {
			this.reset();
			this.closeDialog();
		},

		showDialog: function (name) {
			this.dialog = name;
			this.render();
			this.$el.find('.dlg').hide();
			this.$el.find('.dlg.' + name).show();
		},

		closeDialog: function () {
			this.$el.find('.dlg').hide();
			this.dialog = null;
		},

		connected: function () {
			this.$el.find('.dlg.connection').hide();
			this.showDialog('wait-room');
			this.render();
		},

		msg: function (msg) {
			this.$messages.append('<div class="msg">' + msg + '</div>');
			var messagesCnt = this.$messages.children().length;
			this.$messages.scrollTop(messagesCnt * 20);
			if (messagesCnt > MAX_MESSAGES) this.$messages.find('>:lt(-' + MAX_MESSAGES + ')').remove();
		},

		sendMessage: function (e) {
			if (e.type == 'keypress' && e.which != 13) return;
			var $input = this.$el.find('input[name="message"]');
			var val = $input.val();
			if (!val) return;
			this.game.send('chatMessage', val);
			$input.val('');
		},

		_attachEvents: function () {
			this.$el.off();
			this.$el.on('click', '.btn.connect', this._onConnectClick.bind(this));
			this.$el.on('click', '.btn.disconnect', this._onDisconnectClick.bind(this));
			this.$el.on('click', '.btn.ready', this._onReadyClick.bind(this));
			this.$el.on('click', '.btn.send', this.sendMessage.bind(this));
			this.$el.on('click', '.btn.close', this.closeDialog.bind(this));
			this.$el.on('click', '.btn.reset', this._onResetClick.bind(this));
			this.$el.on('click', '.btn.join', this._onJoinClick.bind(this));
			this.$el.on('click', '.dlg.games tr', this._onServerClick.bind(this));
			this.$el.on('click', '.btn.find-games', this._onFindGamesClick.bind(this));
			this.$el.on('click', '.btn.help', function () {this.showDialog('help')}.bind(this));
			this.$el.on('keypress', 'input[name="message"]', this.sendMessage.bind(this));
		},

		_onConnectClick: function () {
			var $dlg = this.$el.find('.dlg.connection');
			var name = $dlg.find('[name="name"]').val().trim();
			var address = $dlg.find('[name="address"]').val();
			if (!name) {
				alert('Invalid name');
				return;
			}
			$.cookie('lastName', name);
			$.cookie('lastAddress', address);
			this.lastAddress = address;
			this.lastName = name;
			this.game.connect(address, name);
		},

		_onDisconnectClick: function () {
			this.closeDialog();
			this.game.disconnect();
		},

		_onJoinClick: function () {
			this.game.connectionState = '';
			this.showDialog('connection');
		},

		_onFindGamesClick: function () {
			this.showDialog('games');
			this.getServers();
		},

		_onReadyClick: function () {
			if (this.game.player.isReady) {
				this.game.send('waiting');
			} else {
				this.game.send('ready');
			}
		},

		_onResetClick: function () {
			this.closeDialog();
			this.game.reset();
		},

		_onServerClick: function (e) {
			var address = $(e.currentTarget).attr('rel');
			this.lastAddress = address;
			this.showDialog('connection');
		}
	})
}()