import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaIdBadge,
  FaChalkboardTeacher,
  FaUserGraduate
} from "react-icons/fa";

import "../styles/Register.css";


const Register = () => {


const navigate = useNavigate();



const [student,setStudent] = useState({

    fullName:"",
    rollNo:"",
    className:"",
    email:"",
    username:"",
    password:"",
    confirmPassword:""

});




const handleChange = (e)=>{


setStudent({

    ...student,

    [e.target.name]:e.target.value

});


};





const handleRegister=(e)=>{


e.preventDefault();




if(
student.password !== student.confirmPassword
){

alert(
"Password and Confirm Password not match"
);

return;

}




let students =
JSON.parse(
localStorage.getItem("students")
) || [];






const exists =
students.find((item)=>

item.username.toLowerCase()
===
student.username.toLowerCase()

||

item.email.toLowerCase()
===
student.email.toLowerCase()

);





if(exists){


alert(
"Username or Email already exists"
);


return;


}






const newStudent = {


id:Date.now(),

fullName:student.fullName,

rollNo:student.rollNo,

className:student.className,

email:student.email,

username:student.username,

password:student.password,


attendance:[]


};






students.push(newStudent);




localStorage.setItem(

"students",

JSON.stringify(students)

);




alert(
"Registration Successful"
);



navigate("/");



};





return(


<div className="register-page">


<div className="register-card">



<div className="register-logo">

<FaUserGraduate/>

</div>




<h1>
Student Registration
</h1>





<form onSubmit={handleRegister}>


<div className="input-box">

<FaUser className="icon"/>


<input

type="text"

name="fullName"

placeholder="Full Name"

onChange={handleChange}

required

/>


</div>





<div className="input-box">

<FaIdBadge className="icon"/>


<input

type="text"

name="rollNo"

placeholder="Roll Number"

onChange={handleChange}

required

/>


</div>






<div className="input-box">


<FaChalkboardTeacher className="icon"/>


<input

type="text"

name="className"

placeholder="Class"

onChange={handleChange}

required

/>


</div>







<div className="input-box">


<FaEnvelope className="icon"/>


<input

type="email"

name="email"

placeholder="Email"

onChange={handleChange}

required

/>


</div>








<div className="input-box">


<FaUser className="icon"/>


<input

type="text"

name="username"

placeholder="Username"

onChange={handleChange}

required

/>


</div>







<div className="input-box">


<FaLock className="icon"/>


<input

type="password"

name="password"

placeholder="Password"

onChange={handleChange}

required

/>


</div>







<div className="input-box">


<FaLock className="icon"/>


<input

type="password"

name="confirmPassword"

placeholder="Confirm Password"

onChange={handleChange}

required

/>


</div>






<button

className="register-btn"

type="submit"

>

Register

</button>







<div className="back-login">


Already registered?


<Link to="/">

Back To Login

</Link>



</div>





</form>



</div>



</div>


);


};


export default Register;