var express = require('express');
var router = express.Router();

var db = require('../../db'); //引入对象
var TodoModel = db.list.model('hero'); //引入模型
var URL = require('url'); //引入URL中间件，获取req中的参数需要
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

router.post('/createHero', function (req, res) {
    console.log('req.body', req.body);
    const obj = Object.assign({}, req.body, {
        updated_at: Date.now()
    });
    new TodoModel( // 实例化对象，新建数据
        obj
    ).save(function (err, todo, count) { //保存数据
        console.log('内容', todo, '数量', count); //打印保存的数据
        res.send(todo + '添加成功');
        // res.redirect('/'); //返回首页
    });
});

router.get('/searchHero', function (req, res, next) {
    console.log(req.cookies, 'cookies');
    TodoModel.
    find().
    sort('updated_at').
    exec(function (err, data, count) {
        var _callback = req.query.callback;
        console.log(_callback, 'callback');
        if (_callback) {
            res.type('text/javascript');
            res.send(_callback + '(' + JSON.stringify({
                "data": data
            }) + ')');
        } else {
            res.send({
                "msg": '不是jsonp',
                data
            });
        }
    });
});

router.get('/editHero', function (req, res) {
    var params = URL.parse(req.url, true).query;
    //res.send(params);
    TodoModel.findById(params.id, function (err, todo) {
        // res.redirect('edit'); //返回首页
        res.send(todo);
    })
})

router.post('/updateHero', function (req, res) {
    //res.send(req);
    console.log(req.body);
    TodoModel.findById(req.body._id, function (err, todo) {
        // todo.content = req.body.content;
        todo.updated_at = Date.now();
        todo.save();
    })
    res.redirect('/'); //返回首页
})

router.get('/destroyHero', function (req, res) {
    var params = URL.parse(req.url, true).query;
    console.log(params);
    //根据待办事项的id 来删除它
    TodoModel.findById(params.id, function (err, todo) {
        todo.remove(function (err, todo) {
            res.send('删除成功');
            // res.redirect('/');
        });
    });
})

module.exports = router;