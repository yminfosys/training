var express = require('express');
var router = express.Router();

var dbCon = require('../module/db/con');
var db=require('../module/db/bdModule')
var auto_incriment=require('../module/db/autoIncriment');
var dotenv=require('dotenv').config();

const bcrypt = require('bcrypt');
const saltRounds = 10;


var componant = require('../component/lavelpayment');
const { payment } = require('../component/lavelpayment');

const moment=require('moment');

/* GET home page. */


router.get('/', async function(req, res, next) {
  try {
    var allredylogin=req.cookies.adminID
    console.log(allredylogin)
    res.render('admin/myadmin',{allredylogin:allredylogin})
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.post('/login', async function(req, res, next) {
  try {
    // await dbCon.connectDB();
    // const user= await db.user.findOne({email:req.body.loginEmail})
    // ///console.log(user);
    // await dbCon.closeDB();
    // if(user){
    //   bcrypt.compare(req.body.loginPassword,user.password, async function(err,match){
    //     if(match){
    //       res.cookie("userID", user.userID, { maxAge:  24 * 60 * 60 * 1000 });
    //       res.json(user);
    //     }else{
    //       res.send(null);
    //     }
    //   })
    // }else{
    //   res.send(null);
    // }
    if(req.body.email=="sukanta.uk@gmail.com" || req.body.email=="masud.uk.e@gmail.com"){
      if(req.body.password=="A1b1c3b4*" ){
        res.cookie("adminID", 1, { maxAge:  24 * 60 * 60 * 1000 });
        res.send("success");
      }else{
        res.send("Worng Password");
      }
    }else{
      res.send("Worng Email");
    }
    
    
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

// ////////Profile/////////////
router.post('/logout', async function(req, res, next) {
  res.clearCookie("adminID");
  res.send("ok")

})




router.post('/trainingWithdrawlRequiest', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const user= await db.trainingwithdrawl.find({status:"Pending"})
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/markastransfer', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const user= await db.trainingwithdrawl.findOneAndUpdate({uid:req.body.uid},{$set:{status:"Complete"}})
  await dbCon.closeDB();
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});



router.post('/trainingCheckuserexist', async function(req, res, next) {
  try {
  await dbCon.connectDB()

  const user= await db.traininguser.findOne({$or: [{rootID:req.body.channelRoot},{email:req.body.regEmail}]})
  await dbCon.closeDB();
  //console.log("check done")
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

});

router.post('/newTrainingPartner', async function(req, res, next) {
  try {
  bcrypt.hash(req.body.regPassword, saltRounds, function(err, hash) {
    auto_incriment.auto_incriment("trainingUserID").then(async function(inc_val){
        await dbCon.connectDB()
        const user= await db.traininguser({
        userName:req.body.regUserName,
        userID:'RR-'+inc_val+'',
        rootID:req.body.channelRoot,
        parentID:"",
        directParentID:"",
        parentSide:"",
        activationPin:"",
        email:req.body.regEmail,
        password:hash,
        mobile:req.body.regMobile,
        varyficatinStatus:"Verify"
      })
      await user.save();
      res.json(user)
      //console.log(req.body)
      await dbCon.closeDB();
    })
});
  
} catch (error) {
  console.log(error);
  return error;
}

})



router.post('/SetTrainingUserID', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
  const user= await db.counter.findOneAndUpdate({fild :"trainingUserID"},{$set:{ value: req.body.id}});
  console.log(user)
  await dbCon.closeDB();
  res.send(req.body.id);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/trainingforgetpasswordlist', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const fgpsw= await db.trainingforgetPassword.find({status:"New"});
  
  await dbCon.closeDB();
  res.json(fgpsw);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.post('/trainingsetNewPassword', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const user= await db.traininguser.findOneAndUpdate({userID:req.body.userID},{$set:{password:hash}});
    const fgpsw= await db.trainingforgetPassword.findOneAndUpdate({userID:req.body.userID,status:"New"},{$set:{status:"Resolve"}});
   //console.log(fgpsw)
    await dbCon.closeDB();
    if(user){
      res.send("ok")
    }else{
      res.send("error")
    }

  });
});


router.post('/trainingsetNewPasswordCalcel', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const fgpsw= await db.trainingforgetPassword.findOneAndUpdate({userID:req.body.userID,status:"New"},{$set:{status:"Cancel"}});
   
    await dbCon.closeDB();
    res.send("ok")
  

  });
});


router.post('/monthwiseActiveMember', async function(req, res, next) {
  var mont = new Date(req.body.reportMonth)
  var StartTime = moment(mont).startOf('month').utc();
  var EndTime = moment(mont).endOf('month').utc();
 
    await dbCon.connectDB();
    const user= await db.traininguser.find({activationDate: { $gte: StartTime.toDate(), $lte: EndTime.toDate() },});
   
    await dbCon.closeDB();
    res.json(user)
  

  
});




router.post('/checkuserexist', async function(req, res, next) {
  try {
  await dbCon.connectDB()

  const user= await db.user.findOne({$or: [{rootID:req.body.channelRoot},{email:req.body.regEmail}]})

  await dbCon.closeDB();
  //console.log("check done")
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

})

router.post('/createActivationKey', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const user= await db.traininguser.findOne({userID:req.body.userID});
  if(user){
    if(user.activationPin){
      await dbCon.closeDB();
      res.send(user.activationPin);
    }else{
      ////create pin//////
      var uid = (new Date().getTime()).toString(20);
      const user= await db.traininguser.findOneAndUpdate({userID:req.body.userID},{$set:{
        activationPin:uid,
        activationAmt:req.body.tutionFee,
        activationAmtBy:req.body.paymentType
      }});
      await dbCon.closeDB();
      res.send(uid);
    }
  }else{
    res.send("worng userid")
  }
  
  
} catch (error) {
  console.log(error);
  return error;
}

})



router.post('/updateAmount', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const user= await db.traininguser.findOne({userID:req.body.userID});
  await dbCon.closeDB();
  if(user){
    if(user.activationPin){
      await dbCon.connectDB()
      const user= await db.traininguser.findOneAndUpdate({userID:req.body.userID},{$set:{
        activationAmt:req.body.tutionFee,
        activationAmtBy:req.body.paymentType
      }});
      await dbCon.closeDB();

      res.send("ok");
    }else{
      
    }
  }else{
    res.send("worng userid")
  }
  
  
} catch (error) {
  console.log(error);
  return error;
}

})





router.post('/activationAmountAdjust', async function(req, res, next) {
  try {
  await dbCon.connectDB()
  const user= await db.traininguser.updateMany({activationAmt:"2500"});
  res.json(user)
} catch (error) {
  console.log(error);
  return error;
}

})



router.post('/newPartner', async function(req, res, next) {
  try {
  bcrypt.hash(req.body.regPassword, saltRounds, function(err, hash) {
    auto_incriment.auto_incriment("userID").then(async function(inc_val){
        await dbCon.connectDB()
        const user= await db.user({
        userName:req.body.regUserName,
        userID:inc_val,
        rootID:req.body.channelRoot,
        password:hash,
        email:req.body.regEmail,
        address:req.body.regAddress,
        mobile:req.body.regMobile,
        userType:"New"
      })
      await user.save();
      res.json(user)
      //console.log(req.body)
      await dbCon.closeDB();
    })
});
  
} catch (error) {
  console.log(error);
  return error;
}

})




router.post('/userDetails', async function(req, res, next) {
  try {
    await dbCon.connectDB();
  const user= await db.user.find();
  await dbCon.closeDB();
  res.json(user)
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/SetUserID', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
  const user= await db.counter.findOneAndUpdate({fild :"userID"},{$set:{ value: req.body.id}});
  console.log(user)
  await dbCon.closeDB();
  res.send(req.body.id);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});



router.post('/forgetpasswordlist', async function(req, res, next) {
  try {
    await dbCon.connectDB();
    const fgpsw= await db.forgetPasswor.find({status:"New"});
  
  await dbCon.closeDB();
  res.json(fgpsw);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.post('/setNewPassword', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{password:hash}});
    const fgpsw= await db.forgetPasswor.findOneAndUpdate({userID:Number(req.body.userID),status:"New"},{$set:{status:"Resolve"}});
   //console.log(fgpsw)
    await dbCon.closeDB();
    if(user){
      res.send("ok")
    }else{
      res.send("error")
    }

  });
});


router.post('/setNewPasswordCalcel', async function(req, res, next) {
  bcrypt.hash(req.body.newPassword, saltRounds, async function(err, hash) {
    await dbCon.connectDB();
    const fgpsw= await db.forgetPasswor.findOneAndUpdate({userID:Number(req.body.userID),status:"New"},{$set:{status:"Cancel"}});
   
    await dbCon.closeDB();
    res.send("ok")
  

  });
});


router.post('/addupi', async function(req, res, next) {
  
  try {
    await dbCon.connectDB();
    const upi= await db.upiidlist({
      upiid:req.body.upiid,
      upiName:req.body.upiname,
      upilimit:req.body.upilimit,
      useamount:"0",
      balanceamount:req.body.upilimit,
      upistatus:"new"
    })
    await upi.save();
  
  await dbCon.closeDB();
  res.send("ok");
  }catch (error) {
    console.log(error);
    return error;
  }
  
});

router.post('/upilist', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
    const user= await db.upiidlist.find({upistatus:req.body.upistatus})
  
  await dbCon.closeDB();
  res.json(user);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/upistatusupdate', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
    const upi= await db.upiidlist.findOneAndUpdate({upiid:req.body.upiid},{$set:{upistatus:req.body.upistatus}});
  
  await dbCon.closeDB();
  res.send("upi");
  }catch (error) {
    console.log(error);
    return error;
  }
  
});





router.post('/addusdtrate', async function(req, res, next) {
  
  try {
    await dbCon.connectDB();
    const usdt= await db.totayUSDT.findOne({currency:"usdt"});
    console.log("chek",usdt)
    if(usdt){
      console.log("step1")
      const fgpsw= await db.totayUSDT.findOneAndUpdate({currency:"usdt"},{$set:{usdtrate:req.body.usdt}});
    }else{
      console.log("step12")
      const totayUSDT= await db.totayUSDT({
        usdtrate:req.body.usdt,
        currency:"usdt"
      })
      await totayUSDT.save();
    }
  await dbCon.closeDB();
  res.send("ok");
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/fundrequest', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
    const user= await db.fundrequest.find({fundrequestStatus:"Request"})
  
  await dbCon.closeDB();
  res.json(user);
  }catch (error) {
    console.log(error);
    return error;
  }
  
});


router.post('/acceptFund', async function(req, res, next) {
  try {
    //Active
    await dbCon.connectDB();
    const fund= await db.fundrequest.findOne({refno:req.body.refno});
    const user= await db.user.findOne({userID:fund.userID});

    let lavelrootID = user.rootID;
    const myArray= lavelrootID.split("-");
    var rootID="";
    var L=myArray.length;
    for(i=1; i < myArray.length; i++) {
      if(rootID){
        rootID=''+rootID+'-'+myArray[i-1]+'';
      }else{
        rootID=''+myArray[i-1]+'';
      }
      L=L-1;
      const payme= await payment(L,fund.usdt); 
          // /////// Lavel input////// /////  
          const Lavel= await db.lavelLedger.findOne({rootID:rootID,lavelrootID:lavelrootID,lavel:L});
          if(!Lavel){
            const newlavel= await db.lavelLedger({
                      userName:req.body.regUserName,
                      userID:user.userID,
                      rootID:rootID,
                      lavelrootID:lavelrootID,
                      address:req.body.regAddress,
                      lavel:L,
                      lavelEarning:payme,
                      lavelInvestment:fund.usdt,
                      paidEarninyStatus:"Due",
                    })
                    await newlavel.save();
                  }
  }
  const usereee= await db.user.findOneAndUpdate({userID:fund.userID},{$set:{userType:"Active"}});
  const fundreee= await db.fundrequest.findOneAndUpdate({refno:req.body.refno},{$set:{
    fundrequestStatus:"Accept",
    principalPaid:"0",
    interestPaid:"0"
  }});
  
  await dbCon.closeDB();
  res.send("ok");
  }catch (error) {
    console.log(error);
    return error;
  }
});

router.post('/rejectFund', async function(req, res, next) {
 
  try {
    await dbCon.connectDB();
    const fundreee= await db.fundrequest.findOneAndUpdate({refno:req.body.refno},{$set:{
      fundrequestStatus:"Reject",
      principalPaid:"0",
      interestPaid:"0"
    }});
  
  await dbCon.closeDB();
  res.send("ok");
  }catch (error) {
    console.log(error);
    return error;
  }
  
});



router.post('/commisionIncentiveadd', async function(req, res, next) {
 console.log(req.body)
  try {
    if(req.body.commision){
      var commision=req.body.commision
    }else{
      var commision=0;
    }
    if(req.body.salary){
      var salary=req.body.salary
    }else{
      var salary=0;
    }
    if(req.body.interest){
      var interest=req.body.interest
    }else{
      var interest=0;
    }
    if(req.body.principal){
      var principal=req.body.principal
    }else{
      var principal=0;
    }
    await dbCon.connectDB();
    var total= Number(commision)+Number(salary)+Number(interest)+Number(principal)
    const fund= await db.wallet.findOne({userID:req.body.userID});
    if(fund){
      /////update data/////
      total=Number(total)+ Number(fund.totalamount);
      const fundreee= await db.wallet.findOneAndUpdate({userID:req.body.userID},{$set:{
        commision:commision,
        salary:salary,
        interest:interest,
        principal:principal,
        totalamount:total,
        lastcheckdate:new Date(),
      }});
      await dbCon.closeDB();
      res.send("ok")
    }else{
      ///////add data////
      const addcomision= await db.wallet({
        userID:req.body.userID,
        commision:commision,
        salary:salary,
        interest:interest,
        principal:principal,
        totalamount:total,
        lastcheckdate:new Date(),
      });
      await addcomision.save();
      await dbCon.closeDB();
      res.send("ok")
    }
   
    
   
    
  
 
  }catch (error) {
    console.log(error);
    return error;
  }
  
});







router.get('/status-report', async (req, res) => {
    const { userID ,status} = req.query;
    const query = {};
    if (!userID) {
        return res.status(400).json({ error: 'userID is required' });
    }

    if (status && status !== 'all') {
    query.varyficatinStatus = status === 'NotVerify' ? { $ne: 'Verify' } : 'Verify';
    }

    try {
        await dbCon.connectDB();

        // Step 1: Get the user to find their rootID
        const user = await db.traininguser.findOne({ userID });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

         query.rootID = { $regex: '.*' + user.rootID + '-1.*' , $options: 'i' };

        // Step 2: Find all users with the same rootID
        const users  = await db.traininguser.find(query); 
        
        res.json(users);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: 'Database error', details: err.message });
    } finally {
        await dbCon.closeDB();
    }
});


// userID: '2',
// accounttype: 'New',
// inr: '9002',
// usdt: '100',
// utrno: '456754432346',
// refno: '1712997444193',
// fundrequestStatus: 'Request',
// upiID: 'safsd@tyt',
// upiName: 'Karnolmokuj',
// daterequest: 2024-04-13T08:37:24.249Z,
// __v: 0
// } {
// _id: new ObjectId("66102a6098bb5be63cf16d39"),
// userName: 'Krishna  Swansi',
// userID: 2,
// rootID: 'A-1',
// password: '$2b$10$Uhys/QI4yX1jBsNKG/rCauHm5c9q8bM1hHKzPHSF0mV957GP10PWa',
// email: 'abc@abc.com',
// address: 'hfhgfj yft ytyu',
// mobile: '1234563421',
// regdate: 2024-04-05T16:44:16.465Z,
// __v: 0
// }


// router.post('/oldUserDetails', async function(req, res, next) {
 
//   try {
//     await dbCon.connectDB();
//     const user= await db.user.findOne({userID:req.body.id})
  
//   await dbCon.closeDB();
//   res.json(user);
//   }catch (error) {
//     console.log(error);
//     return error;
//   }
  
// });



// router.post('/paymentSearchID', async function(req, res, next) {
//   try {
//     await dbCon.connectDB();
//     const user= await db.user.findOne({userID:req.body.userID});
//     const lavel= await db.lavelLedger.find({lavelrootID:user.rootID});
//   await dbCon.closeDB();
//   res.json({user:user,lavel:lavel});
//   }catch (error) {
//     console.log(error);
//     return error;
//   }
  
// });
// router.post('/paymentrootIDdetails', async function(req, res, next) {
//   try {
//     await dbCon.connectDB();
//     const user= await db.user.findOne({rootID:req.body.rootID});
//   await dbCon.closeDB();
//   res.json(user);
//   }catch (error) {
//     console.log(error);
//     return error;
//   }
  
// });

// router.post('/markaspaid', async function(req, res, next) {
//   try {
//     await dbCon.connectDB();
//     ////rootID:rootID, lavelrootID:lavelrootID,lave:lave
//     const lavel= await db.lavelLedger.findOneAndUpdate({
//       rootID:req.body.rootID,lavelrootID:req.body.lavelrootID,lavel:req.body.lavel
//     },{$set:{paidEarninyStatus:"Paid",paydate:Date.now()}});
//   await dbCon.closeDB();
//   res.json(lavel);
//   }catch (error) {
//     console.log(error);
//     return error;
//   }
  
// });



// router.post('/updateUser', async function(req, res, next) {
//   try {
//     await dbCon.connectDB();
//     const user= await db.user.findOneAndUpdate({userID:req.body.userIDReplace},{$set:{
//       userName:req.body.nameReplace,
//       email:req.body.emailReplace,
//       address:req.body.addressReplace,
//       mobile:req.body.mobileReplace,
//       panNo:req.body.panReplace
//     }});
  
//   await dbCon.closeDB();
//   res.json(user);
//   }catch (error) {
//     console.log(error);
//     return error;
//   }
  
// });





// const user= await db.user.findOneAndUpdate({userID:req.body.userID},{$set:{
//   adharNo:req.body.Aadhar,
//   westrenUnionUser:req.body.wuID,
//   westrenUnionPass:req.body.wuPsd,
//   BinanceUser:req.body.BinanceID,
//   BinancePass:req.body.BinancePsd,
//   EmlID:req.body.EmlID,
//   EmlPsd:req.body.EmlPsd,
//   BankDelais:req.body.BankDelais
// }});


module.exports = router;
