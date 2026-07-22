import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaKey
} from "react-icons/fa";

import "../styles/ForgotPassword.css";


const ForgotPassword = () => {


  const navigate = useNavigate();


  const [formData,setFormData] = useState({

    usernameOrEmail:"",
    password:"",
    confirmPassword:""

  });





  const handleChange = (e)=>{


    setFormData({

      ...formData,

      [e.target.name]:e.target.value

    });


  };





  const handleReset = (e)=>{


    e.preventDefault();



    if(
      formData.password !==
      formData.confirmPassword
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





    const studentIndex =
      students.findIndex(
        (student)=>

          student.username.toLowerCase()
          ===
          formData.usernameOrEmail
          .toLowerCase()

          ||

          student.email.toLowerCase()
          ===
          formData.usernameOrEmail
          .toLowerCase()

      );





    if(studentIndex === -1){


      alert(
        "Student Not Found"
      );


      return;


    }






    students[studentIndex].password =
    formData.password;





    localStorage.setItem(

      "students",

      JSON.stringify(students)

    );





    alert(
      "Password Reset Successfully"
    );



    navigate("/");



  };






return(


<div className="forgot-page">



<div className="forgot-card">



<div className="forgot-logo">

<FaKey/>

</div>





<h1>
Forgot Password
</h1>




<form onSubmit={handleReset}>




<div className="input-box">


<FaEnvelope className="icon"/>


<input

type="text"

name="usernameOrEmail"

placeholder="Username or Email"

value={
formData.usernameOrEmail
}

onChange={handleChange}

required

/>


</div>






<div className="input-box">


<FaLock className="icon"/>


<input

type="password"

name="password"

placeholder="New Password"

value={
formData.password
}

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

value={
formData.confirmPassword
}

onChange={handleChange}

required

/>


</div>






<button

className="reset-btn"

type="submit"

>

Reset Password

</button>






<div className="back-login">


Already have account?


<Link to="/">

Back To Login

</Link>



</div>





</form>



</div>




</div>


);


};


export default ForgotPassword;