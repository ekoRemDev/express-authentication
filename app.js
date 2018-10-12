const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const session = require('express-session');
const cookieParser = require('cookie-parser');


app.set('view engine', 'ejs');
app.set('views','./views');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key"}));

var Users = [
    {userid: '1', password: '1'},
    {userid: '2', password: '1'},
    {userid: '3', password: '1'},
    {userid: '4', password: '1'},
    {userid: '5', password: '1'},

];
var userIds = [1,2,3,4,5];



app.get('/', function(req, res){
    res.render('index');
});

app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login',(req,res)=>{



    var found = userIds.find(function(element) {
        return element === parseInt(req.body.id);
    });


    if(found){
        console.log('Logged In');
        req.session.memberID = parseInt(req.body.id);
        req.session.memberLoggedIn = true;
        res.redirect('/member');
    }else{
        console.log('Not A member');
        res.redirect('/signup');
    }



});

app.get('/signup', function(req, res){
    res.render('signup');
});

app.get('/member', function(req, res){
    res.render('member');
    console.log('user id : ' + req.session.memberID);
});

app.get('/public', function(req, res){
    res.render('public');
});

app.get('/logout', function(req, res){
    res.render('logout');
});




app.listen(3);