const Mock = require('mockjs');

const Random = Mock.Random;

Random.extend({
	food: function () {
		let foods = ['牛油果甜菜恰巴塔', '迷迭香烤虾', '黄豌豆烤串', '乳酪欧姆蛋', '熏鸭肉莎拉', '吐司蛋', '金橄榄肉', '拔丝金果'];
		return this.pick(foods);
	}
});

const foods = Mock.mock('/api/getFoods', 'get', {
	'list|15-25': [{
		'id|+1': 1,
		'name': '@FOOD',
		'price|50-90': 60,
		'type|1-5': 3,
		'img|1': './src/common/img/cai.jpg'   
	}]
});
