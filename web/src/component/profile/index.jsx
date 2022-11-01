import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context";
import axios from "axios";

let Profile = () => {
  let { state, dispatch } = useContext(GlobalContext);
  // const [profile, setprofile] = useState(null);

  // useEffect(() => {

  //   const getProfile = async () => {
  //     let baseUrl = "http://localhost:3001";
  //     try {

  //       let response = await axios.get(`${baseUrl}/profile`,
  //       {withCredentials:true}
  //       )

  //       console.log("response: ", response.data);
  //       setprofile(response.data)
  //       // dispatch({ type: "USER_LOGIN", payload: response.data.profile })

  //     } catch (e) {
  //       console.log("Error in api call: ", e);
  //     }
  //   }
  //   getProfile();
  // },[])
  return (
    <div>
      {(state.profile === null) ?
      
                <div>Loading...</div>
                :
                <div>
                    _id: {state.user?._id}
                    <br />
                    name: {state.user?.firstName} {state.user?.lastName}
                    <br />
                    email: {state.user?.email}
                    <br />
                    age: {state.user?.age}
                </div>
            }
    </div>
  );
};
export default Profile;
