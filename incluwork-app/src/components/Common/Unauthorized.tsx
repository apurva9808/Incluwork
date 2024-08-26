
import {useNavigate} from "react-router-dom";
const Unauthorized = () => {
    const navigate= useNavigate();
    const handleRedirectLogin=()=>{
        navigate('/login');
    }
    return (
        <div>
            <h1>Unauthorized</h1>
            <p>Return to login</p>
            <button onClick={handleRedirectLogin}>
                Login
            </button>
        </div>
    );
};

export default Unauthorized;
