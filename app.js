var express = require('express');
  var path = require('path');
  var bodyParser = require('body-parser');
  var app = express();
  var monk = require('monk');
  var favicon=require('serve-favicon');
  var session= require('express-session');
  var MongoStore = require('connect-mongo')(session);
  var db = monk('mongodb://localhost:27017/mydb');
  var bkfd2Password = require("pbkdf2-password");
  var hasher = bkfd2Password();
  var multer = require('multer');
  var _storage = multer.diskStorage({
     destination: function (req, file, cb) {
      cb(null, './public/images/uploads/')
    },
     filename: function (req, file, cb) { //같은 파일 올리면 에러뜸 이거 고쳐야됨;
       cb(null, file.originalname );
     }
   })
   var upload = multer({ storage: _storage });
   var fs=require('fs');
  app.locals.pretty=true;
  var logger = require('morgan');
  var mongo = require('./routes/mongo.js');
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.use('/', mongo);
app.use(session({
  secret:'1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({url: 'mongodb://localhost:27017/mydb'})
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(favicon(path.join(__dirname, 'public/images/S2.ico')));
// view engine setup
//app.set('views', path.join(__dirname, 'views'))
app.set('views', './views');
app.set('view engine', 'jade');
app.use(logger('dev'));
app.listen(3000, function(){
    console.log('Conneted 3000 port!');
});
//홈페이지
app.get('/',function(req,res){

  db=req.db;
  db.get('pr').find({},{sort : {"_id" :-1}}, function(err,doc){
		if(err) console.log('err');

  if(req.session.username){
        res.render('index', {data : doc, session : req.session.username, name : req.session.uname});
  }else{
      res.render('index',{data : doc});
  }
  })
})

//회원가입
app.get('/join',function(req,res){
  res.render('join');
})
//로그인
app.get('/login',function(req,res){
  res.render('login')
})
app.post('/login', function(req,res){
  var userid=req.body.username;
  var userpw=req.body.password;
  db = req.db;
  db.get('users').findOne({'userid':userid},function(err,doc){
    if(err) console.log('err');
      //아이디 존재시 비밀번호 확인
    if(doc){
      return hasher({password:userpw, salt:doc.salt}, function(err, pass, salt, hash){
        if(doc.pw===hash)
        {req.session.username=userid;
          req.session.uname=doc.name;
          req.session.save(function(){
          res.redirect('/');
        });
        }
        else{
          var m = 'script';
          var message = "alert('비밀번호가 틀렸습니다.');";
          res.render('login', {message : message, m : m});
        }
      })

    }
    else{
      var m = 'script';
      var message = "alert('아이디가 없습니다.');";
      res.render('login', {message : message, m : m});
    }

  });
})
//로그아웃
app.get('/logout', function(req,res){
  req.session.destroy();
  res.redirect('/');
})

//프로젝트 등록하기
app.get('/pr_reg', function(req,res){
  if(req.session.username){
  res.render('pr_reg',{session : req.session.username, name : req.session.uname});
 }else{
   var m = 'script';
   var message = "alert('프로젝트 등록은 로그인 후에 이용가능합니다.');";
   res.render('login', {message : message, m : m});
  }
})
app.post('/input_form1', upload.fields([{ name: 'userfile', maxCount: 5 }]) , function(req,res){
  db = req.db;
  var gift=[];
  var p_name=req.body.p_name;
  var goal_date=req.body.goal_date;
  var goal_fund=req.body.goal_fund;
  var p_intro=req.body.p_intro;
  var p_content=req.body.p_content;
  var gift_p=req.body.gift_p;
  var price_g=req.body.price_g;
  var userid=req.session.username;
  var p_reg_date= new Date();
//  if(req.files['userfile']){
//    var userimage='/images/uploads/' + req.files['userfile'][0].originalname;

  if(req.files['userfile']){
    var userimage=[];
    for(var i=0; i<req.files['userfile'].length; i++){
    userimage.push('/images/uploads/' + req.files['userfile'][i].originalname);
  }
} else{
    var userimage=['/images/uploads/noimg.jpg'];
  }
  var str=p_reg_date.getFullYear()+"-";
  str+=(p_reg_date.getMonth()+1)+"-";
  str+=p_reg_date.getDate();
  p_reg_date=str;
  if(Array.isArray(gift_p)){
  for(var i=0; i<gift_p.length;i++){
    gift.push({"product":gift_p[i],"price":price_g[i] })
  };}else{
    gift.push({"product":gift_p,"price":price_g })
  }
  if(gift_p){
	db.get('pr').insert({'p_name':p_name,'p_image':userimage ,'userid':userid, 'p_reg_date':p_reg_date, 'goal_date':goal_date, 'goal_fund':goal_fund, 'p_intro':p_intro,'p_content':p_content,'gift_p':gift},function(err,doc){
	       if(err){
	    	   console.log(err);
	    	   res.status(500).send('update error');
	    	   return;
	       }
   res.redirect('/');
 });}else{
   db.get('pr').insert({'p_name':p_name,'p_image':userimage ,'userid':userid, 'p_reg_date':p_reg_date, 'goal_date':goal_date, 'goal_fund':goal_fund, 'p_intro':p_intro,'p_content':p_content},function(err,doc){
          if(err){
            console.log(err);
            res.status(500).send('update error');
            return;
          }
     res.redirect('/');
   });
 }
})
//후원하기
app.get('/support',function(req,res){
  if(req.session.username){
  res.render('support',{session : req.session.username, name : req.session.uname});
 }else{
   res.redirect('/login')
  }
})
//내정보 수정 페이지
app.get('/myinfo', function(req,res){
  db = req.db;
  db.get('users').findOne({'userid':req.session.username},function(err,doc){
    if(err) console.log('err');
    res.render('myinfo', {data : doc , session : req.session.username, name : req.session.uname});
  });
})
//탈퇴하기 22
app.get('/leave', function(req,res){
  if(req.session.username){
    var isExist;
    var userid = req.session.username;
    db = req.db;
    //등록한 프로젝트 중에 진행중이면 삭제 불가
    db.get('pr').find({'userid' : userid}, function(err,doc){
      if(err)console.log('err');
      if(doc.length==0)
          isExist = false;
      else
          isExist = true;
     res.render('leave', { session : req.session.username, name : req.session.uname,  data : doc, isExist : isExist});
    })
  }
  else {
    res.redirect('/login');
  }
})

app.post('/leave', function(req,res){
  var userid = req.session.username;
	db = req.db;
	db.get('users').remove({'userid':userid},function(err,doc){
     if(err){
  	   console.log(err);
  	   res.status(500).send('update error');
  	   return;
  }
  var m = 'script';
  var message = "alert('회원탈퇴 되었습니다. 그 동안 이용해 주셔서 감사합니다.')";
  req.session.destroy();
  res.render('login', { message : message, m:m});
        	   });
})
module.exports = app;
