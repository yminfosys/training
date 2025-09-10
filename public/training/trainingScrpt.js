/* trainingScrpt.js
   Cleaned version — removed stray backslash-escapes and improved readability.
   Requires jQuery and Bootstrap JS loaded before this file.
*/

$(document).ready(function() {
  var allredyloginuserID = $("#allredyloginuserID").val();
  var sponsID = $("#sponsID").val();
  var sponsSide = $("#sponsSide").val();

  if (allredyloginuserID) {
    getUserprofile(allredyloginuserID);
    $("#logout").show();
  } else {
    if (sponsID && sponsSide) {
      regClick(sponsID, sponsSide);
      $("#logout").hide();
    } else {
      loginClick();
      $("#logout").hide();
    }
  }
});

/* ---------- UI rendering + interactions ---------- */

function loginClick() {
  $("#view").html(`
    <div class="row justify-content-center my-5">
      <div class="col-11 col-sm-9 col-md-6">
        <div class="text-center mb-4">
          <h2 class="fw-bold">Log in</h2>
          <p class="muted-small">Fill the form to log in</p>
        </div>

        <div class="card custom mb-3">
          <div class="card-body">
            <div class="mb-3">
              <label for="loginEmail" class="form-label muted-small">Email address</label>
              <input type="email" class="form-control" id="loginEmail" placeholder="you@example.com">
            </div>

            <div class="mb-3">
              <label for="loginPassword" class="form-label muted-small">Password</label>
              <div class="input-group">
                <input type="password" class="form-control pw-input" id="loginPassword" placeholder="Enter password">
                <span class="input-group-text pw-toggle" data-target="#loginPassword" title="Show / hide password">
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </span>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mb-2">
              <a class="muted-small" href="javascript:void(0)" onclick="forgetpassword()">Forgot password?</a>
              <button id="loginBtn" onclick="loginProcess()" class="btn btn-primary">Login</button>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  `);

  attachPwToggles();
}

function regClick(userID, side) {
  $("#view").html(`
    <div class="row justify-content-center my-4">
      <div class="col-11 col-sm-10 col-md-6">
        <div class="text-center mb-3">
          <h2 class="fw-bold">Register</h2>
          <p class="muted-small">Create an account</p>
        </div>

        <div class="card custom mb-3">
          <div class="card-body">
            <div class="mb-3">
              <label class="form-label muted-small">Full Name</label>
              <input type="text" id="userName" class="form-control" placeholder="Name as per Govt. ID">
            </div>

            <div class="mb-3">
              <label class="form-label muted-small">Email address</label>
              <input type="email" id="email" class="form-control" placeholder="you@example.com">
            </div>

            <div class="mb-3">
              <label class="form-label muted-small">Mobile Number</label>
              <div class="input-group">
                <span class="input-group-text">+91</span>
                <input type="tel" id="mobileNo" class="form-control" placeholder="10 digit mobile">
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label muted-small">Password</label>
              <div class="input-group">
                <input type="password" id="password" class="form-control pw-input" placeholder="Create a strong password">
                <span class="input-group-text pw-toggle" data-target="#password" title="Show / hide password">
                  <i class="fa fa-eye" aria-hidden="true"></i>
                </span>
              </div>
              <small class="muted-small">Use 8-18 characters with a mix of letters, numbers & symbols.</small>
            </div>

            <div class="d-grid mt-3">
              <input type="hidden" id="refID" value="${userID}">
              <input type="hidden" id="parentSide" value="${side}">
              <button class="btn btn-primary" onclick="newRegister()">Register</button>
            </div>
          </div>
        </div>

        <p class="text-center muted-small">Already have an account? <a href="javascript:void(0)" onclick="loginClick()">Login</a></p>
      </div>
    </div>
  `);

  attachPwToggles();
}

/* attach pw toggle to elements with .pw-toggle */
function attachPwToggles() {
  $('.pw-toggle').off('click').on('click', function(){
    var target = $(this).data('target');
    var $input = $(target);
    if(!$input.length){
      $input = $(this).closest('.input-group').find('.pw-input');
    }
    if($input.length){
      if($input.attr('type') === 'password'){
        $input.attr('type','text');
        $(this).find('i').removeClass('fa-eye').addClass('fa-eye-slash');
      } else {
        $input.attr('type','password');
        $(this).find('i').removeClass('fa-eye-slash').addClass('fa-eye');
      }
      $input.focus();
    }
  });
}

/* ---------- form actions (AJAX) ---------- */

function loginProcess(){
  var loginEmail = $("#loginEmail").val() ? $("#loginEmail").val().trim().toLowerCase() : '';
  var loginPassword = $("#loginPassword").val() ? $("#loginPassword").val().trim() : '';

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(loginEmail) == false) {
    alert('Invalid Email Address');
    $("#loginEmail").focus();
    return;
  }

  if (loginPassword.length < 6) {
    alert('Password must be 6 to 18 characters');
    $("#loginPassword").focus();
    return;
  }

  $.post('/training/loginprocess', { loginPassword: loginPassword, loginEmail: loginEmail }, function(user){
    if (user) {
      location.replace("/training");
    } else {
      alert("Wrong Credential");
    }
  });
}

function forgetpassword(){
  var loginEmail = $("#loginEmail").val() ? $("#loginEmail").val().trim() : '';
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(loginEmail) == false) {
    alert('Invalid Email Address');
    $("#loginEmail").focus();
    return;
  }
  var newPasw = prompt("Enter New Password (min 6 chars)");
  if (!newPasw || newPasw.length < 6) {
    alert('Password must be at least 6 characters');
    return;
  }
  $.post('/training/newPasswordRequest', { loginEmail: loginEmail, newPasw: newPasw }, function(data){
    if (data) {
      alert("Your request to set a new password has been sent to admin. Our executive will contact you soon.");
    } else {
      alert("User ID not matched / already has a pending request");
    }
  });
}

function newRegister(){
  var userName = $("#userName").val() ? $("#userName").val().trim().toUpperCase() : '';
  var email = $("#email").val() ? $("#email").val().replace(/\s/g, '').toLowerCase() : '';
  var mobileNo = $("#mobileNo").val() ? $("#mobileNo").val().trim() : '';
  var password = $("#password").val() ? $("#password").val().trim() : '';
  var parentSide = $("#parentSide").val() ? $("#parentSide").val().trim() : '';
  var refID = $("#refID").val() ? $("#refID").val().trim() : '';

  if (userName.length < 3) {
    alert('Enter Full Name');
    $("#userName").focus();
    return;
  }

  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(email) == false) {
    alert('Invalid Email Address');
    $("#email").focus();
    return;
  }

  if (mobileNo.length != 10) {
    alert('Enter valid mobile number');
    $("#mobileNo").focus();
    return;
  }

  if (password.length < 8) {
    alert('Password must be 8 to 18 characters');
    $("#password").focus();
    return;
  }

  $("#registerBtn").attr('disabled','disabled');

  $.post('/training/checkExistuser', { mobileNo: mobileNo, email: email }, function(data){
    if (!data) {
      $.post('/training/newregister', {
        email: email,
        mobileNo: mobileNo,
        password: password,
        userName: userName,
        parentSide: parentSide,
        refID: refID
      }, function(resp){
        if (resp) {
          alert("Registration success");
          location.replace("/training");
        } else {
          alert("Technical error. Try again");
          $("#registerBtn").removeAttr('disabled');
        }
      });
    } else {
      alert("Your ID / Number is already registered with us");
      $("#registerBtn").removeAttr('disabled');
    }
  }).fail(function(){
    alert("Network error - try again");
    $("#registerBtn").removeAttr('disabled');
  });
}

/* ---------- preserved original functions (cleaned strings) ---------- */

function getUserprofile(userID){
  $("#waitingGif").css({"display":"block"});
  $.post('/training/earningCalculation',{userID:userID},function(user){
    mainContent(user);
    $("#waitingGif").css({"display":"none"});
  }).fail(function(){
    $("#waitingGif").css({"display":"none"});
  });
}

function mainContent(user){
  var uad = "";
  if(user && user.activationDate){
    uad = dateFormat(new Date(user.activationDate),"d");
  }
  $("#view").html(`
    <div class="row" style="height: 10vh; margin-top: 3vh;">
      <div class="col">
        <ul class="list-group">
          <li class="list-group-item" style="background-color:#09f4f0;">
            <div class="row">
              <div class="col-3">
                <div>
                  <img style="width: 10vh; height: 10vh; border-radius: 10px;" src="/images/other/profile-icon-9.png" class="img-fluid" alt="profile" />
                </div>
              </div>
              <div class="col-9">
                <span style="font-size: 20px;"><strong>${user.userName || ''}</strong></span>
                <br>ID : ${user.userID || ''}
                <br>Activation Date: ${uad}
              </div>
            </div>
          </li>
        </ul>
      </div>

      <div style="height: 10vh; margin-top: 1vh;" class="col-12">
        <div class="row">
          <div id="profile" style="display: none;" class="col-12"></div>
          <div id="levelView" style="display: none;" class="col-12"></div>
          <div id="viewmenu" class="col-12"></div>
          <div id="viewwallet" class="col-12"></div>
          <div id="viewfooter" class="col-12"></div>
        </div>
      </div>
    </div>
  `);

  var active = (user && user.varyficatinStatus === "Verify") ? "Verify" : "NotVerify";
  viewmenu(user.userID, active);
  generalData(user.userID);
}

function dateFormat(date,frmat){
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  if(frmat == "d"){
    return day + '-' + month + '-' + year;
  } else {
    return day + '-' + month + '-' + year + ' ' + hours + ':' + minutes;
  }
}

function profile(userID){
  $.post('/training/GetUser',{userID:userID},function(user){
    var conteL = 'https://richrova.co.uk/training?refid=' + user.userID + '&side=L';
    var conteR = 'https://richrova.co.uk/training?refid=' + user.userID + '&side=R';
    $("#profile").css({"display":"block"});
    $("#profile").html(`
      <ul class="list-group">
        <li class="list-group-item">Name : ${user.userName}
          <span onclick="closingElement('profile')" style="color:red; float:right; border-radius: 10px; border: 1px solid #0f0707;" class="badge">X</span>
        </li>
        <li class="list-group-item">Email : ${user.email}</li>
        <li class="list-group-item">Mobile : ${user.mobile}</li>
        <li class="list-group-item"><strong>Copy Left-Link</strong> : ${conteL}  <span onclick="copyContent('${conteL}')" style="margin-left: 20px;"><i class="fa fa-clone" aria-hidden="true"></i></span></li>
        <li class="list-group-item"><strong>Copy Right-Link</strong> : ${conteR}  <span onclick="copyContent('${conteR}')" style="margin-left: 20px;"><i class="fa fa-clone" aria-hidden="true"></i></span></li>
        <li class="list-group-item">
          <a onclick="changePasswordinit(${user.userID})" id="newPaswBtn" class="btn btn-xs btn-primary">Change Password</a>
          <p id="changePasw"></p>
        </li>
      </ul>
    `);
  });
}

function viewmenu(userID, active){
  var dd;
  if(active === "Verify"){
    dd = `
      <div class="col-4 mb-3">
        <div class="card" onclick="profile('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-user-circle-o" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Profile</p>
          </div>
        </div>
      </div>`;
  } else {
    dd = `
      <div class="col-4 mb-3">
        <div class="card" onclick="accountActivate('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(red, #FFD700); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-check-circle" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Activate Now</p>
          </div>
        </div>
      </div>`;
  }

  $("#viewmenu").html(`
    <div class="row" style="margin-top: 2vh;">
      <div class="col-4 mb-3">
        <div class="card" onclick="wellcomLetter('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-envelope" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Welcome Letter</p>
          </div>
        </div>
      </div>
      ${dd}
      <div class="col-4 mb-3">
        <div class="card" onclick="createReferral('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-user-plus" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Referral Link</p>
          </div>
        </div>
      </div>

      <div class="col-4 mb-3">
        <div class="card" onclick="earningData('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-inr" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Total Earning</p>
          </div>
        </div>
      </div>

      <div class="col-4 mb-3">
        <div class="card" onclick="withdrawalInit('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-university" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Bank Withdraw</p>
          </div>
        </div>
      </div>

      <div class="col-4 mb-3">
        <div class="card" onclick="geonology('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-users" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Genealogy Tree</p>
          </div>
        </div>
      </div>

      <div class="col-4 mb-3">
        <div class="card" onclick="myDirect('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-sitemap" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">My Directs</p>
          </div>
        </div>
      </div>

     <div class="col-4 mb-3">
      <div class="card" onclick="myTeamDetailsAll('${userID}')">
        <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center; cursor: pointer;">
          <span><i style="font-size: 25px;" class="fa fa-yelp" aria-hidden="true"></i></span>
          <p class="card-text text-center" style="font-size:small; font-weight: bold;">My Team Details</p>
        </div>
      </div>
    </div>

      <div class="col-4 mb-3">
        <div class="card" onclick="groupTrade('${userID}')">
          <div class="card-body" style="height: 11vh; background-image: linear-gradient(#FFD700,#dc6714bd); color: #6617dc; text-align: center;">
            <span><i style="font-size: 25px;" class="fa fa-handshake-o" aria-hidden="true"></i></span>
            <p class="card-text text-center" style="font-size:small; font-weight: bold;">Group Trade</p>
          </div>
        </div>
      </div>
    </div>
    <div id="generalData" style="display:none; background-image: linear-gradient(#bbb58e,#dc6714bd); color: #041b2b; border-radius: 10px;"></div>
  `);
}

function generalData(userID){
  $.post('/training/generalData',{userID:userID},function(data){
    var total = Number(data.leftCount) + Number(data.rightCount);
    var totalVerify = Number(data.leftVerify) + Number(data.rightVerify);
    $("#generalData").css({"display":"block"});
    $("#generalData").html(`
      <div class="row m-1">
        <div class="col">
          <p style="text-align: center; font-size: 30px; padding: 2px; font-weight: bolder;">Team Overview</p>
        </div>
      </div>
      <div class="row m-1">
        <div class="col-4" style="height: 10vh;">
          <span>Total Team</span><br>
          <p class="text-center mt-3">${total}</p>
        </div>
        <div class="col-4">
          <span>Total Left</span><br>
          <p class="text-center mt-3">${data.leftCount}</p>
        </div>
        <div class="col-4">
          <span>Total Right</span><br>
          <p class="text-center mt-3">${data.rightCount}</p>
        </div>
      </div>
      <div class="row m-1">
        <div class="col-4" style="height: 10vh;">
          <span>Total Verify</span>
          <p class="text-center mt-3">${totalVerify}</p>
        </div>
        <div class="col-4">
          <span>Left Verify</span>
          <p class="text-center mt-3">${data.leftVerify}</p>
        </div>
        <div class="col-4">
          <span>Right Verify</span>
          <p class="text-center mt-3">${data.rightVerify}</p>
        </div>
      </div>
    `);
  });
}

function accountActivate(userID){
  $("#view1").css({"display":"block"});
  $("#view").css({"display":"none"});
  $("#view1").html(`
    <div class="row">
      <div class="col-12">
        <div class="mb-3 p-3">
          <span onclick="closingElement('view1')" style="color:red; float:right; border-radius: 10px; border: 1px solid #0f0707;" class="badge">X</span>
          <label class="form-label">Enter Activation PIN</label>
          <input type="text" class="form-control" id="activationPinNo">
          <div class="form-text">This one time Activation key is used to activate your Account</div>
        </div>
        <div class="mb-3 p-3">
          <div class="text-center">
            <button id="btn1" onclick="activateAccountUser('${userID}')" class="btn btn-primary text">Activate Now</button>
          </div>
        </div>
      </div>
    </div>
  `);
}

function activateAccountUser(userID){
  var activationPinNo = $("#activationPinNo").val().trim();
  if(activationPinNo){
    $("#btn1").css({"display":"none"});
    $.post('/training/activateAccountUser',{userID:userID,activationPinNo:activationPinNo},function(data){
      if(data === "ok"){
        location.replace("/training");
      } else {
        alert("Incorrect Pin");
        $("#btn1").css({"display":"block"});
      }
    });
  } else {
    $("#btn1").css({"display":"block"});
  }
}

function createReferral(userID){
  var conteL = 'https://richrova.co.uk/training?refid=' + userID + '&side=L';
  varieConteL = encodeURI(conteL);
  var conteR = 'https://richrova.co.uk/training?refid=' + userID + '&side=R';
  var conteRenc = encodeURI(conteR);

  $("#view1").css({"display":"block"});
  $("#view").css({"display":"none"});
  $("#view1").html(`
    <div class="row">
      <div class="col-12" style="margin-top: 2vh;">
        <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px; border: 1px solid #0f0707;" class="badge">X</span>
        <div class="mb-3 p-3">
          <ul class="list-group">
            <li class="list-group-item"><strong>Copy Left-Link</strong> : ${conteL}  <span onclick="copyContent('${conteL}')" style="margin-left: 20px;"><i class="fa fa-clone" aria-hidden="true"></i></span></li>
            <li class="list-group-item"><strong>Copy Right-Link</strong> : ${conteR}  <span onclick="copyContent('${conteR}')" style="margin-left: 20px;"><i class="fa fa-clone" aria-hidden="true"></i></span></li>
          </ul>
        </div>
      </div>
    </div>
  `);
}

// async function geonology(userID){
//   $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
//   $("#view").css({"display":"none"});
//   $("#view1").html(`
//     <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px; border: 1px solid #0f0707; margin-top: 3vh;" class="badge">X</span>
//     <div style="overflow: auto; width: 70vh; text-align: center;">
//       <div class="tree">
//         <ul>
//           <li>
//             <div id="root"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div>
//             <ul>
//               <li>
//                 <div id="rootLeft"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div>
//                 <ul>
//                   <li><div id="rootLeft1"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div></li>
//                   <li><div id="rootLeft2"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div></li>
//                 </ul>
//               </li>
//               <li>
//                 <div id="rootRight"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div>
//                 <ul>
//                   <li><div id="rootRight1"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div></li>
//                   <li><div id="rootRight2"><i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br></div></li>
//                 </ul>
//               </li>
//             </ul>
//           </li>
//         </ul>
//       </div>
//     </div>
//   `);

//   const rootNode = await geonologyNode(userID);

//   if (rootNode.root) {
//     if (rootNode.rootVerify === "Verify") {
//       $("#root").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.root}')">${rootNode.root}</span><br/><span>${rootNode.rootName}</span>`);
//     } else {
//       $("#root").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.root}')">${rootNode.root}</span><br/><span>${rootNode.rootName}</span>`);
//     }
//   }

//   // Left branch
//   if (rootNode.left) {
//     if (rootNode.leftVeryfy === "Verify") {
//       $("#rootLeft").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.left}')">${rootNode.left}</span><br/><span>${rootNode.leftName}</span>`);
//     } else {
//       $("#rootLeft").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.left}')">${rootNode.left}</span><br/><span>${rootNode.leftName}</span>`);
//     }

//     const rootNodeLeft = await geonologyNode(rootNode.left);

//     if (rootNodeLeft.left) {
//       if (rootNodeLeft.leftVeryfy === "Verify") {
//         $("#rootLeft1").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeLeft.left}')">${rootNodeLeft.left}</span><br/><span>${rootNodeLeft.leftName}</span>`);
//       } else {
//         $("#rootLeft1").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeLeft.left}')">${rootNodeLeft.left}</span><br/><span>${rootNodeLeft.leftName}</span>`);
//       }
//     } else {
//       $("#rootLeft1").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//     }

//     if (rootNodeLeft.right) {
//       if (rootNodeLeft.rightVeryfy === "Verify") {
//         $("#rootLeft2").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeLeft.right}')">${rootNodeLeft.right}</span><br/><span>${rootNodeLeft.rightName}</span>`);
//       } else {
//         $("#rootLeft2").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeLeft.right}')">${rootNodeLeft.right}</span><br/><span>${rootNodeLeft.rightName}</span>`);
//       }
//     } else {
//       $("#rootLeft2").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//     }
//   } else {
//     $("#rootLeft").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//   }

//   // Right branch
//   if (rootNode.right) {
//     if (rootNode.rightVeryfy === "Verify") {
//       $("#rootRight").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.right}')">${rootNode.right}</span><br/><span>${rootNode.rightName}</span>`);
//     } else {
//       $("#rootRight").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNode.right}')">${rootNode.right}</span><br/><span>${rootNode.rightName}</span>`);
//     }

//     const rootNodeRight = await geonologyNode(rootNode.right);

//     if (rootNodeRight.left) {
//       if (rootNodeRight.leftVeryfy === "Verify") {
//         $("#rootRight1").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeRight.left}')">${rootNodeRight.left}</span><br/><span>${rootNodeRight.leftName}</span>`);
//       } else {
//         $("#rootRight1").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeRight.left}')">${rootNodeRight.left}</span><br/><span>${rootNodeRight.leftName}</span>`);
//       }
//     } else {
//       $("#rootRight1").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//     }

//     if (rootNodeRight.right) {
//       if (rootNodeRight.rightVeryfy === "Verify") {
//         $("#rootRight2").html(`<i style="color: rgb(237, 230, 8);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeRight.right}')">${rootNodeRight.right}</span><br/><span>${rootNodeRight.rightName}</span>`);
//       } else {
//         $("#rootRight2").html(`<i style="color: rgb(203, 206, 164);" class="fa fa-user" aria-hidden="true"></i><br/><span onclick="geonology('${rootNodeRight.right}')">${rootNodeRight.right}</span><br/><span>${rootNodeRight.rightName}</span>`);
//       }
//     } else {
//       $("#rootRight2").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//     }
//   } else {
//     $("#rootRight").html('<i style="color: rgb(36, 21, 39);" class="fa fa-user" aria-hidden="true"></i><br/>');
//   }
// }

// async function geonologyNode(userID){
//   var out = {};
//   await $.post('/training/getGeonologyNode', { userID: userID }, function(data){
//     out = {
//       root: data.root,
//       rootName: data.rootName,
//       left: data.rootLeft,
//       leftName: data.leftName,
//       right: data.rootRight,
//       rightName: data.rightName,
//       rootVerify: data.rootVerify,
//       leftVeryfy: data.leftVeryfy,
//       rightVeryfy: data.rightVeryfy
//     };
//   });
//   return out;
// }


// call this once after the tree markup is present in DOM
function enhanceTree(treeRootSelector = '.tree') {
  const treeRoot = document.querySelector(treeRootSelector);
  if (!treeRoot) return;

  // mark li that have child ULs
  treeRoot.querySelectorAll('li').forEach(li => {
    if (li.querySelector('ul')) {
      li.classList.add('has-children');
    } else {
      li.classList.remove('has-children');
    }
  });

  // add pop animation briefly to nodes
  treeRoot.querySelectorAll('.node').forEach((node, idx) => {
    node.classList.remove('pop');
    // stagger effect
    setTimeout(() => node.classList.add('pop'), idx * 40);
  });
}


function centerTree(prefer = 'left') {
  const $wrap = $('.tree-wrapper').first();
  const $tree = $wrap.find('.tree').first();
  if (!$wrap.length || !$tree.length) return;

  // small delay to allow layout/animations to settle
  setTimeout(() => {
    // choose strategy:
    // 'left' -> ensure leftmost edge is visible (good for mobile)
    // 'center' -> center the root horizontally (good for desktop)
    if (prefer === 'left') {
      // scroll to leftmost with a small offset for padding
      $wrap.animate({ scrollLeft: 0 }, 250);
    } else {
      // try to center the root node if it exists
      const $rootNode = $tree.find('[data-uid]').first();
      if ($rootNode.length) {
        const wrapLeft = $wrap.offset().left;
        const wrapWidth = $wrap.outerWidth();
        const elLeft = $rootNode.offset().left;
        const elWidth = $rootNode.outerWidth();
        const scrollTo = $wrap.scrollLeft() + (elLeft - wrapLeft) - (wrapWidth / 2) + (elWidth / 2);
        $wrap.animate({ scrollLeft: scrollTo }, 300);
      } else {
        // fallback to left
        $wrap.animate({ scrollLeft: 0 }, 250);
      }
    }
  }, 60); // small timeout to allow rendering
}
// Render helper for a single node
function renderNode(selector, uid, displayName = '', verifyFlag = '') {
  const $el = $(selector);
  $el.removeClass('verified not-verified empty pop').empty();

  if (!uid) {
    // placeholder / empty node
    $el.addClass('node empty').html('&mdash;');
    return;
  }

  const verified = (String(verifyFlag).toLowerCase() === 'verify');
  const classes = 'node ' + (verified ? 'verified' : 'not-verified');

  const inner = `
    <div class="${classes}" tabindex="0" role="button" aria-pressed="false" data-uid="${uid}">
      <span class="uid">${uid}</span>
      <span class="name">${displayName || ''}</span>
    </div>
  `;
  $el.html(inner);

  // small pop animation
  const $node = $el.find('.node').first();
  // remove previous pop class then reflow to retrigger animation
  $node.removeClass('pop');
  void $node[0].offsetWidth;
  $node.addClass('pop');
}

/**
 * Build a 2-level binary tree visualization for a user.
 * - userID: root user ID
 */
async function geonology(userID) {
  try {
    // show container
    $('#view1').css({ display: 'block', 'background-color': 'rgb(32, 77, 77)' });
    $('#view').css({ display: 'none' });

    // initial skeleton
    $('#view1').html(`
      <span onclick="closingElement('view1')" style="color:red; float:right; padding:5px; border-radius:10px; border:1px solid #0f0707; margin:10px;" class="badge">X</span>
      <div class="tree-wrapper">
  <div class="tree">
    <ul>
      <li>
        <div id="root" class="node verified"><span class="uid">RR-5010</span><span class="name">Alice</span></div>
        <ul>
          <li>
            <div id="rootLeft" class="node not-verified"><span class="uid">RR-4001</span><span class="name">Bob</span></div>
            <ul>
              <li><div id="rootLeft1" class="node empty">—</div></li>
              <li><div id="rootLeft2" class="node empty">—</div></li>
            </ul>
          </li>

          <li>
            <div id="rootRight" class="node verified"><span class="uid">RR-4022</span><span class="name">Cara</span></div>
            <ul>
              <li><div id="rootRight1" class="node empty">—</div></li>
              <li><div id="rootRight2" class="node empty">—</div></li>
            </ul>
          </li>

        </ul>
      </li>
    </ul>
  </div>
</div>
<!-- after DOM injection -->
<script>enhanceTree('.tree');  centerTree('left');</script>
    `);

    // fetch root and populate
    const rootNode = await geonologyNode(userID);

    // top root
    renderNode('#root', rootNode.root, rootNode.rootName, rootNode.rootVerify);

    // left branch
    if (rootNode.left) {
      renderNode('#rootLeft', rootNode.left, rootNode.leftName, rootNode.leftVeryfy);
      // fetch left child details (grandchildren)
      const leftNode = await geonologyNode(rootNode.left);
      renderNode('#rootLeft1', leftNode.left, leftNode.leftName, leftNode.leftVeryfy);
      renderNode('#rootLeft2', leftNode.right, leftNode.rightName, leftNode.rightVeryfy);
    } else {
      renderNode('#rootLeft', null);
      renderNode('#rootLeft1', null);
      renderNode('#rootLeft2', null);
    }

    // right branch
    if (rootNode.right) {
      renderNode('#rootRight', rootNode.right, rootNode.rightName, rootNode.rightVeryfy);
      const rightNode = await geonologyNode(rootNode.right);
      renderNode('#rootRight1', rightNode.left, rightNode.leftName, rightNode.leftVeryfy);
      renderNode('#rootRight2', rightNode.right, rightNode.rightName, rightNode.rightVeryfy);
    } else {
      renderNode('#rootRight', null);
      renderNode('#rootRight1', null);
      renderNode('#rootRight2', null);
    }

    // delegated click handler: click any .node and drill down using the data-uid
    $('#view1').off('click', '.node').on('click', '.node', function (e) {
      const uid = $(this).data('uid');
      if (uid) {
        // small UX: scroll tree wrapper to center the clicked node (if wide)
        setTimeout(() => {
          const $wrap = $('.tree-wrapper').first();
          const offsetEl = $(this).closest('.node');
          if ($wrap.length && offsetEl.length) {
            const wrapLeft = $wrap.offset().left;
            const wrapWidth = $wrap.outerWidth();
            const elLeft = offsetEl.offset().left;
            const elWidth = offsetEl.outerWidth();
            const scrollTo = $wrap.scrollLeft() + (elLeft - wrapLeft) - (wrapWidth / 2) + (elWidth / 2);
            $wrap.animate({ scrollLeft: scrollTo }, 300);
          }
        }, 40);

        geonology(uid);
      }
    });

  } catch (err) {
    console.error('geonology error', err);
    $('#view1').append(`<div class="alert alert-danger mt-3">Could not load genealogy data. Try again later.</div>`);
  }
}

/**
 * Wrapper to call backend and return a promise for node data.
 * - returns an object with fields expected by renderNode:
 *   { root, rootName, left, leftName, right, rightName, rootVerify, leftVeryfy, rightVeryfy }
 */
function geonologyNode(userID) {
  return new Promise((resolve, reject) => {
    if (!userID) {
      resolve({});
      return;
    }
    $.post('/training/getGeonologyNode', { userID: userID })
      .done(function (data) {
        // default safe mapping if fields missing
        const out = {
          root: data.root || null,
          rootName: data.rootName || '',
          left: data.rootLeft || null,
          leftName: data.leftName || '',
          right: data.rootRight || null,
          rightName: data.rightName || '',
          rootVerify: data.rootVerify || '',
          leftVeryfy: data.leftVeryfy || '',
          rightVeryfy: data.rightVeryfy || ''
        };
        resolve(out);
      })
      .fail(function (jqXHR, textStatus, err) {
        console.error('geonologyNode AJAX error', textStatus, err);
        reject(err || textStatus);
      });
  });
}


function wellcomLetter(userID){
  $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
  $("#view").css({"display":"none"});
  $("#view1").html(`
    <div class="card m-2">
      <div class="card-header">
        <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
      </div>
      <div class="card-body">
        <img src="/images/other/welcome.jpeg" class="card-img-top" alt="welcome">
      </div>
    </div>
  `);
}

function myDirect(userID){
  $.post('/training/mydirect', { userID: userID }, function(data){
    $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
    $("#view").css({"display":"none"});
    $("#view1").html(`
      <div class="card m-2">
        <div class="card-header">
          <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
          <p class="h2">Direct</p>
          <h3>Total <span class="badge text-bg-secondary">${data.direct}</span></h3>
          <h3>Verified <span class="badge text-bg-secondary">${data.directVerify}</span></h3>
        </div>
        <div class="card-body" style="height: 60vh; overflow-y: auto;">
          <ul id="myDirectList" class="list-group list-group-flush"></ul>
        </div>
      </div>
    `);

    if (Array.isArray(data.myDirect) && data.myDirect.length > 0) {
      data.myDirect.forEach(val => {
        var uad = "";
        if (val.activationDate) uad = dateFormat(new Date(val.activationDate),"d");
        $("#myDirectList").append(`
          <li class="list-group-item list-group-item-primary">
            <p>${val.userName}<br>M: ${val.mobile}, ID: ${val.userID}<br>DATE: ${uad}</p>
          </li>
        `);
      });
    }
  });
}

function groupTrade(userID) {
  $.ajax({
    url: '/training/userData',
    method: 'GET',
    data: { userID: userID },
    success: function (response) {
      if (response.groupTradeStatus === "Accept") {
        $("#view1").css({ "display": "block", "background-color": "rgb(32, 77, 77)" });
        $("#view").css({ "display": "none" });
        $("#view1").html(`
          <div class="container mt-5 text-white">
            <h2 class="mb-4 text-center">Welcome to Your Dashboard Group Trade, <br>${response.userName}</h2>
            <div class="row">
              <div class="col-md-4 mb-3">
                <div class="card bg-dark text-white">
                  <div class="card-body">
                    <h5 class="card-title">Account Number</h5>
                    <p class="card-text">${response.bankAccountNumber || 'Not Linked'}</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="card bg-dark text-white">
                  <div class="card-body">
                    <h5 class="card-title">Mandate Status</h5>
                    <p class="card-text text-success">Request sent to Paa Crypto Bank. It will take a couple of days to verify your PIN.</p>
                  </div>
                </div>
              </div>
              <div class="col-md-4 mb-3">
                <div class="card bg-dark text-white">
                  <div class="card-body">
                    <h5 class="card-title">Last Updated</h5>
                    <p class="card-text">${new Date(response.lastGrouptradeCheck).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `);
      } else {
        $("#view1").css({ "display": "block", "background-color": "rgb(32, 77, 77)" });
        $("#view").css({ "display": "none" });
        $("#view1").html(`
          <div class="container mt-5 text-white">
            <h2 class="mb-4">ECS Mandate Authorization</h2>
            <div id="alertBox"></div>
            <form id="ecsForm">
              <input type="hidden" name="userID" value="${userID}">
              <input type="hidden" name="userName" value="${response.userName}">
              <div class="mb-3">
                <label class="form-label">Name : ${response.userName}</label>
              </div>
              <div class="mb-3">
                <label class="form-label">Bank Name : Paa Crypto Bank</label>
              </div>
              <div class="mb-3">
                <label class="form-label">Bank Account Number</label>
                <input type="text" class="form-control" name="accountNumber" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Transaction PIN</label>
                <input type="text" class="form-control" name="transactionPIN" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Frequency</label>
                <select class="form-select" name="frequency" required>
                  <option value="As presented">As and when presented</option>
                </select>
              </div>
              <div class="form-check mb-3">
                <input class="form-check-input" type="checkbox" id="consentCheckbox" required>
                <label class="form-check-label" for="consentCheckbox">
                  I authorize Richrova to debit my Paa Crypto Bank account as per this ECS mandate.
                </label>
              </div>
              <button type="submit" class="btn btn-primary" id="submitBtn" disabled>Submit</button>
            </form>
          </div>
        `);

        // Enable submit only if checked
        $("#consentCheckbox").on("change", function () {
          $("#submitBtn").prop("disabled", !this.checked);
        });

        // ECS Form submission
        $("#ecsForm").on("submit", async function (e) {
          e.preventDefault();
          var crkAccountNo = $('input[name="accountNumber"]').val();
          var userName = $('input[name="userName"]').val().trim();

          try {
            const paa1 = await $.post('https://paacrypto.com/api/veryfiAccount', { accountNumber: crkAccountNo });
            if (paa1 && paa1.userName && paa1.userName.trim().toLowerCase() === userName.toLowerCase()) {
              $.ajax({
                url: '/training/groupTrade-mandate',
                method: 'POST',
                data: $(this).serialize(),
                success: function (res) {
                  $("#alertBox").html(`<div class="alert alert-success">${res.message}</div>`);
                  $("#ecsForm")[0].reset();
                  $("#submitBtn").prop("disabled", true);
                },
                error: function () {
                  $("#alertBox").html(`<div class="alert alert-danger">Submission failed. Please try again.</div>`);
                }
              });
            } else {
              $('#alertBox').html(`<div class="alert alert-danger">Your Name does not match Paa Crypto Bank</div>`);
            }
          } catch (err) {
            $('#alertBox').html(`<div class="alert alert-danger">Verification failed. Try again later.</div>`);
          }
        });
      }
    },
    error: function () {
      $('#alertBox').html(`<div class="alert alert-danger">Something went wrong. Try again.</div>`);
    }
  });
}


function earningData(userID){
  $.post('/training/earningData',{userID:userID},  function(data){
    if(data){
      var balance = Number(data.totalEarning) - Number(data.totalWithdrawal);
      var direct = Number(data.directL) + Number(data.directR);
      $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
      $("#view").css({"display":"none"});
      $("#view1").html(`
        <div class="card m-2">
          <div class="card-header">
            <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
            <p style="text-align: center; font-size: 20px; font-weight: bolder;">${data.designation}</p>
            Earnings
          </div>
          <div class="card-body">
            <p>Total Earning : &#8377; ${Number(data.totalEarning).toFixed(2)}</p>
            <ul class="list-group">
              <li class="list-group-item">Direct : ${direct}, Amount : &#8377; ${Number(data.directAmt).toFixed(2)}</li>
              <li class="list-group-item">Matching Pair : ${data.machingPair}, Amount : &#8377; ${Number(data.machingPairAmt).toFixed(2)}</li>
              <li class="list-group-item">Incentive : &#8377; ${Number(data.incentive).toFixed(2)}</li>
              <li class="list-group-item">Incentive Count : ${data.incentiveMonthCount}</li>
              <li class="list-group-item">Gift : ${data.giftAchive}</li>
              <li class="list-group-item">Tour : ${data.tourAchive}</li>
            </ul>
            <br>
            <p>Total Withdraw : &#8377; ${Number(data.totalWithdrawal).toFixed(2)}</p>
            <p>Remaining Balance : &#8377; ${balance.toFixed(2)}</p>
          </div>
        </div>
      `);
    } else {
      $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
      $("#view").css({"display":"none"});
      $("#view1").html(`
        <div class="card m-2">
          <div class="card-header">
            <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
            Earnings
          </div>
          <div class="card-body">
            <p>Total Earning : &#8377; 0.00</p>
            <p>Try to match criteria of 2:1 or 1:2</p>
          </div>
        </div>
      `);
    }
  });
}

function withdrawalInit(userID){
  $.post('/training/getWithdrawlBalance',{userID:userID},  function(data){
    var WithdrawalBalance = 0;
    if (data) WithdrawalBalance = Number(data.totalEarning) - Number(data.totalWithdrawal);

    $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
    $("#view").css({"display":"none"});
    $("#view1").html(`
      <div class="card m-2">
        <div class="card-header">
          <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
          Withdrawal
        </div>
        <div class="card-body">
          <p>Withdrawal Balance : &#8377; ${WithdrawalBalance.toFixed(2)}</p>
          <div class="mb-3">
            <label class="form-label">Friend's ID :</label>
            <input type="text" class="form-control" id="FriendUserID" placeholder="RR-5010">
          </div>
          <button type="button" class="btn btn-outline-warning mb-3">Buy Pin</button>
          <div class="mb-3">
            <label class="form-label">Account No :</label>
            <input type="text" class="form-control" id="paaAccount">
          </div>
          <div class="mb-3">
            <label class="form-label">Amount :</label>
            <input type="text" class="form-control" id="paaAmount">
          </div>
          <button onclick="withrawalProcess('${userID}', '${WithdrawalBalance}', '${data ? data.userName : ''}')" type="button" class="btn btn-outline-warning mb-3">Withdraw</button>
          <p>NB: 5% Admin Charge</p>
        </div>
      </div>
    `);
  });
}

async function withrawalProcess(userID,WithdrawalBalance,userName){
  var paaAccount = $("#paaAccount").val().trim();
  var paaAmount = $("#paaAmount").val().trim();
  var admincost =  Number(paaAmount) * 5/100;
  var withAmtAdminAmt = Number(paaAmount) + Number(admincost);

  if (withAmtAdminAmt < Number(WithdrawalBalance)) {
    if (paaAccount.length < 10) {
      alert("Enter Paa Crypto Bank Account Number");
      $("#paaAccount").focus();
      return;
    }
    if (withAmtAdminAmt < 100) {
      alert("Enter Amount. Minimum Amount Rs 100");
      $("#paaAmount").focus();
      return;
    }

    try {
      const paa = await $.post('https://paacrypto.com/api/veryfiAccount',{accountNumber: paaAccount});
      if (paa) {
        var user = userName.trim();
        var paauser = paa.userName.trim();
        if (paauser.toUpperCase() === user.toUpperCase()) {
          $.post('/training/withdrawlProcid', {
            userID: userID,
            withAmtAdminAmt: withAmtAdminAmt,
            paaAccount: paaAccount,
            admincost: admincost,
            transferAmt: paaAmount
          }, function(data){
            $("#view1").css({"display":"block" , "background-color": "rgb(32, 77, 77)"});
            $("#view").css({"display":"none"});
            $("#view1").html(`
              <div class="card m-2">
                <div class="card-header">
                  <span onclick="closingElement('view1')" style="color:red; float:right; padding: 5px; border-radius: 10px;" class="badge">X</span>
                  Withdrawal
                </div>
                <div class="card-body">
                  <p>Withdrawal Request Success <br/>It will Take Up to 72 hr</p>
                </div>
              </div>
            `);
          });
        } else {
          alert("Name does not match with Bank");
        }
      } else {
        alert("Wrong account number");
        return;
      }
    } catch (err) {
      alert("Verification failed. Try again later.");
    }

  } else {
    alert("Amount Exceed");
    $("#paaAmount").focus();
    return;
  }
}

function closingElement(div){
  $("#" + div).css({"display":"none","background-color": "#3a5d77"});
  $("#" + div).html('');
  $("#view").css({"display":"block"});
}

function copyContent(content){
  navigator.clipboard.writeText(content);
}

function logout(){
  $.post('/training/logout', {}, function(){
    location.replace("/training");
  });
}

function changePasswordinit(userID){
  var newpw = prompt("Enter new password (min 6 chars):");
  if(!newpw || newpw.length < 6){ alert("Invalid password"); return; }
  $.post('/training/changePassword', { userID:userID, newPassword:newpw }, function(res){
    if(res && res.ok) alert("Password changed");
    else alert("Could not change password");
  });
}


/**
 * Fetch and render full team details (BFS up to maxDepth)
 * Uses existing /mydirect endpoint (returns verified directs and list)
 */
/**
 * Fetch and render My Team Details (split into Left and Right)
 * Shows both Verified ✅ and Not Verified ❌ users with Name + UserID
 */
/**
 * Render ALL left-side and right-side members (verified + not verified)
 * Displays Name and UserID for each member, grouped by side and verification status.
 */
/**
 * Render ALL left-side and right-side members (verified + not verified)
 * Shows Name, Activation Date, and UserID.
 * At top: total verified / not verified counts.
 */
async function myTeamDetailsAll(rootUserID) {
  if (!rootUserID) return alert('User ID missing');

  // show overlay
  $('#view1').css({ display: 'block', 'background-color': 'rgb(32, 77, 77)' });
  $('#view').css({ display: 'none' });

  $('#view1').html(`
    <div class="card m-2">
      <div class="card-header d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-0">My Team Details — All Members</h5>
          <small class="small">Left and Right subtrees (verified & not verified)</small>
        </div>
        <div>
          <button style="color: #041b1b;" class="btn btn-sm btn-outline-light small" onclick="closingElement('view1')">Close</button>
        </div>
      </div>
      <div class="card-body">
        <div id="team-loading" class="text-center my-3">
          <img src="/images/gif/circle.gif" alt="loading" style="width:80px"/><br/>
          <small class="small">Loading team members...</small>
        </div>
        <div id="team-container" style="display:none"></div>
      </div>
    </div>
  `);

  try {
    // fetch all members
    const resp = await $.post('/training/getTeamMembersAll', { userID: rootUserID });
    $('#team-loading').hide();
    $('#team-container').show();

    const left = Array.isArray(resp.left) ? resp.left : [];
    const right = Array.isArray(resp.right) ? resp.right : [];

    function renderSideList(sideName, items) {
      const verified = items.filter(i => String(i.varyficatinStatus).toLowerCase() === 'verify');
      const notVerified = items.filter(i => String(i.varyficatinStatus).toLowerCase() !== 'verify');

      const renderItems = arr => {
        if (!arr.length) return `<li class="list-group-item muted-small">No members</li>`;
        return arr.map(u => {
          const date = u.activationDate ? dateFormat(new Date(u.activationDate), "d") : dateFormat(new Date(u.regdate), "d");
          return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <div><strong>${escapeHtml(u.userName || '—')}</strong></div>
                <small class="small">ID: ${escapeHtml(u.userID || '—')} | Date: ${date}</small>
              </div>
              <div>
                ${String(u.varyficatinStatus).toLowerCase() === 'verify'
                  ? '<span class="badge bg-success">Verified</span>'
                  : '<span class="badge bg-secondary">Not Verified</span>'}
              </div>
            </li>
          `;
        }).join('');
      };

      return `
        <div class="mb-3">
          <h6 class="mb-2 text-center">${sideName} Side</h6>
          <p class="text-center">
            <span class="badge bg-success">Verified: ${verified.length}</span>
            <span class="badge bg-secondary ms-2">Not Verified: ${notVerified.length}</span>
            <span class="badge bg-info ms-2">Total: ${items.length}</span>
          </p>
          <h6 class="mt-3">Verified Members</h6>
          <ul class="list-group mb-3">${renderItems(verified)}</ul>
          <h6>Not Verified Members</h6>
          <ul class="list-group">${renderItems(notVerified)}</ul>
        </div>
      `;
    }

    // final layout
    const html = `
      <div class="row">
        <div class="col-12 col-md-6 mb-3">
          <div class="card custom h-100">
            <div class="card-body" style="color: #041b1b;">
              ${renderSideList("⬅️ Left", left)}
            </div>
          </div>
        </div>
        <div class="col-12 col-md-6 mb-3">
          <div class="card custom h-100">
            <div class="card-body" style="color: #041b1b;">
              ${renderSideList("➡️ Right", right)}
            </div>
          </div>
        </div>
      </div>
    `;
    $('#team-container').html(html);

  } catch (err) {
    console.error('myTeamDetailsAll error', err);
    $('#team-loading').hide();
    $('#team-container').show().html(`<div class="alert alert-danger">Failed to load team. Try again later.</div>`);
  }
}

/* escape helper */
function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
