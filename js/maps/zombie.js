!function () {

	var BONUS_CHANCE = 0.04;
	var WIDTH = 22;
	var HEIGHT = 22;
	var B = 'Block';
	var P = 'Bonus';

	var MAP = [
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  , B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  , B,
		,  ,  ,  , B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B, B,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
	];

	Game.maps['Zombie'] = Game.Map.extend({

		build: function () {

			var blockSize = 20;
			for (var i = 0; i < HEIGHT; i++) {
				for (var j = 0; j < WIDTH; j++) {
					var index = WIDTH * i + j;
					if (MAP[index]) this.game.create(MAP[index], {x: blockSize * j, y: blockSize * i});
				}
			}

			var unitsPosition = {
				blue: {x: this.game.arenaWidth/ 2, y: this.game.arenaHeight/2},
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
				var x = (this.game.arenaWidth - 20) * this.game.random();
				var y = (this.game.arenaHeight - 20) * this.game.random();
				var type = 'cake';
				if (x > 80 && y > 100 && x < 440 && y < 400) {
					type = this.game.getRandomElement([ 'amanita', 'acorn', 'apple', 'pepper']);
				}
				if (type != 'cake' || this.game.random() > 0.3) this.game.create('Bonus', {
					x: x,
					y: y,
					type: type
				});
			}
		}

	})
}();