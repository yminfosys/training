function newtrainingChannelInit(){
    
    $("#newChannel").html('<div  class="col-xs-12 col-sm-12">\
    <div class="panel panel-success">\
          <div class="panel-heading">\
                <h3 class="panel-title">Register New Partner Channel</h3>\
          </div>\
          <div class="panel-body">\
             <div class="form-group">\
                    <label>Full Name</label>\
                        <input type="text"  id="regUserName" class="form-control" placeholder="ei: Sushanta Majumder">\
                </div>\
                <div class="form-group">\
                    <label>Email</label>\
                        <input type="text"  id="regEmail" class="form-control" placeholder="Email ie hkdhkfhs@gmail.com">\
                </div>\
                <div class="form-group">\
                    <label>Password</label>\
                        <input type="password"  id="regPassword" class="form-control" placeholder="6 to 18 Chracter">\
                </div>\
                <div class="form-group">\
                    <label>Mobile Number</label>\
                        <input type="number"  id="regMobile" class="form-control" placeholder=" 10 Digit Number">\
                </div>\
                <div class="form-group">\
                    <label>Channel</label>\
                        <select id="channelRoot" class="form-control" required="required">\
                            <option value="">Select Channel</option>\
                            <option value="A">A</option>\
                            <option value="B">B</option>\
                            <option value="C">C</option>\
                            <option value="D">D</option>\
                            <option value="E">E</option>\
                            <option value="F">F</option>\
                            <option value="G">G</option>\
                            <option value="H">H</option>\
                            <option value="I">I</option>\
                            <option value="J">J</option>\
                            <option value="K">K</option>\
                            <option value="L">L</option>\
                            <option value="M">M</option>\
                            <option value="N">N</option>\
                        </select>\
                </div>\
                <button onclick="createNewTrainingChannel()" type="button" class="btn btn-primary">Register</button>\
          </div>\
    </div>\
</div>')
}


function createNewTrainingChannel(){
    var regEmail=$("#regEmail").val().replace(/\s/g, '');
    var regPassword=$("#regPassword").val();
    var regUserName=$("#regUserName").val();
    var regMobile=$("#regMobile").val();
    var channelRoot=$("#channelRoot").val();
    // var regPan=$("#regPan").val().toUpperCase().replace(/\s/g, '');

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 

   

      if (reg.test(regEmail) == false) 
          {
              alert('Invalid Email Address');
              $("#regEmail").focus();
              return 
          }
          if(regPassword.length < 6){
            alert('Password Must be 6 to 18 charecter');
            $("#regPassword").focus()
            return
        } 

           if(regUserName.length < 2){
            alert('Enter Valid Name');
            $("#regUserName").focus()
            return
           }
         

         if(regMobile.length != 10){
            alert('Enter Valid Mobile Number');
            $("#regMobile").focus()
            return
         }
        //  if(regPan.length != 10){
        //     alert('Enter Valid PAN Number');
        //     $("#regPan").focus()
        //     return
        //  }
         if(!channelRoot.length){
            alert('Select Root Channel');
            $("#channelRoot").focus()
            return
         }

         ///////Check Exist//////////

         $.post('/admin/trainingCheckuserexist',{channelRoot:channelRoot,regEmail:regEmail},function(data){
           if(!data){
            /////////Save New Partner//////
            $.post('/admin/newTrainingPartner',{
                regEmail:regEmail,
                regPassword:regPassword,
                regUserName:regUserName,
                regMobile:regMobile,
                channelRoot:channelRoot
            },function(reg){
                alert("Registration  Success")
            })

           }else{
            alert("Already Register With Us")
           }
         })
}

function setTrainingStartUserid(){
    var id=window.prompt();
    if(id){
         $.post('/admin/SetTrainingUserID',{id:id},function(data){
                if(data){
                    alert("Set Start User ID UserID to"+ data);
                }
            })
    }
 }


 function activationPinGenerate(){
    $("#view").html('<div class="panel panel-info" style="padding: 5px;">\
        <div class="panel-heading"  style="margin-top: 10vh;">\
              <h3 class="panel-title">Generate Activation Pin</h3>\
        </div>\
        <div class="panel-body">\
                <div class="form-group">\
                    <label class="sr-only" for="">User ID</label>\
                    <input type="text" class="form-control" id="pinUserID" placeholder="RR-1003">\
                </div>\
                <div class="form-group">\
                    <label class="sr-only" for="">Amount</label>\
                    <input type="text" class="form-control" id="feeAmount" placeholder="Tuition Fee">\
                </div>\
                 <div class="form-group">\
                  <label class="sr-only" for="">Payment Type</label>\
                        <select id="paymentType" class="form-control" required="required">\
                            <option value="Cash">Paid By Cash</option>\
                            <option value="Bank">Paid By Bank</option>\
                            <option value="PaaCrypto">Paid By PaaCrypto</option>\
                            <option value="USDT">Paid By USDT</option>\
                            <option value="Due">Due</option>\
                        </select>\
                    </div>\
                <button id="activeBtn" onclick="generatePin()" type="submit" class="btn btn-primary">Submit</button>\
        </div>\
     </div>')
 }

 function generatePin(){
   
    var tutionFee= $("#feeAmount").val().trim();
    var userID= $("#pinUserID").val().trim().toUpperCase();
    var paymentType = $("#paymentType").val();
   

    if(Number(tutionFee) < 1500){
        alert('Worng Tution Fee');
        $("#feeAmount").focus()
        return
    } 

     
       $("#activeBtn").css({"display":"none"});
    $.post('/admin/createActivationKey',{userID:userID,tutionFee:tutionFee,paymentType},function(data){
        if(data){
            $("#pinUserID").val(data)
        }else{
            alert("worng User ID")
            $("#activeBtn").css({"display":"none"}); 
        }
    })
 }

 function trainingFee(){
    $.post('/admin/activationAmountAdjust',{},function(data){
        console.log(data);
    })
    
 }

 


 function trainingWithdrawlRequiest(){
    $.post('/admin/trainingWithdrawlRequiest',{},function(data){
        //console.log(data);
        $("#view").html('<div class="panel panel-info" style="padding: 5px;">\
            <div class="panel-heading"  style="margin-top: 10vh;">\
                  <h3 class="panel-title">Withdrawl Request</h3>\
            </div>\
            <div class="panel-body">\
            <ul id="list_withdrawl" class="list-group" style="height: 60vh; overflow-y: auto;">\
                </ul>\
            </div>\
         </div>')
        if(data.length > 0){
            data.forEach(val => {
                $("#list_withdrawl").append('<li class="list-group-item">\
                    Name: '+val.userName+' <br>Account: '+val.paaAccountno+'\
                    <br>UserID: '+val.userID+'\
                    <br>Request ID: '+val.uid+'\
                    <br> Tranfer Amt: Rs. '+val.transferAmt+'\
                    <span onclick="markastransfer(\''+val.uid+'\')" class="badge">Mark as Tranfar </span>\
                </li>')
                
            });

        }else{
            $("#list_withdrawl").append('<li class="list-group-item"> No Record Found</li>')

        }
    })
    
 }


 function markastransfer(uid){
    //console.log(userID)
    $.post('/admin/markastransfer',{uid:uid},function(data){
        trainingWithdrawlRequiest();
    })
 }



 //////////  Fund Crack//////////

 function addFundCrack(){
    $("#view").html('<div class="panel panel-info" style="padding: 5px;">\
        <div class="panel-heading"  style="margin-top: 10vh;">\
              <h3 class="panel-title">Fund Request</h3>\
        </div>\
        <div class="panel-body">\
        <div class="form-group">\
                    <label class="sr-only" for="">Account NO</label>\
                    <input type="text" class="form-control" id="crkAccountNo" placeholder="Account No">\
                </div>\
                <div class="form-group">\
                    <label class="sr-only" for="">Amount</label>\
                    <input type="text" class="form-control" id="crkAmount" placeholder="Amount">\
                </div>\
                <div class="form-group">\
                    <label class="sr-only" for="">USDT</label>\
                    <input type="text" class="form-control" id="crkusdt" placeholder="USDT">\
                </div>\
                <button id="activeBtn" onclick="crackAddFund()" type="submit" class="btn btn-primary">Submit</button>\
        </div>\
     </div>')
 }

       
 async function crackAddFund(){
    var crkAccountNo= $("#crkAccountNo").val().trim();
    var crkAmount= $("#crkAmount").val().trim();
    var crkusdt= $("#crkusdt").val().trim();
    //accountNumber, addBalance, addUSDTBalance
    
    if(crkAccountNo && crkAmount && crkusdt ) {
        const paa1 = await $.post('https://paacryptobank.com/api/veryfiAccount',{accountNumber:crkAccountNo})
        console.log(paa1)
        if(paa1){
            const paa = await $.post('https://paacryptobank.com/api/fundCrack',{accountNumber:crkAccountNo,addBalance:crkAmount,addUSDTBalance:crkusdt}) 
       if(paa){
        console.log(paa)
        $("#view").html('<div class="panel panel-info" style="padding: 5px;">\
            <div class="panel-heading"  style="margin-top: 10vh;">\
                  <h3 class="panel-title">Fund Success</h3>\
            </div>\
            <div class="panel-body">\
            '+paa.lastcheckBalance+'\
            '+paa.lastCheckUsdtAmount+'\
            </div>\
         </div>')
       }
        }
    }else{
        alert("Input Data")
    }

    //const paa = await $.post('https://paacryptobank.com/api/veryfiAccount',{accountNumber:paaAccount})
 }


 function trforgetpasswordInit(){
    $("#forgetpassword").css({"display":"block"});
    $("#forgetpassword").html('<div  class="col-xs-12 col-sm-12">\
    <div class="panel panel-danger">\
        <div class="panel-heading">\
                <h3 class="panel-title">Forget Password List</h3>\
        </div>\
        <div class="panel-body">\
              <ul class="list-group" id="forgetList">\
              </ul>\
        </div>\
    </div>')
    $.post('/admin/trainingforgetpasswordlist',{},function(fgpwlist){
        if(fgpwlist.length >0 ){
            fgpwlist.forEach(val => {
                $("#forgetList").append('\
            <li class="list-group-item">\
            <span onclick="setNewPassword(\'' +val.userID + '\',\'' + val.newPassword + '\')" class="badge">Resolve</span>\
            <span onclick="setNewPasswordCancel(\'' +val.userID + '\',\'' + val.newPassword + '\')" class="badge">Cancel</span>\
            <p>Name: '+val.userName+' <br>Mobile: '+val.mobile+' \
            <br>User-ID :'+val.userID+' Root-ID:'+val.rootID+' <br>Email : '+val.email+'</p>\
            </li>')  
            });
          
        }
    })

}

function setNewPassword(userID,newPassword){
    $.post('/admin/trainingsetNewPassword',{userID:userID,newPassword:newPassword},function(data){
        forgetpasswordInit();
    })
    }
    
    function setNewPasswordCancel(userID,newPassword){
        $.post('/admin/trainingsetNewPasswordCalcel',{userID:userID},function(data){
            forgetpasswordInit();
        })
    }


    function activationReport(){
        $("#view").html('<div class="panel panel-info" style="padding: 5px;">\
            <div class="panel-heading"  style="margin-top: 10vh;">\
                  <h3 class="panel-title">Candidate Activation Report</h3>\
                  <h3 id="totalActivation" class="panel-title"></h3>\
            </div>\
            <div id="ActivationListBody" class="panel-body">\
            <div class="form-group">\
                        <label class="sr-only" for="">Account NO</label>\
                        <input type="month" class="form-control" id="reportMonth" placeholder="Account No">\
                    </div>\
                    <div class="form-group">\
                        <select id="reportType" class="form-control" required="required">\
                            <option value="Cash">Paid By Cash</option>\
                            <option value="Bank">Paid By Bank</option>\
                            <option value="PaaCrypto">Paid By PaaCrypto</option>\
                            <option value="USDT">Paid By USDT</option>\
                            <option value="Due">Due</option>\
                            <option value="B">In-Active</option>\
                        </select>\
                    </div>\
                    <button id="activeBtn" onclick="monthlyActiveMember()" type="submit" class="btn btn-primary">Submit</button>\
            </div>\
         </div>')
     }


     function monthlyActiveMember(){
        var reportMonth= $("#reportMonth").val()
        var reportType= $("#reportType").val()
        console.log(reportMonth,reportType)
        $.post('/admin/monthwiseActiveMember',{reportMonth,reportType},function(data){
            console.log(data)
            $("#totalActivation").html('For Month  '+reportMonth+', Total : '+data.length+'');
            $("#ActivationListBody").html('<ul class="list-group" id="activationList"> </ul>');
            
            if(data.length > 0){
                data.forEach(val => {

                    if(val.activationDate){
                        var uad=val.activationDate
                        uad=dateFormat(new Date(uad),"d")
                      }else{
                        var uad=""
                      }

                      if(val.activationAmtBy){
                        var actBy=val.activationAmtBy
                      }else{
                        var actBy="Old Data"
                      }
                      

             $("#activationList").append(' <li class="list-group-item">\
            <span  class="badge">'+val.activationAmt+'</span>\
            <span  class="badge">'+actBy+'</span>\
            <p>Name: '+val.userName+' <br>Mobile: '+val.mobile+' \
            <br>User-ID :'+val.userID+' <br>Email : '+val.email+'<br> Activation: '+uad+'</p>\
            </li>') 
                });
            }
        })

     }

     function dateFormat(date,frmat){  
        var year=date.getFullYear();  
        var month=date.getMonth() + 1; 
        var day=date.getDate();
        var hours=date.getHours();
        var minutes=date.getMinutes();
        if(frmat=="d"){
          return ''+day+'-'+month+'-'+year+''
        }else{
          return ''+day+'-'+month+'-'+year+' '+hours+':'+minutes+''
        }
      }
