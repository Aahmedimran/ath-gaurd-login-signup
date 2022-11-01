import { useContext } from "react";
import { GlobalContext } from '../../context';

let Gallery = () => {
  let { state, dispatch } = useContext(GlobalContext);
    return (
      <div >
       i am gallery {state.myNum}

       <button onClick={()=>{
        dispatch({
          type:"subtract"
        })
       }}>sub</button>
      </div>
    )
  }
  export default Gallery;