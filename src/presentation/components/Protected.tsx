import { Navigate } from "react-router-dom";
import pageRoutes from "../../routes/pageRoutes";

type myProps = {
    isLoggedIn: boolean,
    children: any
}
const Protected: React.FC<myProps> = ({ isLoggedIn, children }) => {
  if (!isLoggedIn) {
    return <Navigate to={pageRoutes.AUTH} replace />;
  }
  return children;
};
export default Protected;