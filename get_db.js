// note run "node app.js" to start web service
// to compile run copy all files to web server
var express = require('express');
var moment =  require('moment');
var mysql  = require('mysql')

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'Bambie69',
    database : 'test'
})

var router = express.Router();

var cors = require('cors')
router.use(cors())

module.exports = router;
var bcrypt = require('bcrypt');


router.post('/getUser/:name', function (req, res) {
    var name = req.params.name
    connection.query({
        sql: 'SELECT * FROM `user` WHERE IsDisabled is null and `Username` = ?',
        timeout: 40000, // 40s
        values: [name]
    }, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if (error){
            console.log(error);
        }else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.json(results)
        }
    })
});
router.get('/getUser', function (req, res) {
    var res_data = JSON.parse(req.body);
    var name = req.body.name
    var body = req.body
    var params = req.params
    console.log(name)
    console.log(body)
    console.log(params)
    console.log(res_data)
    connection.query({
        sql: 'SELECT * FROM `user` WHERE IsDisabled is null and `Username` = ?',
        timeout: 40000, // 40s
        values: [name]
    }, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if (error){
            console.log(error);
            res.status(200)
            res(error.toString())

        }else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
            res.setHeader('Access-Control-Allow-Credentials', true);
            res.status(400)
            res.json(results)
        }
    })
});

router.post('/addUser', function (req, res) {
    var accountName = req.body.accountName
    var salutation = req.body.salutation
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var middleInitial = req.body.middleInitial
    var email = req.body.email
    var pwd = req.body.password
    var pwd2 = req.body.password2
    var rowTimestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    //console.log(req.body)
    // console.log(accountName)
    // console.log(email)
    // console.log(pwd)
    // console.log(pwd2)
    // console.log(salutation)
    // console.log(firstName)
    // console.log(lastName)
    // console.log(middleInitial)

    if (pwd == pwd2) {
        var hashPassword =  bcrypt.hashSync(pwd, 10);
        connection.query({
            sql: 'insert into test.user (Salutation, FirstName, LastName, MiddleInitial, email, accountName, PasswordHash, isDisabled, RowTimestamp)\n' +
            'values(?,?,?,?,?,?,?,0,?)',
            timeout: 40000, // 40s
            values: [salutation, firstName, lastName, middleInitial, email, accountName, hashPassword, rowTimestamp]
        }, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
                res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
                res.setHeader('Access-Control-Allow-Credentials', true);
                res.json(results)
            }
        })
    } else {
        res.setHeader(300)

    }
});

// router.post('/addUser2', function (req, res) {
//     var accountName = req.body.accountName
//     var salutation = req.body.salutation
//     var firstName = req.body.firstName
//     var lastName = req.body.lastName
//     var middleInitial = req.body.middleInitial
//     var email = req.body.email
//     var pwd = req.body.password
//     var pwd2 = req.body.password2
//     var rowTimestamp = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
//     console.log(accountName)
//     console.log(email)
//     console.log(pwd)
//     console.log(req.body)
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,contenttype');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     res.write('you posted:\n')
//     //res.sendStatus(300)
//     //res.end(JSON.stringify(req.body, null, 2))
//
// });

function hashPwd(name) {
//    var bcrypt = require('bcrypt');
    bcrypt.hash(name, 10, function(err, hash) {
        if (err) {
            console.log(err)
        }
        return (hash)       // Store hash in database
    });

}

function comparePwd(pwd) {
    bcrypt.compare(pwd, hash, function(err, res) {
        if(res) {
            // Passwords match
            return(true)
        } else {
            // Passwords don't match
            return(false)
        }
    });
}

function hashPwd2(userName, pwd) {
    console.log(userName + ' - ' + pwd)
    bcrypt.genSalt(10, function(err, salt) {

        if (err) return; //handle error

        bcrypt.hash(pwd, salt, function(err, hash) {

            if (err) return; //handle error
            console.log(hash)
            return(hash)

        });
    });

}