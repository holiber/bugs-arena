!function () {

	var Player = Game.Player = Class.extend({

		init: function (params) {
			params = $.extend({team: null, id: null, name: null, isReady: false}, params)
			this.team = params.team;
			this.id = params.id;
			this.isConnected = true;
			this.isActive = false;
			this.isReady = params.isReady;
			this.units = {};
			this.name = params.name;
			this.stats = {
				kills: 0,
				units: 0,
				items: 0
			}
		},

		addUnit: function (unit) {
			this.units[unit.id] = unit;
			unit.player = this;
			this.isActive = true;
		},

		removeUnit: function (id) {
			delete this.units[id];
			if (Game.utils.length(this.units) == 0) this._onLoose();
		},

		disconnect: function () {
			this.isConnected = false;
			for (var key in this.units) {
				this.units[key].die();
			}
		},

		_onLoose: function () {
			if (!this.game.gameIsRuning) return;
			this.isActive = false;
			this.game.onPlayerLoose(this);
		}
	});

}()