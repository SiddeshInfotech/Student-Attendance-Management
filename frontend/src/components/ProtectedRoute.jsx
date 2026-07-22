import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";


const ProtectedRoute = ({ children }) => {

  const loggedIn = isAuthenticated();


  if(!loggedIn){

    return <Navigate to="/" replace />;

  }


  return children;

};


export default ProtectedRoute;