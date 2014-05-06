!function () {

	var WIDTH = 20;
	var HEIGHT = 12;
	var B = 'Block';
	var P = 'Bonus';

	var MAP = [
		,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		, B, B, B, B, B, B,  ,  , B,  ,  ,  , B,  ,  ,  , B, B, B,
		, B,  ,  ,  ,  , B,  ,  , B,  ,  ,  , B,  ,  ,  , B,  , B,
		, B,  ,  ,  ,  , B,  ,  , B,  ,  ,  , B,  ,  ,  , B,  , B,
		, B,  ,  ,  ,  , B,  ,  , B,  ,  ,  , B,  ,  ,  , B,  , B,
		, B,  ,  ,  ,  , B,  ,  , B, B, B,  , B, B, B,  , B, B, B,
		, B, B, B, B, B, B,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  ,  ,  , B, B, B,  , B, B, B,  ,  ,  ,  ,
		,  ,  ,  ,  ,  ,  , B,  , B,  , B,  , B,  , B,  ,  ,  ,  ,
		, B, B, B,  , B,  , B,  , B, B,  ,  , B, B,  ,  ,  ,  ,  ,
		, B,  , B,  , B,  , B,  , B,  , B,  , B,  , B,  ,  ,  ,  ,
		, B,  , B,  , B,  , B,  , B, B, B,  , B,  , B,  , P,  ,  ,
	];

	Game.maps['TastyLands'] = Game.Map.extend({

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
		}

	})
}();