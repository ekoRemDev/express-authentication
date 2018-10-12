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
    {userid: '5', password: '1'}

];
// var userIds = [1,2,3,4,5];
var userIds = [
    {userid: 1, password: '1'},
    {userid: 2, password: '2'},
    {userid: 3, password: '3'},
    {userid: 4, password: '4'},
    {userid: 123123, password: '123123'}
];



app.get('/', function(req, res){
    res.render('index');
});

app.get('/login', function (req, res) {
    // if (!req.session.memberLoggedIn) {
    //     res.render('login');
    // } else {
    //     res.redirect('/member');
    // }


    res.render('login');
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
    res.render('signup');
});


// app.post('/signup', function(req, res){
//     if(!req.body.id || !req.body.password){
//         res.status("400");
//         res.send("Invalid details!");
//     } else {
//         Users.filter(function(user){
//             if(user.id === req.body.id){
//                 res.render('signup', {
//                     message: "User Already Exists! Login or choose another user id"});
//             }
//         });
//         var newUser = {id: req.body.id, password: req.body.password};
//         Users.push(newUser);
//         req.session.user = newUser;
//         res.redirect('/protected_page');
//     }
// });




app.get('/member',checkSignIn, function(req, res){
    res.render('member');
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