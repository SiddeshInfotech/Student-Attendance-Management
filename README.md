<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>SAMS - Admin Settings</title>
<style>
  :root{
    --sidebar-dark:#111b3f;
    --sidebar-blue:#2452e8;
    --accent-blue:#1d5fe0;
    --accent-red:#e04b4b;
    --bg:#eef1f6;
    --card:#ffffff;
    --text-dark:#1c2440;
    --text-muted:#8a93a6;
  }
  *{box-sizing:border-box;margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;}
  body{display:flex;min-height:100vh;background:var(--bg);}

   .sidebar{
    width:238px;
    background:linear-gradient(180deg,var(--sidebar-dark) 0%,var(--sidebar-blue) 100%);
    color:#fff;
    padding:24px 18px;
    display:flex;
    flex-direction:column;
    gap:6px;
  }
   brand{display:flex;align-items:center;gap:12px;margin-bottom:30px;}
   brand-icon{width:42px;height:42px;background:#2a345c;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:20px;}
  .brand-name{font-size:20px;font-weight:800;letter-spacing:1px;}
  .brand-sub{font-size:12px;color:#c7cde3;}
  .nav-item{
    display:flex;align-items:center;gap:12px;
    padding:12px 14px;border-radius:8px;
    color:#dfe3f2;text-decoration:none;font-weight:600;font-size:15px;
    cursor:pointer;transition:.15s;
  }
  .nav-item:hover{background:rgba(255,255,255,.08);}
  .nav-item.active{background:#3f6bf0;color:#fff;}
  .nav-item.logout{background:var(--accent-red);color:#fff;margin-top:auto;}
  .nav-item.logout:hover{background:#c93f3f;}
  .spacer{flex:1;}

  .main{flex:1;padding:40px;display:flex;flex-direction:column;align-items:center;}
  h1{color:var(--accent-blue);font-size:34px;margin-bottom:26px;}

  .card{
    background:var(--card);
    width:420px;
    border-radius:14px;
    padding:28px 30px 30px;
    box-shadow:0 6px 20px rgba(20,30,60,.08);
    margin-bottom:24px;
  }
  .profile{display:flex;flex-direction:column;align-items:center;text-align:center;padding-bottom:18px;border-bottom:1px solid #e7e9f0;margin-bottom:20px;position:relative;}
  .avatar{
    width:88px;height:88px;border-radius:50%;
    background:#2f6fe0;display:flex;align-items:center;justify-content:center;
    font-size:40px;color:#fff;margin-bottom:12px;position:relative;
  }
  .avatar-edit{
    position:absolute;bottom:0;right:calc(50% - 44px);
    background:#fff;border:2px solid #2f6fe0;color:#2f6fe0;
    width:26px;height:26px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;font-size:13px;cursor:pointer;
  }
  .profile h2{font-size:22px;color:var(--text-dark);}
  .profile p{color:var(--text-muted);font-size:14px;margin-top:2px;}

  .section-title{font-weight:700;color:#5a6178;margin:4px 0 12px;font-size:15px;}

  input[type=text],input[type=email],input[type=password]{
    width:100%;padding:12px 14px;border:1px solid #dfe2ea;border-radius:8px;
    margin-bottom:12px;font-size:14px;color:var(--text-dark);outline:none;
  }
  input:focus{border-color:var(--accent-blue);}

  .btn{
    width:100%;padding:12px;border:none;border-radius:8px;
    font-weight:700;font-size:15px;cursor:pointer;margin-bottom:10px;transition:.15s;
  }
  .btn-primary{background:var(--accent-blue);color:#fff;}
  .btn-primary:hover{background:#164ec2;}
  .btn-danger{background:var(--accent-red);color:#fff;}
  .btn-danger:hover{background:#c93f3f;}
  .btn-outline{background:#fff;color:var(--accent-blue);border:1px solid var(--accent-blue);}
  .btn-outline:hover{background:#eef3ff;}

  .link-row{text-align:right;margin:-6px 0 14px;}
  .link-row a{font-size:13px;color:var(--accent-blue);text-decoration:none;font-weight:600;cursor:pointer;}
  .link-row a:hover{text-decoration:underline;}

  .toggle-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;}
  .toggle-row span{font-size:14px;color:var(--text-dark);font-weight:600;}
  .switch{position:relative;width:46px;height:24px;}
  .switch input{opacity:0;width:0;height:0;}
  .slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:24px;transition:.2s;}
  .slider:before{position:absolute;content:"";height:18px;width:18px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.2s;}
  input:checked + .slider{background:var(--accent-blue);}
  input:checked + .slider:before{transform:translateX(22px);}

  .msg{font-size:13px;margin:-6px 0 12px;display:none;}
  .msg.show{display:block;}
  .msg.ok{color:#1a8a4a;}
  .msg.err{color:#c93f3f;}

  .overlay{
    position:fixed;inset:0;background:rgba(15,20,40,.45);
    display:none;align-items:center;justify-content:center;z-index:50;
  }
  .overlay.show{display:flex;}
  .modal{
    background:#fff;border-radius:14px;padding:26px 26px 22px;width:380px;
    box-shadow:0 10px 30px rgba(0,0,0,.2);position:relative;
  }
  .modal h3{color:var(--text-dark);margin-bottom:6px;}
  .modal p.hint{color:var(--text-muted);font-size:13px;margin-bottom:16px;}
  .modal .close{position:absolute;top:14px;right:16px;cursor:pointer;color:#9aa0b4;font-size:18px;}
  .step{display:none;}
  .step.active{display:block;}

  body.dark{--bg:#141824;--card:#1e2434;--text-dark:#eef1f8;--text-muted:#9aa2b8;}
  body.dark input{background:#262c40;border-color:#333a52;color:#eef1f8;}
  body.dark .profile{border-color:#333a52;}
  body.dark .modal{background:#1e2434;}
</style>
</head>
<body>

  <div class="sidebar">
    <div class="brand">
      <div class="brand-icon">🎓</div>
      <div>
        <div class="brand-name">SAMS</div>
        <div class="brand-sub">Admin Panel</div>
      </div>
    </div>
    <div class="nav-item">Dashboard</div>
    <div class="nav-item"> Students</div>
    <div class="nav-item">Attendance</div>
    <div class="nav-item">Reports</div>
    <div class="nav-item active">Settings</div>
    <div class="spacer"></div>
    <div class="nav-item logout" onclick="openModal('logoutModal')">↩ Logout</div>
  </div>

  <div class="main">
    <h1>Admin Settings</h1>

    <div class="card">
      <div class="profile">
        <div class="avatar" id="avatarInitial">👤
          <div class="avatar-edit" title="Change photo" onclick="document.getElementById('photoInput').click()">✎</div>
        </div>
        <input type="file" id="photoInput" accept="image/*" style="display:none">
        <h2 id="displayName">Admin</h2>
        <p id="displayEmail">admin@gmail.com</p>
      </div>

      <div class="section-title">Edit Profile</div>
      <input type="text" id="nameInput" placeholder="Full Name" value="Admin">
      <input type="email" id="emailInput" placeholder="Email Address" value="admin@gmail.com">
      <button class="btn btn-outline" onclick="saveProfile()">Update Profile</button>
      <div class="msg ok" id="profileMsg">Profile updated successfully.</div>
    </div>

    <div class="card">
      <div class="section-title">Change Password</div>
      <input type="password" id="newPass" placeholder="Enter New Password">
      <input type="password" id="confirmPass" placeholder="Confirm Password">
      <div class="link-row"><a onclick="openModal('forgotModal')">Forgot Password?</a></div>
      <div class="msg err" id="passMsg"></div>
      <button class="btn btn-primary" onclick="savePassword()">Save Changes</button>
    </div>

    <div class="card">
      <div class="section-title">Preferences</div>
      <div class="toggle-row">
        <span>Dark Mode</span>
        <label class="switch">
          <input type="checkbox" id="darkToggle" onchange="toggleDark()">
          <span class="slider"></span>
        </label>
      </div>
      <div class="toggle-row">
        <span>Email Notifications</span>
        <label class="switch">
          <input type="checkbox" checked>
          <span class="slider"></span>
        </label>
      </div>
    </div>

    <div class="card">
      <button class="btn btn-danger" onclick="openModal('logoutModal')">Logout</button>
    </div>
  </div>

  <div class="overlay" id="forgotModal">
    <div class="modal">
      <span class="close" onclick="closeModal('forgotModal')">✕</span>

      <div class="step active" id="fpStep1">
        <h3>Forgot Password</h3>
        <p class="hint">Enter your registered email to receive a 6-digit OTP.</p>
        <input type="email" id="fpEmail" placeholder="Enter Email">
        <button class="btn btn-primary" onclick="sendOtp()">Send OTP</button>
      </div>

      <div class="step" id="fpStep2">
        <h3>Verify OTP</h3>
        <p class="hint">OTP sent to your email (demo OTP: 123456).</p>
        <input type="text" id="fpOtp" placeholder="Enter 6-digit OTP" maxlength="6">
        <button class="btn btn-primary" onclick="verifyOtp()">Verify OTP</button>
      </div>

      <div class="step" id="fpStep3">
        <h3>Reset Password</h3>
        <p class="hint">Set a new password for your account.</p>
        <input type="password" id="fpNewPass" placeholder="New Password">
        <input type="password" id="fpConfirmPass" placeholder="Confirm New Password">
        <button class="btn btn-primary" onclick="resetPassword()">Reset Password</button>
      </div>

      <div class="step" id="fpStep4">
        <h3>Password Reset</h3>
        <p class="hint">Your password has been changed successfully.</p>
        <button class="btn btn-primary" onclick="closeModal('forgotModal')">Done</button>
      </div>
    </div>
  </div>

  <div class="overlay" id="logoutModal">
    <div class="modal">
      <span class="close" onclick="closeModal('logoutModal')">✕</span>
      <h3>Log out?</h3>
      <p class="hint">You'll need to sign in again to access the admin panel.</p>
      <button class="btn btn-danger" onclick="doLogout()">Yes, Logout</button>
      <button class="btn btn-outline" onclick="closeModal('logoutModal')">Cancel</button>
    </div>
  </div>

<script>
function openModal(id){ document.getElementById(id).classList.add('show'); }
function closeModal(id){
  document.getElementById(id).classList.remove('show');
  if(id==='forgotModal'){ showStep('fpStep1'); }
}
function showStep(id){
  document.querySelectorAll('.step').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function saveProfile(){
  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  if(!name || !email){ return; }
  document.getElementById('displayName').textContent = name;
  document.getElementById('displayEmail').textContent = email;
  const msg = document.getElementById('profileMsg');
  msg.classList.add('show');
  setTimeout(()=>msg.classList.remove('show'), 2500);
}

function savePassword(){
  const p1 = document.getElementById('newPass').value;
  const p2 = document.getElementById('confirmPass').value;
  const msg = document.getElementById('passMsg');
  if(!p1 || !p2){ msg.textContent='Please fill both fields.'; msg.classList.add('show'); return; }
  if(p1 !== p2){ msg.textContent='Passwords do not match.'; msg.classList.add('show'); return; }
  if(p1.length < 6){ msg.textContent='Password must be at least 6 characters.'; msg.classList.add('show'); return; }
  msg.classList.remove('show');
  alert('Password changed successfully!');
  document.getElementById('newPass').value='';
  document.getElementById('confirmPass').value='';
}

let demoOtp = '123456';
function sendOtp(){
  const email = document.getElementById('fpEmail').value.trim();
  if(!email){ alert('Enter a valid email'); return; }
  showStep('fpStep2');
}
function verifyOtp(){
  const otp = document.getElementById('fpOtp').value.trim();
  if(otp !== demoOtp){ alert('Invalid OTP'); return; }
  showStep('fpStep3');
}
function resetPassword(){
  const p1 = document.getElementById('fpNewPass').value;
  const p2 = document.getElementById('fpConfirmPass').value;
  if(!p1 || !p2 || p1 !== p2){ alert('Passwords do not match'); return; }
  if(p1.length < 6){ alert('Password must be at least 6 characters'); return; }
  showStep('fpStep4');
}

function toggleDark(){
  document.body.classList.toggle('dark', document.getElementById('darkToggle').checked);
}

function doLogout(){
  alert('Logged out (demo)');
  closeModal('logoutModal');
}
</script>
</body>
</html>