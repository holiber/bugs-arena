![Qstore](qstore.png)

##Overview
Work with collections in javascript
- Create your collections.
- Search and update data using queries.
- Use computed fields.
- Get collections changes.
- Extend your query language.

###Simple examples
  Find all green apples from fruits collection:

```js
fruits.find({type: 'apple', color: 'green'});
```

 ---
  Find all apples and pears from fruits collection:

```js
fruits.find({type: ['apple', 'pear']});
```

 ---
 
 Which fruits can be red?
 
 ```js
	fruits.getList({color: 'red'}, 'type');// ['apple', 'pear', 'strawberries']
 ```
 
 ---
 
See more [examples](http://holiber.github.io/activedata/examples/)

##Instalation
in development

##API
- [Initialisation](#initialisation)
- [Data search](#dataSearch)
  - [find](#find)
	- [deepSearch](#deepSearch)
	- [aliases](#aliases)
	- [comparison of fields](#comparisonOfFields)
  - [search](#search)
  - [findOne](#findOne)
  - [findIn](#findIn)
  - [test](#test)
  - [getList](#getList)
  - [each](#each)
- [Operators](#operators)
  - [Build-in operators](#availOperators)
  - [addOperator](#addOperator)
  - [removeOperator](#removeOperator)
- [Functions](#functions)
  - [Build-in functions](#availFunctions)
  - [addFunction](#addFunction)
  - [removeFunction](#removeFunction)
- [Extending](#extending)
- [Fields selection](#fieldsSelecion)
- [Grouping](#grouping)
  - [indexBy](#indexBy)
  - [mapOf](#mapOf)
  - [groupBy](#groupBy)
- [Data manipulation](#dataManipulation)
  - [add](#add)
  - [update](#update)
  - [patch](#patch)
  - [remove](#remove)
  - [addFields](#addFields)
  - [compute](#compute)
  - [removeFields](#removeFields)
  - [sort](#sort)
- [Work with changes](#changes)
  - [getChanges](#getChanges)
  - [commit](#commit)
  - [revert](#revert)
  - [softMode](#softMode)
- [Utilites](#utilites)
  - [size](#size)
  - [pack](#pack)
  - [unpack](#unpack)
  - [getCopy](#getCopy)
  - [getVal](#getVal)
  - [parseArgs](#parsArgs)
- [Events](#events)
  - [Events list](#eventsList)
  - [setListener](#setListener)
- [Examples of collections](#exampleCollections)
  - [fruits](#fruits)
  - [usersMessages](#usersMessages)
  - [messages](#messages)
  - [diet](#diet)
  - [users](#users)
  - [costumes](#costumes)
  - [clothes](#clothes)
  - [usersChanges](#usersChanges)
  - [shops](#shops)
  - [contacts](#contacts)
  - [meetings](#meetings)

<a name="initialisation"></a>
###Initialisation

Using array of objects:

```js
var fruits = new Qstore([
	{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
	{type: 'pear', color: 'green', weight: 0.4, price: 2},
	{type: 'pear', color: 'red', weight: 0.3, price: 1.8},
	{type: 'apple', color: 'yellow', weight: 0.26, price: 1.2},
]);
```

Using reduced format:

```js
var fruits = new Qstore({
	columns: ['type', 'color', 'weight', 'price'],
	rows: [
		['apple', 'red', 0.25, 1.5],
		['pear', 'green', 0.4, 2],
		['pear', 'red', 0.3, 1.8],
		['apple', 'yellow', 0.26, 1.2]
	]
});
```

 ---

<a name="dataSearch"></a>
###Data search
<a name="find"></a>
####.find (query, [fields], [options])

Returns all objects which are valid for query. 
See [examples of usage](http://holiber.github.io/activedata/examples/)
 

- **query {Object|Array|Function|Bolean}**  
 If query is **true** then all rows will be returned.  
 If query is **Object** or **Array**:  
 { } - contains conditions separeted with **and**  
 [ ] - contains conditions separeted with **or**  
 Operators describe as **$&lt;operator name&gt;**, see [Operators](#operators).  
  Example:
  
  ```js
// find all red or green fruits with price between 0.5 and 1.5  
fruits.find({color: ['red', 'green'], price: {$gt: 0.5, $lt: 1.5}});
  ```

  ```js
  // using regular expressions
  fruits.find({type: /apple/});//returns all apples and pineapples
  ```

  If query is **Function**:  
  Example:
  
  ```js
  // find all red fruits
  fruits.find(function (row) {
      return row.color == 'red';
  });
  ```
  If query is **Object** that contains functions:  
  
  Function with field-context:
  
  ```js
  // find all fruits with integer price or with 0.5$ price
  fruits.find({price: [0.5, function (price) { return price % 1 == 0}]);
  ```
  
  Function with row-context:
  
  ```js
  // find all fruits with integer price or with 0.5$ price
  fruits.find([price: 0.5, function (row) { return row.price % 1 == 0});
  ```
- **[fields=true] {Array|Boolean}**  
 Array of field names which will be added to result.  
 Example:
 
  ```js
 	fruits.find({type: 'apple'}, ['type', 'color', 'price']);
  ```
  
Also you can use fields [aliases](#aliases)
 
- **[options] {Object}**  
  - limit: rowsCount
  - limit: [fromRow]
  - limit: [fromRow, RowsCount]  
  
  Example:
  
  ```js
  	// find first two apples
  	fruits.find({type: 'apple'}, true, {limit: 2});
  	
  	// find two yellow fruits beginning with third yellow fruit
  	fruits.find ({color: 'yellow'}, true, {limit: [3,2]});
  	
  ```

<a name="deepSearch"></a>
#####Deep search:

Deep search in object:

```js

	var usersMessages = new Qstore ({
		columns: ['text', 'subject', 'user'],
		rows: [
			['Hi', 'new year', {id: 1, name: 'Bob', company: {name: 'IBM', phone: '+9999'} }],
			['Happy new year!', 'new year', {id: 2, name: 'Kate', company: {name: 'Microsoft', phone: '+8888'}}],
			['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
			['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
		]
	});

	// find all messages with subject 'New year' from user with name 'Bob' who works in 'IBM' company
	
	messages.find({subject: 'new year', 'user.name': 'Bob', 'user.company.name': 'IBM'});

	// or
	messages.find({subject: 'new year', user: {name: 'Bob', company: {name: 'IBM'} }});
	
```

Deep search in collection:

```js
	
	// create collection of costumes
	var costumes = new Qstore([
		{name: 'policeman', items: [ {name: 'tie', color: 'black'}, {name: 'cap', color: 'blue'}]},
		{name: 'fireman', items: [{name: 'hemlet', color: 'yellow'}]},
		{name: 'solder', items: [{name: 'hemlet', color: 'green'}]}
	]);
	
	// find costumes which have hemlet in items
	costumes.find({items: {name: 'hemlet'} });
```

<a name="aliases"></a>
#####Aliases:

You can create aliases for fields by using the syntax *"fieldName:aliasName"* or by alias map

```js
	// create collection of messages
	var messages = new Qstore ({
		columns: ['text', 'subject', 'user'],
		rows: [
			['Hello world!', 'programming', {id: 1, name: 'Bob'}],
			['Happy new year!', 'new year', {id: 2, name: 'Kate'}],
			['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
			['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
		]
	});

	// we need to select "text" and "user.name" from messages collection

	// first way
	messages.find({subject: 'new year'}, ['text', 'user.name:userName']);

	// second way
	messages.find({subject: 'new year'}, {text: true, userName: 'user.name'});

	// [ {text: 'Happy new year!', userName: 'Kate'}, {text: 'Anyone want to dance?', userName: 'James'}]
```

result of example:

```js
	[
		{text: 'Happy new year!', userName: 'Kate'},
		{text: 'Anyone want to dance?', userName: 'James'}
	]
```

Use *"fieldname:"* syntax to extract field values on one level up.

```js
	// create collection of changes
	var usersChanges = new Qstore ({
		columns: ['source', 'patch'],
		rows: [
			[{id: 2, name: 'Bob', age: 23}, {name: 'Mike'}],
			[{id: 4, name: 'Stan', age: 30}, {age: 31}]
		]
	});
	
	var patchForDataBase = usersChanges.find(true, ['source.id:id', 'patch:']);
	// now patchForDataBase contains:
	// [{id: 2, name: 'Mike'}, {id: 4, age: 31}];
	
```


<a name="comparisonOfFields"></a>
#####Comparison of fields.

Use *'$.fieldName'* syntax to get the value of field
```js
	// create collection of diet
	var diet = new Qstore ({
		columns: ['month', 'breakfast', 'dinner'],
		rows: [
			['april', {calories: 400, food: 'egg'}, {calories: 300, food: 'soup'}],
			['may', {calories: 300, food: 'bacon'}, {calories: 500, food: 'soup'}],
			['june', {calories: 350, food: 'porridge'}, {calories: 300, food: 'chicken'}]
		]
	});
	
	// find diet where dinner calories less when breackfast calories
	diet.find({'dinner.calories': {$lt: '$.breakfast.calories'} });
```

#####Queries concatenation:
```js
	// create two filters
	var filter1 = {type: 'apple'};
	var filter2 = {color: 'red'};
	
	// search rows valid for filter1 or filter2
	var commonFilter1 = [filter1, filter2]
	
	// search rows valid for filter1 and filter2
	var commonFilter2 = {$and: [filter1, filter2]};
	
```
 ---

<a name="search"></a>
####.search (query [,fields=true] [,options])
Same as [.find](#find) but returns Qstore collection

```js
	// get collection of red fruits sorted by type
	fruits.search({color: 'red'}).sort({fieldName: 'type', order: 'asc');
```

**search** with extending

```js
	clients.search({status: 'online'}).sendMessage('hello!');
```

 ---

<a name="findOne"></a>
####.findOne (query, [,fields=true] [,options])

find first row valid for query.
It same as:

```js
	.find(query, fields, {limit: 1})[0]
```
---

<a name="findIn"></a>
####Qstore.findIn (rows, query [,fields=true] [,options])
same as [.find](#find) but work as static method with array.

```js
	var users = [
		{name: 'user1', id: 1, email: 'user1@anymail.com'},
		{name: 'user2', id: 2, email: 'user2@anymail.com'},
		{name: 'user3', id: 3, email: 'user3@anymail.com'},
		{name: 'user4', id: 4, email: 'user4@anymail.com'}
	];
	
	// find user with id = 3
	Qstore.findIn(users, {id: 3});
```
---

<a name="test"></a>
####Qstore.test (object, query)
Checks that the object match the query.

```js
	var fruit = {type: 'pineapple', color: 'yellow', weight: 1, price: 4};
	
	// The fruit is yellow?
	Qstore.test(fruit, {color: 'yellow'}); //true
	
	// The fruit is pineapple or pear?
	Qstore.test(fruit, {type: ['pear', 'pineapple']}); //true
	
	// The fruit has "apple" in type?
	Qstore.test(fruit, {type: {$like: 'apple'}}); //true
	
	// Fruit price less when 1$ per kg
	Qstore.test(fruit, function (fruit) { return fruit.price/fruit.weight < 1});//false
```
---

<a name="getList"></a>
####.getList ([query] [,fieldName='idx']);
Returns list of values for **fieldName**.  
Elements of the list are not repeated.

Examples:

```js
	// list of all fruits colors
	fruits.getList('color'); // ['red', 'green', 'yellow']
	
	// list of all pears colors
	fruits.getList({type: 'pear'}, 'color');// ['green', 'red']
	
	// What fruits can be red?
	fruits.getList({color: 'red'}, 'type');// ['apple', 'pear', 'strawberries']
	
	// get fruits types with idx in [3, 5, 6]
	fruits.getList({idx: [3, 5, 6]}); //['pear', 'apple', 'banana']
	
	//get list of idx
	fruits.getList();
	
	// list of deep fields
	messages.getList('user.name'); // ['Bob', 'Kate', 'Stan', 'James']

	// you can also use function instead field name
	fruits.getList({type: 'apple'}, function (fruit) {
		return fruit.color + ' ' + fruit.type}
	} // ['red apple', 'yellow apple', 'green apple']

```


 ---
 
<a name="each"></a>
####.each ([query=true,] fn)
apply function for each row

- **[query=true] {Object|Function|Boolean}** filter query
- **fn {Function}** function to apply

```js

	// add message to log for each fruit
	fruits.each(function (row, i, query) {
		conslole.log('fruit №' + i + ' is ' + row.type);
	});
	
	// it will write:
	//
	// fruit №1 is apple
	// fruit №2 is pear
	// etc... 
	//
	
``` 

 ---

<a name="operators"></a>
###Operators
Оperators are used to extending the query language of search operations.
Each operator is function which returs *true* if item valid for query or *false* if not.


<a name="buildinOperators"></a>
####Build-in operators
 name  | description
 ----- | -----------
 $eq   | equals
 $ne   | not equals
 $gt   | more then
 $lt   | less then
 $gte  | more or equals then
 $lte  | less or equals then
 $and  | change condition of [ ] operator from **or** to **and**
 $like | "like" search
 $has  | check exsisting of value in array or in object or in string see [$has operator](#hasOperator)
 
 you can also add your operators - see [addOperator](#addOperator) method
 
 <a name="hasOperator"></a>
 **$has operator:**
 
 ```
 	var clothes = new Qstore([
 		{name: 'skirt', sizes: ['xs', 's', 'xl']},
 		{name: 'jeans', sizes: ['m', 'xxl']},
 		{name: 'skirt', sizes: ['xs', 's', 'xl']}
 	]);
 	
 	clothes.find({name: 'skirt', sizes: {$has: 'xs'}});
 	
 	clothes.find({name: 'skirt', sizes: {$has: ['xs', 's'] }});
 	
 	
 ```
 
 
---

<a name="addOperator"></a>
####Qstore.addOperator (operatorName, function [isSimple=true])

Example:

```js
	/* we need find fruits with integer price */
	
	// add "isInt" operator
	Qstore.addOperator('isInt', function (left, right) {
		var isInt = (left % 1 == 0);
		return right ? isInt : !isInt
	});
	
	// find them
	fruits.find({price: {$isInt: true}});
	
	// find other
	fruits.find({price: {$isInt: false}});
	
```


 ---

<a name="removeOperator"></a>
####Qstore.removeOperator (operatorName)

Remove operator by operatorName.

 ---

<a name="functions""></a>
### Functions
Functions used for runtime calculations in query.
You may use [build-in functions](#buildinFunctions) or you [own functions](#addFunction)


Example of usage "length" function

```js 

	// create collection of users
	users = new Qstore ([
		{id: 1, name: 'Bob', friends: ['Mike', 'Sam']},
		{id: 2, name: 'Martin', friends: ['Bob']},
		{id: 3, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
		{id: 4, name: 'Sam', friends: []}
	]);

	// find users who have not any friend
	users.find({'friends.$length': 0});
	
	// find users who have more than 2 friends
	users.find({'friends.$length': {$gt: 2} });
	 
```

Example of usage "max" and "min" function:


```js

	// create collection of clothes
	var clothes =  new Qstore([
		{name: 'skirt', sizes: [42, 48, 50]},
		{name: 'jeans', sizes: [48, 54]},
		{name: 'skirt', sizes: [42, 45, 48]}
	]);
	
	// select name and maxSize of each item
	clothes.find(true, ['name', 'sizes.$max:maxSize']);
	
	// find clothes with min size = 42
	clothes.find({'size.$min': 42});
	
```

Functions also can be used in fields selection


```js

	// select user name and count of friends
	users.find(true, ['name', 'friends.$length:friendsCount']);
	
```

The [grouping](#grouping) methods and [getList](#getList) method also supports the functions syntax:

```js

	// get list of all first friends
	users.getList('friends.$first')
```

You can use result of one function as arguments for another function:

```js
	
	// get first letter in lower case of first friends
	
	users.getList({'friends.$length': {$gt: 0}}, 'friends.$first.$first.$lower')
	
```
You can pass additional arguments to functions:

```js

// create collection of сostumes for Halloween
costumes = new Qstore([
		{name: 'policeman', items: [ {name: 'tie', color: 'black'}, {name: 'cap', color: 'blue'}]},
		{name: 'fireman', items: [{name: 'helmet', color: 'yellow'}]},
		{name: 'solder', items: [{name: 'helmet', color: 'green'}]},
		{name: 'zombie', items: [{name: 'skin', color: 'green'}, {name: 'brain', color: 'pink'}]}
	]);
	
// get list of colors for each costume
costumes.find(true, ['name', 'items.$getList("color"):colors']);


```

When you use functions, avoid redundant expressions. For example we need to find all costumes wich have yellow color. We may use **find** and **lenght** function: 

```js
	costumes.find({'items.$find({"color": "yellow"}).$length': {$gt: 0} });
```
But in this case the right way - using a [deep search](#deepSearch).

```js
	costumes.find({'items': {color: 'yellow'}});
```

<a name="buildinFunctions"></a>
#### Build-in functions

 name  		| description
 ----- 		| -----------
 $length	| length of array, string or count of keys in object
 $first		| first item of array or first letter of string or first property of object
 $min		| retunrs max of array
 $max		| returns min of array
 $abs		| absolute value
 $find		| use **Qstore.findIn** method
 $mapOf		| use **Qstore.mapOf** method
 $indexBy 	| use **Qstore.indexBy** method
 $test		| use **Qstore.test** method
 $getList 	| use **Qstore.getList** method
 $upper		| translate string to upper case
 $lower		| translate string to lower case
 $toNumber 	| cast to Number
 $toString	| cast to String


You can also add your functions - see [addFunction](#addFunction) method

---

<a name="addFunction"></a>
#### Add function

in development

---

<a href="removeFunction"></a>
#### Remove function

in develomnent

---

<a name="fieldsSelection"></a>
###Fields selection

---

<a name="grouping"></a>
###Grouping

<a name="indexby"></a>
#### .indexBy (indexes)

returns map of keys for collection

**indexes {String|Array}** key or array of keys


```js
	// create collection of users
	var users = new Qstore ([
		{id: 12, name: 'Bob', friends: ['Mike', 'Sam']},
		{id: 4, name: 'Martin', friends: ['Bob']},
		{id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
		{id: 10, name: 'Sam', friends: []},
		{id: 15, name: 'Sam', friends: ['Mike']}
	]);

	// index by user's name
	users.indexBy('name');
	
```

Result of previous example:

```js
{
	Bob: {id: 12, name: 'Bob', friends: ['Mike', 'Sam']},
	Martin: {id: 4, name: 'Martin', friends: ['Bob']}
	Mike: {id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
	Sam: [{id: 10, name: 'Sam', friends: []}, {id: 15, name: 'Sam', friends: ['Mike']}]
}
```

If for one key exixting more then one item then values will be wrapped in array.

You can also use more then one key:

```js

	// first indexed by name, and then by id
	users.indexBy(['name', 'id']);
```

Result of previous example:

```js

{
	Bob: {
		12: {id: 12, name: 'Bob', friends: ['Mike', 'Sam']}
	Martin: {
		4: {id: 4, name: 'Martin', friends: ['Bob']}
	},
	Mike: {
		5: {id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']}
	},
	Sam: {
		10: {id: 10, name: 'Sam', friends: []},
		15: {id: 15, name: 'Sam', friends: ['Mike']}
	}
}

```

You can also use static implementation of *.indexBy* :
**Qstore.indexBy (items, indexes)**

---

<a name="mapOf"></a>
#### .mapOf (indexes)

same as *.indexBy*, but it always wrap values in array

**indexes {String|Array}** key or array of keys

example:

```js

	// create collection of shop's locations
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
	
	// first group by country, and then by city
	shops.mapOf(['country', 'city']);
	
```
in previous example *.mapOf* returns object like this:

```js

{
	France: {
		Paris: Array[2],
	Germany: {
		Berlin: Array[1],
		Dresden: Array[1],
		Munchen: Array[1]
	},
	Russia: {
		Vladivostok: Array[1]
	},
	UK: {
		London: Array[1]
		York: Array[1]
	}
}

```

You can use function which returns index:

```js

	shops.mapOf(function (shop) {
		return shop.country + ' - ' + shop.city
	});

```

Reslut:

```js
	'France - Paris': Array[2]
	'Germany - Berlin': Array[1]
	'Germany - Dresden': Array[1]
	'Germany - Munchen': Array[1]
	'Russia - Vladivostok': Array[1]
	'UK - London': Array[1]
	'UK - York': Array[1]
```



You can also use static implementation of *.mapOf* :
**Qstore.mapOf (items, indexes)**

---

<a name="groupBy"></a>
#### .groupBy (group1 [, group2, ..., groupN])

Powerful method for creating grouped collections.
Returns Qstore.

Group by country:

```js
	var items =  shops.search({country: ['Germany', 'France']});
	var groups = items.groupBy('country');
```

Result of `groups.rows`:

```js
	[
		{
			_g: Array[2],
			country: "France",
			idx: 1
		},
		{
			_g: Array[3],
			country: "Germany",
			idx: 2
		}
	]
```

All items of group stored in special field `_g`.

Group first 4 items by country and city:

```js
	var items = shops.search(true, true, {limit: 4});
	var groups = items.groupBy(['country', 'city']);
```

Result of `groups.rows`:

```js
	[
		{
			_g: Array[1],
			city: "London",
			country: "UK",
			idx: 1
		},
		{
			_g: Array[1],
			city: "York",
			country: "UK",
			idx: 2
		},
		{
			_g: Array[2]
			city: "Paris"
			country: "France"
			idx: 3
		}
	]
```

You can also use long syntax `items.groupBy({country: true, city: true})` instead `items.groupBy(['country', 'city'])`.
You can use different ways of describing the same action:

```js
	// group by field 'country' and set alias 'countryName' for this field
	shops.groupBy('country:countryName');
	shops.groupBy({'country:countryName': true});
	shops.groupBy({countryName: 'country'});
```


Group by country and when by city:

```js
	var items = shops.search({country: ['Germany', 'France']});
	var groups = items.groupBy('country', 'city').rows
```

Result of `groups.rows`:

```js
[
	{
		_g: [
			{
				_g: Array[2],
				city: "Paris"
			}
		],
		country: "France",
		idx: 1
	},
	{
		_g: [
			{
				_g: Array[1],
				city: "Dresden"
			},
			{
				_g: Array[1],
				city: "Berlin"
			},
			{
				_g: Array[1],
				city: "Munchen"
			}
		],
		country: "Germany",
		idx: 2
	}
]

```

You also can use function instead field name:

```js
	// group contacts by first letter
	var groups = contacts.sort('name').groupBy({
		letter: function (contact) {
			var firstLetter = contact.name.charAt(0);
			if (firstLetter <= 'H') return 'A - H';
			if (firstLetter >= 'R') return 'R - Z';
			return 'I - Q';
		}
	});

```

Result of `groups.rows`:

```js
	[
		{
			_g: Array[5],
			idx: 1,
			letter: "A - H"
		},
		{
			_g: Array[4],
			idx: 2,
			letter: "I - Q"
		},
		{
			_g: Array[2],
			idx: 3,
			letter: "R - Z"
		}
	]
```



Sometimes you may need to add additional field which must be linked with group. For this case you can use special directive `$add`:

```js

	var groups = shops.groupBy({
		country: true,
		$add: {
			shopsCount: '_g.$length'
		}
	});

```

Result of `groups.rows`:

```js
	{
		_g: Array[2],
		country: "UK",
		idx: 1,
		shopsCount: 2
	},
	{
		_g: Array[2],
		country: "France",
		idx: 2,
		shopsCount: 2
	},
	{
		_g: Array[3]
		country: "Germany"
		idx: 3
		shopsCount: 3
	},
	{
		_g: Array[1]
		country: "Russia"
		idx: 4
		shopsCount: 1
	}

```

Additional fields processing when operation of grouping was done, therefore in previous example we can got count of items
in group with help of `$length` [function](#functions).

You can use function as argument for `$add` directive:

```js
	// group by country and add cities list for each group
	var groups = shops.groupBy({
		country: true,
		$add: function (item) {
			var cities = Qstore.getList(item._g, 'city');
			return {cities: cities.join(', ')};
		}
	});
```

Result of `groups.rows`:

```js

[
	{
		_g: Array[2],
		cities: "London, York",
		country: "UK",
		idx: 1
	},
	{
		_g: Array[2],
		cities: "Paris",
		country: "France",
		idx: 2
	},
	{
		_g: Array[3],
		cities: "Dresden, Berlin, Munchen",
		country: "Germany",
		idx: 3
	},
	{
		_g: Array[1],
		cities: "Vladivostok",
		country: "Russia",
		idx: 4
	}
]

```

Also you can use function as value for additional field, and write previous example at another manner:

```js
	var groups = shops.groupBy({
		country: true,
		$add: {
			cities: function (item) {
				var cities = Qstore.getList(item._g, 'city');
				return cities.join(', ');
			}
		}
	});
```


---


<a name="dataManipulation"></a>
###Data manipulation

<a name="add"></a>
####.add (rows [,soft=false])

add new items to collection

 - **row {Object|Array}**
 - **soft** soft add. See [soft mode](#softMode).  


Examples:
 
 ```js
 	//add one new fruit
 	fruits.add({type: 'carrot', color: 'red', weight: 0.3, price: 0.3});
 	
 	//add few new fruits
 	fruits.add([
 		{type: 'carrot', color: 'red', weight: 0.3, price: 0.3},
 		{type: 'orange', color: 'orange', weight: 0.4, price: 0.5}
 	]);
 ```

 ---


<a name="update"></a>
####.update ([searchQuery,] updateQuery [,soft=false])
Update items in collection.

 - **[searchQuery] {Object|Function}** if option is set then will be updated only finded items
 - **updateQuery {Object|Function}** patch or function returned patch
 - **[soft=false]** soft update. See [soft mode](#softMode)  

Examples:

```js
	//all fruits will be apples
	fruits.update({type: 'apple'});
	
	//make all green fruits red
	fruits.update({color: 'green'}, {color: 'red'});
	
	//The price of all pears will increase by 1 $
	fruits.update(function (item) {
		if (item.type == 'pear') {
			return {price: item.price + 1}
		}
	});
```

 ---

<a name="patch"></a>
####.patch (values [,key='idx'] [,soft=false])
Update current collection by using update-collection.

 - **values** array of patches
 - **[key='idx']** key field
 - **[soft=false]** soft patch. See [soft mode](#softMode). 


```js
	var patch = [
		{id: 21, connected: true},
		{id: 22, connected: false},
		{id: 33, name: 'unknown'}
	];
	
	users.patch(patch, 'id');
```
 ---

<a name="remove"></a>
####.remove (expr [,soft=false])

Delete items from collection and returns count of deleted items.

```js
	// delete messages that do not have author
	messages.remove({author: undefined});
```

 ---
 
<a name="addFields"></a>
####.addFields (fields)
Add new fields in collection.

 - fields {Array|Object} array of new fields settings

Fields with default values:

```js
	messages.addFields([
		{name: 'author', default: 'unknown'},
		{name: 'rating', default: 0}
	]);
	
	messages.add({text: 'hello world'});
	messages.findOne({text: 'hello world'}); // {text: 'hello world', author: 'unknown', rating: 0}
```

Computed fields: 

```js
	fruits.addFields({name: 'pricePerKg', compute: function (fruit) {
		return fruit.price / fruit.weight;
	});
```

 ---
 
<a name="compute"></a>
#### .compute ()
Forced recalculate computed fields.  
Computed fields automatically recalculeted whan collection was changed.
Use this method if you need recalculate computed fields manualy.

 ---
 
<a name="removeFields"></a>
####.removeFields (fields)
remove fields from collection
 - **fields {String|Array}** field name or array of field names to delete

```js
	// delete one field
	fruits.removeFields('weight');
	
	// delete few fields
	fruits.removeFields(['price', 'color']);
```

 ---

<a name="sort"></a>
####.sort (fields [,zeroIsLast=false])
another variant:
**sort (fn)**  where **fn** is sort function

Sort collection.

Examples:
```js
	// sort by idx
	fruits.sort();
	
	// sort by type (asc)
	fruits.sort({fieldName: 'type', order: 'asc'});
	
	// sort by type (asc) when by price (desc)
	fruits.sort([
		{fieldName: 'type', order: 'asc'},
		{fieldName: 'price', order: 'desc'},
	]);
	
	// sort by price, zero values will be in the end of collection
	fruits.sort({fieldName: 'price', zeroIsLast: true});
	
	// use sort function
	fruits.sort(function (fruit1, fruit2) {
		return fruit1.price - fruit2.price;
	});
	
```
 ---

<a name="changes"></a>
###Work with changes
By default, your collections keep changes until you call the method **commit** or **rollback**.
If you do not need this functionality, see [soft mode](#softMode).

<a name="getChanges"></a>
####.getChanges ()
returns collection of changes

Examples:
```js
	// we need get the list of idx of removed items
	fruits.remove({type: 'apple'});
	fruits.getChanges().search({action: 'remove'}).getList('source.idx');// [1, 4, 9]
```

```js
	
	// do some changes
	fruits.update({type: 'pear'}, {color: 'blue', price: 0.5});
	fruits.add({type: 'apple', color: 'green'});
	fruits.remove({type: 'pineapple'});
	
	// we need to create patch for database
	var changes = fruits.getChanges();
	var patch = {};
	patch.add = changes.find({action: 'add'}, ['values:']);
	patch.remove = changes.search({action: 'remove'}).getList('source.idx');
	patch.update = changes.find(true, ['source.idx:id', 'values:']);
	
```

An easier way to get the map of changes - use [getChangesMap](#getChnagesMap) method. 

 ---

<a name="getChangesMap"></a>
####.getChangesMap ([keyField='idx'])

Use this method to get map of changes group by action like:  

```
{
	add: [array of added items]
	remove: [array of removed keys]
	update: [array of updated values]
}	
```


<a name="commit"></a>
####.commit ()
Commit changes.

 ---
 
<a name="rollback"></a>
####.rollback ()
Revert all changes.

 ---
 
 
<a name="softMode"></a>
####softMode
Some actions may be called with soft mode. This means that they do not add information about the change in the list of changes.

If you want that your collection always work in soft mode use **.setSoftMode** method.

```js
	fruits.setSoftMode(true)
```

If you want that anyone new collection will be work in soft mode use **Qstore.setSoftMode** method

 ---

<a name="utilites"></a>
###Utilites

<a name="size"></a>
####.size ()
Returns rows count.

 ---
 
<a name="pack"></a>
####.pack ([query] [,fields])
Returs reduced collection.

```js
	// create fruits collection
	var fruits = new Qstore([
		{type: 'apple', color: 'red', weight: 0.25, price: 1.5},
		{type: 'pear', color: 'green', weight: 0.4, price: 2},
		{type: 'pear', color: 'red', weight: 0.3, price: 1.8},
		{type: 'apple', color: 'yellow', weight: 0.26, price: 1.2}
	]);
	
	var apples =  fruits.pack({type: 'apple'}, ['idx', 'weight', 'price']);
	
	//now apples contains:
	{
		columns: ['idx', 'weight', 'price'],
		rows: [
			[1, 0.25, 1.5],
			[4, 0.26, 1.2]
		]
	}
	
```
You can use this method if you whant to send collection or part of collection by network,
because it will reduce the outgoing traffic.

 ---
 
<a name="getCopy"></a>
####.getCopy ()
Returns a new independent collection, which will be copy of current collection.

 ---

<a name="events"></a>
###Events

<a name="eventsList"></a>
#### Events list
 - change
 - commit
 - sort

Use [setListener](#setListener) method to react on changes.

 ---

#### .setListener (fn)
 - fn {Function} listener function

Example: 
```js
// We want to add messages to the log, if any apple will change its color.
var listener = function (name, data, collection) {

	// We are interested only in the event "change" with the action "update"
	if (name != 'change' || data.action != 'update') return;
	
	// get operations changes
	var changes = data.changes;
	
	// find apples with changed color
	var applePainting = changes.find({'source.type': 'apple', 'patch.color': {$ne: undefined} });
	
	// write to log
	for (var i = 0; i < applePainting.length; i++) {
		var change = applePainting[i];
		console.log('Some apple change color from ' + change.source.color + ' to ' + change.patch.color);
	}
};

fruits.setListener(listener);

fruits.update({color: 'blue'}); // it will write to log:
// Some apple change color from red to blue
// Some apple change color from yellow to blue
// Some apple change color from green to blue

```
 ---

<a name="exampleCollections"></a>
###Examples of collections

In many examples of the API docs using various collections. You can explore their in this section.

<a name="fruits"></a>
####fruits

```js

	var fruits = new Qstore({
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

```

---

<a name="usersMessages"></a>
####usersMessages

```js

	var usersMessages = new Qstore ({
		columns: ['text', 'subject', 'user'],
		rows: [
			['Hi', 'new year', {id: 1, name: 'Bob', company: {name: 'IBM', phone: '+9999'} }],
			['Happy new year!', 'new year', {id: 2, name: 'Kate', company: {name: 'Microsoft', phone: '+8888'}}],
			['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
			['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
		]
	});

```

---

<a name="messages"></a>
####messages

```js

	var messages = new Qstore ({
		columns: ['text', 'subject', 'user'],
		rows: [
			['Hello world!', 'programming', {id: 1, name: 'Bob'}],
			['Happy new year!', 'new year', {id: 2, name: 'Kate'}],
			['How to learn javascript?', 'programming', {id: 2, name: 'Stan'}],
			['Anyone want to dance?', 'new year', {id: 2, name: 'James'}]
		]
	});


```

---

<a name="diet"></a>
####diet

```js

	var diet = new Qstore ({
		columns: ['month', 'breakfast', 'dinner'],
		rows: [
			['april', {calories: 400, food: 'egg'}, {calories: 300, food: 'soup'}],
			['may', {calories: 300, food: 'bacon'}, {calories: 500, food: 'soup'}],
			['june', {calories: 350, food: 'porridge'}, {calories: 300, food: 'chicken'}]
		]
	});

```

---

<a name="users"></a>
####users

```js

	var users = new Qstore ([
		{id: 12, name: 'Bob', friends: ['Mike', 'Sam']},
		{id: 4, name: 'Martin', friends: ['Bob']},
		{id: 5, name: 'Mike', friends: ['Bob', 'Martin', 'Sam']},
		{id: 10, name: 'Sam', friends: []},
		{id: 15, name: 'Sam', friends: ['Mike']}
	]);

```

---

<a name="costumes"></a>
####costumes

```js

	var costumes = new Qstore([
		{name: 'policeman', items: [ {name: 'tie', color: 'black'}, {name: 'cap', color: 'blue'}]},
		{name: 'fireman', items: [{name: 'helmet', color: 'yellow'}]},
		{name: 'solder', items: [{name: 'helmet', color: 'green'}]},
		{name: 'zombie', items: [{name: 'skin', color: 'green'}, {name: 'brain', color: 'pink'}]}
	]);

```

---

<a name="clothes"></a>
####clothes

```js

	var clothes =  new Qstore([
		{name: 'skirt', sizes: [42, 48, 50]},
		{name: 'jeans', sizes: [48, 54]},
		{name: 'skirt', sizes: [42, 45, 48]}
	]);

```

---

<a name="usersChanges"></a>
####usersChanges

```js

	var usersChanges = new Qstore ({
		columns: ['source', 'patch'],
		rows: [
			[{id: 2, name: 'Bob', age: 23}, {name: 'Mike'}],
			[{id: 4, name: 'Stan', age: 30}, {age: 31}]
		]
	});


```

---

<a name="shops"></a>
####shops

```js
	var shops = new Qstore ({
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

```

---

<a name="contacts"></a>
####contacts

```js

	var contacts = new Qstore({
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


```

---


<a name="meetings"></a>
####meetings

```js

	var meetings = new Qstore({
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

```

---



