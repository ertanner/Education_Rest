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

router.post('/addUser', function (req, res) {

    var userName = req.body.userName
    var salutation = req.body.salutation
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var middleInitial = req.body.middleInitial
    var email = req.body.email
    var pwd = req.body.password
    var pwd2 = req.body.password2

    if (pwd == pwd2) {
        console.log(userName)
        var hashPassword = hashPwd2(pwd)
        connection.query({
            sql: 'insert into test.user (Salutation, firstName,lastName,middleInitial,email,accountName, isDisabled)\n' +
            'values(?,?,?,?,?,?,?,0)',
            timeout: 40000, // 40s
            values: [salutation, firstName, lastName, middleInitial, email, userName]
        }, function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                var hashPassword = hashPwd2(pwd)
                connection.query({
                    sql: 'update test.user Set PasswordHash = ? where accountName = ?',
                    timeout: 40000, // 40s
                    values: [hashPassword, userName]
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
            }
        })
    } else {
        res.setHeader(300)

    }
});

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
    bcrypt.genSalt(10, function(err, salt) {

        if (err) return; //handle error

        bcrypt.hash(pwd, salt, function(err, hash) {

            if (err) return; //handle error
            console.log(hash)
            return(hash)

        });
    });

}