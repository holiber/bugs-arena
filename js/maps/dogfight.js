!function () {

	var BONUS_CHANCE = 0.015;

	Game.maps['Dogfight'] = Game.Map.extend({

		build: function () {

			var blockSize = 20;
			var xBlocksCnt = Math.floor(this.game.arenaWidth / blockSize);
			var yMiddle = this.game.arenaHeight / 2 - blockSize / 2;
			for (var i = 0; i < xBlocksCnt; i++) {
				this.game.create('Block', {x: blockSize * i, y: yMiddle, maxHp: 30});
			}

			var unitsPosition = {
				blue: {x: 20, y: 20},
				green: {x: this.game.arenaWidth - 20, y: 20},
				purple: {x: 20, y: this.game.arenaHeight - 20},
				red: {x: this.game.arenaWidth - 20, y: this.game.arenaHeight - 20}
			}

			for (var key in this.game.players) {
				var player = this.game.players[key];
				var team = player.team;
				var pos = unitsPosition[team];
				this.game.create('Bug', {team: player.team, x: pos.x, y: pos.y});
			}
		},

		step: function () {
			if (this.game.random() <= BONUS_CHANCE) {
				this.game.create('Bonus', {
					x: (this.game.arenaWidth - 20) * this.game.random(),
					y: (this.game.arenaHeight - 20) * this.game.random(),
					type: 'cake'
				});
			}
		}

	})
}();