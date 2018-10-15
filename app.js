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

// var Users = [
//     {userid: '1', password: '1'},
//     {userid: '2', password: '1'},
//     {userid: '3', password: '1'},
//     {userid: '4', password: '1'},
//     {userid: '5', password: '1'}
//
// ];
// var userIds = [1,2,3,4,5];
var userIds = [
    {userid: 1, password: '1'},
    {userid: 2, password: '2'},
    {userid: 3, password: '3'},
    {userid: 4, password: '4'},
    {userid: 123123, password: '123123'},
    {userid: 6, password: '6'},
];

var messages = [
    {messageid: 1, messageUserId:1, message:'message 1 - 1'},
    {messageid: 2, messageUserId:1, message:'message 1 - 2'},
    {messageid: 3, messageUserId:2, message:'message 2 - 1'},
    {messageid: 4, messageUserId:3, message:'message 3 - 1'},
    {messageid: 5, messageUserId:4, message:'message 4 - 1'},
    {messageid: 6, messageUserId:1123123, message:'message 123123 - 1'},
];



app.get('/', function(req, res){
    res.render('index');
});

app.get('/login', function (req, res) {
    if(req.session.memberLoggedIn){
        res.redirect('/member');
    }else{
        res.render('login');
    }
});

app.post('/login',(req,res)=>{
    // check session values
    if(req.session.memberLoggedIn){
        res.redirect('/member');
    }else{
        var found = userIds.find(function(element) {
            if(element.userid === parseInt(req.body.id) && element.password === req.body.password){
                return element.userid === parseInt(req.body.id);
            }
        });

        if(found){
            console.log('Logged In');
            req.session.memberID = parseInt(req.body.id);
            req.session.memberLoggedIn = 'loggedin';
            res.redirect('/member');
        }else{
            console.log('Not A member');
            res.redirect('/signup');
        }
    }
});

app.get('/signup', function(req, res){
    if(req.session.memberLoggedIn){
        res.redirect('/member');
    }else{
        res.render('signup');
    }
});


app.post('/signup', function(req, res){
    // console.log(userIds);
    // console.log('======================');
    // console.log(req.body.id);
    // console.log(req.body.password);

    var found = userIds.find(function(element) {
        if(element.userid === parseInt(req.body.id)){
            return element.userid === parseInt(req.body.id);
        }
    });

    if (found) {
        console.log('There is already In Use');
        res.redirect('/signup');
    } else {
        console.log('New Member');
        var newUser = {userid: req.body.id, password: req.body.password};
        userIds.push(newUser);
        req.session.memberID = parseInt(req.body.id);
        req.session.memberLoggedIn = 'loggedin';
        res.redirect('/member');
    }

    // if(!req.body.id || !req.body.password){
    //     res.status("400");
    //     // res.send("Invalid details!");
    // } else {
    //     userIds.filter(function(user){
    //         if(user.userid === req.body.id){
    //             res.render('signup', {
    //                 message: "User Already Exists! Login or choose another user id"});
    //         };
    //         console.log('already');
    //     });
    //     var newUser = {userid: req.body.id, password: req.body.password};
    //     userIds.push(newUser);
    //     req.session.user = newUser;
    //     res.redirect('/member');
    // }
});




app.get('/member',checkSignIn, function(req, res){
    res.render('member',{
        userid : req.session.memberID
    });

});
app.use('/member', function(err, req, res, next){
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login');
});



app.get('/public', function(req, res){
    res.render('public');
});

app.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/login');
});


function checkSignIn(req, res,next){
    if(req.session.memberLoggedIn){
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.memberLoggedIn);
        next(err);  //Error, trying to access unauthorized page!
        // res.render('login')
    }
}

app.listen(3);