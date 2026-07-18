import students from "../data/students";


// Initialize Students Data

export const initializeStudents = () => {


  const existingStudents =
    localStorage.getItem("students");


  if(!existingStudents){

    localStorage.setItem(
      "students",
      JSON.stringify(students)
    );

  }


};



// Login Function

export const loginStudent = (
  username,
  password
)=>{


  const allStudents =
    JSON.parse(
      localStorage.getItem("students")
    ) || students;



  const student =
    allStudents.find(

      (item)=>

        item.username === username &&
        item.password === password

    );



  if(student){


    localStorage.setItem(

      "currentStudent",

      JSON.stringify(student)

    );


    return true;


  }


  return false;


};



// Logout Function

export const logoutStudent = ()=>{


  localStorage.removeItem(
    "currentStudent"
  );


};



// Check Login

export const isAuthenticated = ()=>{


  return localStorage.getItem(
    "currentStudent"
  ) !== null;


};