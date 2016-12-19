var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var monk = require('monk');
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();
var session= require('express-session');
var MongoStore = require('connect-mongo')(session);
router.use(session({
  secret:'1234DSFs@adf1234!@#$asd',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({url: 'mongodb://localhost:27017/mydb'})
}));
router.use(bodyParser.urlencoded({ extended: false }));
//회원가입
router.post('/insert', function(req, res, next) {
  hasher({password:req.body.pw},function(err, pass, salt, hash){
    var userid = req.body.userid;
    var pw = hash;
    var salt = salt;
    var name = req.body.name;
    var addr = req.body.addr;
    var phone = req.body.phone;
    db = req.db;
    db.get('users').insert({'userid':userid,'pw':pw, 'salt':salt, 'name':name, 'addr':addr, 'phone':phone},function(err,doc){
           if(err){
             console.log(err);
             res.status(500).send('update error');
             return;
           }
           var m = 'script';
           var message = "alert('회원가입되었습니다. 가입한 아이디로 로그인해주세요');";
           res.render('login', {message : message, m : m});
       });
  });

});


//프로젝트 둘러보기
router.get('/pr_list',function(req,res){
	db=req.db;
	db.get('pr').find({},{sort : {"_id" :-1}}, function(err,doc){
		if(err) console.log('err');
		res.render('pr_list',{ data : doc, session: req.session.username, name : req.session.uname})

	})

})
router.get('/pr_view/:id', function(req,res){
	var o_id=monk.id(req.params.id);
	db=req.db;
	db.get('pr').find({'_id':o_id}, function(err,docs){
		if(err) console.log('err');
		res.render('pr_view',{datas:docs, session: req.session.username, name : req.session.uname});

	})
})
router.get('/pr_revi/:id', function(req,res){
  var o_id=monk.id(req.params.id);
  db=req.db;
  db.get('pr').find({'_id':o_id}, function(err,docs){
    if(err) console.log('err');
    res.render('pr_revi',{data:docs, session: req.session.username, name : req.session.uname});

})
})
//댓글
router.post('/comment', function(req, res, next) {
	var username = req.session.username;
	var _id=monk.id(req.body.objectid);
	var message=req.body.message;
  var c_time= new Date();
    var str=c_time.getFullYear()+"-";
    str+=(c_time.getMonth()+1)+"-";
    str+=c_time.getDate();
    c_time=str;
    db = req.db;
	db.get('pr').update({'_id':_id},{$push:{"comment"   :
            {
                "userid"  : username,
                "message" : message,
                "time"    : c_time
            }
           }},function(err,doc){
	       if(err){
	    	   console.log(err);
	    	   res.status(500).send('update error');
	    	   return;
	       }
	       res.redirect('/pr_view/'+req.body.objectid);

	   });
});
//나의 후원 현황 & 나의 프로젝트
router.get('/mysupport/:id', function(req,res){
  db=req.db;
  if(req.params.id==0){
    db.get('pr').find({'patron' : { $elemMatch : {"userid" : req.session.username}}}, function(err,doc){
      if(err) console.log('err');
      if(doc==undefined){
        res.send('데이터가없습니다');
      }else{
        res.render('mysupport', { data : doc, session: req.session.username, name : req.session.uname, type : req.params.id });
      }
    });
  }else{
    var userid = req.session.username;
    db.get('pr').find({'userid' : userid }, {sort : {"_id" : -1}}, function(err,doc){
      if(err) console.log('err');
      res.render('mysupport', { data : doc, session: req.session.username, name : req.session.uname, type : req.params.id});
    })
  }

})

//내 정보 수정
router.post('/myinfoupdate', function(req, res, next) {
  hasher({password:req.body.pw},function(err, pass, salt, hash){
  var userid = req.body.userid;
	var pw = hash;
  var salt=salt;
  var addr = req.body.addr;
  var phone = req.body.phone;
	db = req.db;
	db.get('users').update({'userid':userid}, { $set : {'pw' : pw, 'addr' : addr,'salt':salt, 'phone' : phone}}, function(err,doc){
       if(err){
    	   console.log(err);
    	   res.status(500).send('update error');
    	   return;
	       }
       res.redirect('/');
	   });
   });
});

router.post('/pr_del', function(req, res, next) {
	var _id=monk.id(req.body.objectid);

	db = req.db;
	db.get('pr').remove({'_id':_id},function(err,doc){
	       if(err){
	    	   console.log(err);
	    	   res.status(500).send('update error');
	    	   return;
	       }
	       res.status(200).redirect('/mysupport/1');

	   });
});

router.post('/pr_revi', function(req, res,next){
  var gift=[];
  var p_intro=req.body.p_intro;
  var p_content=req.body.p_content;
  var _id=monk.id(req.body.objectid);
  var gift_p=req.body.gift_p;
  var price_g=req.body.price_g;

  if(Array.isArray(gift_p)){
  for(var i=0; i<gift_p.length;i++){
    gift.push({"product":gift_p[i],"price":price_g[i] })
  };}else{
    gift.push({"product":gift_p,"price":price_g })
  }
db=req.db;
if(gift_p){
  db.get('pr').update({'_id':_id}, { $set : {'p_intro' : p_intro, 'p_content' : p_content} , $push:{"gift_p" : {$each:gift}}}, function(err,doc){
       if(err){
    	   console.log(err);
    	   res.status(500).send('update error');
    	   return;
	       }
       res.redirect('/mysupport/1');
	   });}
     else{
       db.get('pr').update({'_id':_id}, { $set : {'p_intro' : p_intro, 'p_content' : p_content}} , function(err,doc){
            if(err){
             console.log(err);
             res.status(500).send('update error');
             return;
             }
            res.redirect('/mysupport/1');
         });
     }
})
//후원하기
router.post('/support', function(req, res, next) {
  var supfund=req.body.supportfund;
  var username = req.session.username;
  var product =req.body.giftselected;
	var _id=monk.id(req.body.objectid);

  db = req.db;
	db.get('pr').update({'_id':_id},{$push:{"patron"   :
            {
                "userid"  : username,
                "fund" : supfund,
                "product" : product
            }
           }},function(err,doc){
	       if(err){
	    	   console.log(err);
	    	   res.status(500).send('update error');
	    	   return;
	       }
	       res.redirect('/pr_view/'+req.body.objectid);

	   });
});

router.post('/suppcan', function(req,res,next){
  var username=req.session.username;
  var _id=monk.id(req.body.objectid);

  db = req.db;
  db.get('pr').update({'_id':_id},{$pull:{"patron"   :
            {
              "userid"  : username

            }
           }},function(err,doc){
         if(err){
           console.log(err);
           res.status(500).send('update error');
           return;
         }
         res.redirect('/pr_view/'+req.body.objectid);

     });
})
//회원 탈퇴

module.exports = router;
