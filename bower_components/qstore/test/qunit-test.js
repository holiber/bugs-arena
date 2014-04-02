var json = JSON.stringify;

// initialization tests
test('initialisation', function() {
	expect(5);

	ok(!!Qstore, 'Qstore exist');

	var fruits = new Qstore([
		{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
		{type: 'pear', color: 'green', weight: 0.4, price: 2}
	]);

	equal(json(fruits.rows), '[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":2,"type":"pear","color":"green","weight":0.4,"price":2}]', 'Object notation rows');
	equal(json(fruits.columns), '["idx","type","color","weight","price"]', 'Object notation columns');

	var fruits = new Qstore({
		columns: ['type', 'color', 'weight', 'price'],
		rows: [
			['apple', 'red', 0.25, 1.5],
			['pear', 'green', 0.4, 2]
		]
	});

	equal(json(fruits.rows), '[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":2,"type":"pear","color":"green","weight":0.4,"price":2}]', 'Reduce notation rows');
	equal(json(fruits.columns), '["idx","type","color","weight","price"]', 'Reduce notation columns');
});


// make collections for testing

window.fruits = new Qstore({
	columns: ['type', 'color', 'weight', 'price'],
	rows: [
		['apple', 'red', 0.25, 1.5],
		['pear', 'green', 0.4, 2],
		['pear', 'red', 0.3, 1.8],
		['apple', 'yellow', 0.26, 1.2],
		['pineapple', 'yellow', 1, 4],
		['banana', 'yellow', 0.3, 1.5],
		['melon', 'yellow', 3, 3],
		['watermelon', 'green', 10, 5],
		['apple', 'green', 0.24, 1],
		['strawberries', 'red', 0.1, 0.2]
	]
});

window.usersMessages = new Qstore ({
	columns: ['text', 'subject', 'user'],
	rows: [
		['Hi', 'new year', {id: 1, name: 'Bob', company: {name: 'IBM', phone: '+9999'} }],
		['Happy new year!', 'new year', {id: 2, name: 'Kate', company: {name: 'Microsoft', phone: '+8888'}}],
		['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
		['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
	]
});

window.messages = new Qstore ({
	columns: ['text', 'subject', 'user'],
	rows: [
		['Hello world!', 'programming', {id: 1, name: 'Bob'}],
		['Happy new year!', 'new year', {id: 2, name: 'Kate'}],
		['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
		['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
	]
});

window.diet = new Qstore ({
	columns: ['month', 'breakfast', 'dinner'],
	rows: [
		['april', {calories: 400, food: 'egg'}, {calories: 300, food: 'soup'}],
		['may', {calories: 300, food: 'bacon'}, {calories: 500, food: 'soup'}],
		['june', {calories: 350, food: 'porridge'}, {calories: 300, food: 'chicken'}]
	]
});

window.users = new Qstore ([
	{id: 12, name: 'Bob', friends: ['Mike', 'Sam']},
	{id: 4, name: 'Martin', friends: ['Bob']},
	{id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
	{id: 10, name: 'Sam', friends: []},
	{id: 15, name: 'Sam', friends: ['Mike']}
]);

window.costumes = new Qstore([
	{name: 'policeman', items: [ {name: 'tie', color: 'black'}, {name: 'cap', color: 'blue'}]},
	{name: 'fireman', items: [{name: 'helmet', color: 'yellow'}]},
	{name: 'solder', items: [{name: 'helmet', color: 'green'}]},
	{name: 'zombie', items: [{name: 'skin', color: 'green'}, {name: 'brain', color: 'pink'}]}
]);

window.clothes =  new Qstore([
	{name: 'skirt', sizes: [42, 48, 50]},
	{name: 'jeans', sizes: [48, 54]},
	{name: 'skirt', sizes: [42, 45, 48]}
]);

window.usersChanges = new Qstore ({
	columns: ['source', 'patch'],
	rows: [
		[{id: 2, name: 'Bob', age: 23}, {name: 'Mike'}],
		[{id: 4, name: 'Stan', age: 30}, {age: 31}]
	]
});

window.shops = new Qstore ({
	columns: ['country', 'city', 'address'],
	rows: [
		['UK', 'London', 'mace st. 5'],
		['UK', 'York', 'temple ave. 10'],
		['France', 'Paris', 'de rivoli st. 20'],
		['France', 'Paris', 'pelleport st. 3'],
		['Germany', 'Dresden', 'haydn st. 2'],
		['Germany', 'Berlin', 'bornitz st. 50'],
		['Germany', 'Munchen', 'eva st. 12'],
		['Russia', 'Vladivostok', 'stroiteley st. 9']
	]
});

window.contacts = new Qstore({
	columns: ['name', 'phone'],
	rows: [
		['Leonardo Da Vinci', '23090533'],
		['Elvis Presley', '247543'],
		['Christopher Columbus', '85321443'],
		['Pablo Piccaso', '2512567'],
		['Walt Disney', '123456464'],
		['Albert Einstein', '0865443'],
		['Aristotle', '23090533'],
		['William Shakespeare', '235667'],
		['Ludwig van Beethoven', '245433'],
		['Cleopatra', '346422'],
		['Paul McCartney', '5532173'],
	]
});

window.meetings = new Qstore({
	columns: ['day','month', 'year', 'details'],
	rows: [
		[2, 'feb', 2012, 'Meeting with Albert Einstein'],
		[14, 'feb', 2012,'Meeting with Elvis Presley'],
		[20, 'feb', 2013, 'Meeting with Christopher Columbus'],
		[3, 'mar', 2013, 'Meeting with Pablo Piccaso'],
		[2, 'apr', 2013, 'Meeting with Walt Disney'],
		[10, 'apr', 2013,'Meeting with Aristotle'],
		[11, 'may', 2013, 'Meeting with William Shakespeare'],
		[13, 'may', 2013, 'Meeting with Cleopatra']
	]

});

// other tests

test('data search', 11, function () {

	equal(json(clothes.find(true)),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":2,"name":"jeans","sizes":[48,54]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'true as query'
	);

	equal(json(clothes.find({name: 'jeans'})),
		'[{"idx":2,"name":"jeans","sizes":[48,54]}]',
		'simple search'
	);

	equal(json(fruits.find({color: ['red', 'green'], price: {$gt: 0.5, $lt: 1.5}})),
		'[{"idx":9,"type":"apple","color":"green","weight":0.24,"price":1}]',
		'"or" condition and simple operators'
	);

	equal(json(clothes.find({name: /rt/})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'regexp'
	);

	equal(json(clothes.find(function (row) { if (row.name == 'skirt') return true})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'function as condition'
	);

	equal(json(usersMessages.find({subject: 'new year', 'user.name': 'Bob', 'user.company.name': 'IBM'})),
		'[{"idx":1,"text":"Hi","subject":"new year","user":{"id":1,"name":"Bob","company":{"name":"IBM","phone":"+9999"}}}]',
		'deep search (long syntax)'
	);

	equal(json(usersMessages.find({subject: 'new year', user: {name: 'Bob', company: {name: 'IBM'} }})),
		'[{"idx":1,"text":"Hi","subject":"new year","user":{"id":1,"name":"Bob","company":{"name":"IBM","phone":"+9999"}}}]',
		'deep search (short syntax)'
	);

	equal(json(diet.find({'dinner.calories': {$lt: '$.breakfast.calories'} })),
		'[{"idx":1,"month":"april","breakfast":{"calories":400,"food":"egg"},"dinner":{"calories":300,"food":"soup"}},{"idx":3,"month":"june","breakfast":{"calories":350,"food":"porridge"},"dinner":{"calories":300,"food":"chicken"}}]',
		'Comparison of fields'
	);

	equal(json(fruits.find({$and: [{type: 'apple'}, {color: 'yellow'}]})),
		'[{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2}]',
		'$and operator'
	);

	equal(json(clothes.find({sizes: {$has: 42}})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'$has operator'
	);

	equal(json(clothes.find({sizes: {$has: [42,45]}})),
		'[{"idx":1,"name":"skirt","sizes":[42,48,50]},{"idx":3,"name":"skirt","sizes":[42,45,48]}]',
		'$has operator with array as argument'
	)
});


test('limits', 3, function() {

	equal(json(fruits.find({type: 'apple'}, true, {limit: 2})),
		'[{"idx":1,"type":"apple","color":"red","weight":0.25,"price":1.5},{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2}]',
		'limit: to'
	);

	equal(json(fruits.find({type: 'apple'}, true, {limit: [2]})),
		'[{"idx":4,"type":"apple","color":"yellow","weight":0.26,"price":1.2},{"idx":9,"type":"apple","color":"green","weight":0.24,"price":1}]',
		'limit: [from]'
	);

	equal(json(fruits.find({color: 'yellow'}, true, {limit: [2,3]})),
		'[{"idx":5,"type":"pineapple","color":"yellow","weight":1,"price":4},{"idx":6,"type":"banana","color":"yellow","weight":0.3,"price":1.5}]',
		'limit: [from, to]'
	);

});


test('fields selection', 7, function () {

	equal(json(fruits.find({type: 'apple'}, ['type', 'color', 'price'])),
		'[{"price":1.5,"color":"red","type":"apple"},{"price":1.2,"color":"yellow","type":"apple"},{"price":1,"color":"green","type":"apple"}]',
		'simple fields selection'
	);

	equal(json(messages.find({subject: 'new year'}, ['text', 'user.name:userName'])),
		'[{"userName":"Kate","text":"Happy new year!"},{"userName":"James","text":"Anyone want to dance?"}]',
		'aliases'
	);

	equal(json(messages.find({subject: 'new year'}, {text: true, 'user.name:userName': true})),
		'[{"text":"Happy new year!","userName":"Kate"},{"text":"Anyone want to dance?","userName":"James"}]',
		'object notation'
	);

	equal(json(users.find({name: 'Mike'}, {username: 'name', friendsCnt: 'friends.$length'})),
		'[{"username":"Mike","friendsCnt":3}]',
		'aliases in object notation'
	);

	equal(json(usersChanges.find(true, ['source.id:id', 'patch:'])),
		'[{"name":"Mike","id":2},{"age":31,"id":4}]',
		'fields extraction'
	);

	equal(json(clothes.find(true, ['name', 'sizes.$length:sizesCount'])),
		'[{"sizesCount":3,"name":"skirt"},{"sizesCount":2,"name":"jeans"},{"sizesCount":3,"name":"skirt"}]',
		'functions usage'
	);

	equal(json(costumes.find(true, ['name', 'items.$getList("color"):colors'])),
		'[{"colors":["black","blue"],"name":"policeman"},{"colors":["yellow"],"name":"fireman"},{"colors":["green"],"name":"solder"},{"colors":["green","pink"],"name":"zombie"}]',
		'functions with additional arguments'
	);

});


test('getList', 7, function () {
	equal(json(fruits.getList()), '[1,2,3,4,5,6,7,8,9,10]', '.getList()');
	equal(json(fruits.getList('color')), '["red","green","yellow"]', '.getList(fieldName)');
	equal(json(fruits.getList({type: 'pear'}, 'color')), '["green","red"]', '.getList(query, fieldName)');
	equal(json(messages.getList('user.name')), '["Bob","Kate","Stan","James"]', 'deep fields');
	equal(json(users.getList('friends.$length')), '[2,1,3,0]', 'functions usage');

	equal(json(fruits.getList(function (fruit) { return fruit.color + ' ' + fruit.type})),
		'["red apple","green pear","red pear","yellow apple","yellow pineapple","yellow banana","yellow melon","green watermelon","green apple","red strawberries"]',
		'function as argument'
	);
	equal(json(fruits.getList({type: 'apple'}, function (fruit) { return fruit.color + ' ' + fruit.type})),
		'["red apple","yellow apple","green apple"]',
		'filter and function as arguments'
	)
});


test('groupings', 12, function () {
	equal(json(users.indexBy('name')),
		'{"Bob":{"idx":1,"id":12,"name":"Bob","friends":["Mike","Sam"]},"Martin":{"idx":2,"id":4,"name":"Martin","friends":["Bob"]},"Mike":{"idx":3,"id":5,"name":"Mike","friends":["Bob","Martin","Sam"]},"Sam":[{"idx":4,"id":10,"name":"Sam","friends":[]},{"idx":5,"id":15,"name":"Sam","friends":["Mike"]}]}',
		'indexBy single index'
	);

	equal(json(users.indexBy(['name', 'id'])),
		'{"Bob":{"12":{"idx":1,"id":12,"name":"Bob","friends":["Mike","Sam"]}},"Martin":{"4":{"idx":2,"id":4,"name":"Martin","friends":["Bob"]}},"Mike":{"5":{"idx":3,"id":5,"name":"Mike","friends":["Bob","Martin","Sam"]}},"Sam":{"10":{"idx":4,"id":10,"name":"Sam","friends":[]},"15":{"idx":5,"id":15,"name":"Sam","friends":["Mike"]}}}',
		'indexBy double index'
	);

	equal(json(shops.mapOf(['country', 'city'])),
		'{"UK":{"London":[{"idx":1,"country":"UK","city":"London","address":"mace st. 5"}],"York":[{"idx":2,"country":"UK","city":"York","address":"temple ave. 10"}]},"France":{"Paris":[{"idx":3,"country":"France","city":"Paris","address":"de rivoli st. 20"},{"idx":4,"country":"France","city":"Paris","address":"pelleport st. 3"}]},"Germany":{"Dresden":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"}],"Berlin":[{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"}],"Munchen":[{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}]},"Russia":{"Vladivostok":[{"idx":8,"country":"Russia","city":"Vladivostok","address":"stroiteley st. 9"}]}}',
		'mapOf'
	);

	equal(json(shops.search(true, true, {limit: 4}).mapOf(function (item) {return item.country + ' - ' + item.city})),
		'{"UK - London":[{"idx":1,"country":"UK","city":"London","address":"mace st. 5"}],"UK - York":[{"idx":2,"country":"UK","city":"York","address":"temple ave. 10"}],"France - Paris":[{"idx":3,"country":"France","city":"Paris","address":"de rivoli st. 20"},{"idx":4,"country":"France","city":"Paris","address":"pelleport st. 3"}]}',
		'function as index'
	);

	equal(json(shops.search({country: ['Germany', 'France']}).groupBy('country').rows),
		'[{"idx":1,"country":"France","_g":[{"idx":3,"country":"France","city":"Paris","address":"de rivoli st. 20"},{"idx":4,"country":"France","city":"Paris","address":"pelleport st. 3"}]},{"idx":2,"country":"Germany","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"},{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"},{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}]}]',
		'simple groupBy'
	);

	equal(json(shops.search(true, true, {limit: 4}).groupBy(['country', 'city']).rows),
		'[{"idx":1,"city":"London","country":"UK","_g":[{"idx":1,"country":"UK","city":"London","address":"mace st. 5"}]},{"idx":2,"city":"York","country":"UK","_g":[{"idx":2,"country":"UK","city":"York","address":"temple ave. 10"}]},{"idx":3,"city":"Paris","country":"France","_g":[{"idx":3,"country":"France","city":"Paris","address":"de rivoli st. 20"},{"idx":4,"country":"France","city":"Paris","address":"pelleport st. 3"}]}]',
		'group by two fields'
	);

	equal(json(shops.search({country: ['Germany', 'France']}).groupBy('country', 'city').rows),
		'[{"idx":1,"country":"France","_g":[{"city":"Paris","_g":[{"idx":3,"country":"France","city":"Paris","address":"de rivoli st. 20"},{"idx":4,"country":"France","city":"Paris","address":"pelleport st. 3"}]}]},{"idx":2,"country":"Germany","_g":[{"city":"Dresden","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"}]},{"city":"Berlin","_g":[{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"}]},{"city":"Munchen","_g":[{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}]}]}]',
		'group by one value and then by another'
	);

	equal(json(contacts.search(true, true, {limit: [5,8]}).groupBy('name.$first:letter').rows),
		'[{"idx":1,"letter":"W","_g":[{"idx":5,"name":"Walt Disney","phone":"123456464"},{"idx":8,"name":"William Shakespeare","phone":"235667"}]},{"idx":2,"letter":"A","_g":[{"idx":6,"name":"Albert Einstein","phone":"0865443"},{"idx":7,"name":"Aristotle","phone":"23090533"}]}]',
		'alias and function in groupBy'
	);

	equal(json(shops.search({country: ['Germany', 'Russia']}).groupBy({country: true, $add: {shopsCount: '_g.$length'}}).rows),
		'[{"idx":1,"country":"Germany","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"},{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"},{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}],"shopsCount":3},{"idx":2,"country":"Russia","_g":[{"idx":8,"country":"Russia","city":"Vladivostok","address":"stroiteley st. 9"}],"shopsCount":1}]',
		'additional fields in groupBy (object notation)'
	);

	equal(json(shops.search({country: ['Germany', 'Russia']}).groupBy({country: true, $add: ['_g.$length:shopsCount']}).rows),
		'[{"idx":1,"country":"Germany","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"},{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"},{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}],"shopsCount":3},{"idx":2,"country":"Russia","_g":[{"idx":8,"country":"Russia","city":"Vladivostok","address":"stroiteley st. 9"}],"shopsCount":1}]',
		'additional fields in groupBy (array notation)'
	);

	equal(json(shops.search({country: ['Germany', 'Russia']}).groupBy({
			country: true,
			$add: {
				shopsCities: function (item) {
					var cities = Qstore.getList(item._g, 'city');
					return cities.join(', ');
				}
			}
		}).rows),
		'[{"idx":1,"country":"Germany","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"},{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"},{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}],"shopsCities":"Dresden, Berlin, Munchen"},{"idx":2,"country":"Russia","_g":[{"idx":8,"country":"Russia","city":"Vladivostok","address":"stroiteley st. 9"}],"shopsCities":"Vladivostok"}]',
		'function as additional field in groupBy'
	);

	equal(json(shops.search({country: ['Germany', 'Russia']}).groupBy({
			country: true,
			$add: function (item) {
				return {
					oneOfCity: Qstore.first(item._g).city
				}
			}
		}).rows),
		'[{"idx":1,"country":"Germany","_g":[{"idx":5,"country":"Germany","city":"Dresden","address":"haydn st. 2"},{"idx":6,"country":"Germany","city":"Berlin","address":"bornitz st. 50"},{"idx":7,"country":"Germany","city":"Munchen","address":"eva st. 12"}],"oneOfCity":"Dresden"},{"idx":2,"country":"Russia","_g":[{"idx":8,"country":"Russia","city":"Vladivostok","address":"stroiteley st. 9"}],"oneOfCity":"Vladivostok"}]',
		'function that returns additional fields in group by'
	);
});