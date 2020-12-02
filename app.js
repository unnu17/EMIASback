const express = require('express')
const app = express()
const db = require('./db/db')
const bodyParser = require('body-parser')
const morgan = require('morgan')

var logger = morgan('short')

const jsonParser = bodyParser.json()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});






app.get('/project_status', function (req, res) {
    res.send({
        status: db.select_objs('project_status')
    })
})

app.post('/registration', jsonParser, (req, res) => {
    try {        
        let user = db.select_obj('people', 'login', req.body.login)
        if (user == null) {
            db.create_obj('people', {
                role: req.body.role,
                name: req.body.name,
                password: req.body.password,
                login: req.body.login,
                photo: null,
                Badges: [],
                medals: [],
                thanks: [],
                like: [],
                ideas: []
            })
            res.send({status: 'ok'})
        } else {
            res.send({status: 'not a unique login'})
        }
    } catch (err) {
        res.send({status: 'error'})
        console.error(err)
    }
})

app.post('/login', jsonParser, (req, res) => {
    try { 
        let user = db.select_obj('people', 'login', req.body.login)
        if (user.length == 1) {
            if (user[0].password == req.body.password) {
                res.send({
                    status: 'ok',
                    data: {
                        id: user[0].id,
                        role: user[0].role,
                        name: user[0].name,
                        photo: user[0].photo,
                        login: user[0].login
                    }
                })
            }
        }
        res.send({status: 'login error'})
    } catch (err) {
        res.send({status: 'error'})
    }
})


app.post('/actual_stage', jsonParser, (req, res) => {
    try {        
        console.log(req.body.actual_stage);
        db.update_field('project_status', 'actual_stage', req.body.actual_stage)
        res.send({status: 'ok'})
    } catch (err) {
        res.send({status: 'error'})
        console.error(err)
    }
})

app.post('/total_stage', jsonParser, (req, res) => {
    try {
        db.update_field('project_status', 'stages', req.body.total_stage)
        res.send({status: 'ok'})
    } catch (err) {
        res.send({status: 'error'})
        console.error(err)
    }

})


app.listen(3000)