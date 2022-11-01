import { useContext } from "react";
import { GlobalContext } from '../../context';

let About = () => {

  let { state, dispatch } = useContext(GlobalContext);
  return (
    <div >
      i am about -{state.myNum}
      <button onClick={() => {
        dispatch({
          type: "add"
        })

      }}
      >add</button>
    </div>
  )
}
export default About;