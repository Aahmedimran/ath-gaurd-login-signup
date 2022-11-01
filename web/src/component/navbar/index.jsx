import "./index.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { GlobalContext } from '../../context';
import axios from 'axios';


const NavBar = () => {
    let { state, dispatch } = useContext(GlobalContext);
    const logoutHandler = async () => {



        let baseUrl = 'http://localhost:3001';
        try {
            let response = await axios.post(`${baseUrl}/logout`,
                {},
                { withCredentials: true })
            console.log("response :", response.data);

            dispatch({ type: "USER_LOGOUT" });
        }
        catch (e) {
            console.log("error in api call", e)
        }

    }

    return (

        <div className="nav">
            <div className="user">{state?.user?.firstName} {state?.user?.lastName}</div>

            <nav className="navbar-component">
                <ul>

                    {(state.isLogin === true) ?

                        <>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/profile">Profile</Link>
                            </li>
                            <li>
                                <Link to="/gallery">Gallery</Link>``
                            </li>


                            <li>
                                <Link to="/login" onClick={logoutHandler}> logout</Link>
                            </li>

                        </>
                        :
                        null
                    }



                    {(state.isLogin === false) ?

                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/signup">Signup</Link>
                            </li>
                        </>
                        :
                        null
                    }

                    {(state.isLogin === null) ?

                        <>
                            Loading...
                        </>
                        :
                        null
                    }



                </ul>
            </nav>

        </div>

    )
}
export default NavBar;