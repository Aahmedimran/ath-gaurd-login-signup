import "./App.css";
import NavBar from "./component/navbar";
import Home from "./component/home";
import Login from "./component/login";
import Profile from "./component/profile";
import Signup from "./component/signup";
import Gallery from "./component/gallery";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { useEffect, useContext } from "react";

import { GlobalContext } from "./context";
import axios from "axios";

function App() {
  let { state, dispatch } = useContext(GlobalContext);

  useEffect(() => {
    const getProfile = async () => {
      let baseUrl = "http://localhost:3001";
      try {
        let response = await axios.get(`${baseUrl}/profile`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          console.log("response : ", response.data);

          dispatch({ type: "USER_LOGIN", payload: response.data });
        } else {
          dispatch({ type: "USER_LOGOUT" });
        }
      } catch (e) {
        console.log("Error in api call: ", e);
        dispatch({ type: "USER_LOGOUT" });
      }
    }

    getProfile();
  }, []);

  return (
    <Router>
      <NavBar />

      {/* A <Switch> looks through its children <Route>s and
        renders the first one that matches the current URL. */}
      <Routes>
        {(state.isLogin === true) ?

          <>

            <Route path="/profile" element={<Profile />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Navigate to="/"/>} />
          </>
          :
          null

        }

        {(state.isLogin === false) ?

          <>

            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Navigate to="/login"/>} />

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




      </Routes>
    </Router>
  );
}

export default App;
