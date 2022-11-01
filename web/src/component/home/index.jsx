import axios from "axios";
import { useState } from "react";
import WeatherCard from "./../weathercard";
import { Button, Form } from 'react-bootstrap';


let Home = () => {
  const [cityName, setCityName] = useState("");
  const [data, setData] = useState([]);
  let submitHandler = async (e) => {
    e.preventDefault();

    try {
      let response = await axios.get(
        `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=31ccc8f4fdb1e5bf00a56d08d2032fa9&units=matric`
      );
      console.log("response", response);
      setData(response.data.list);
    } catch (error) {
      console.log("error in Api call", error);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>

        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label> CityName</Form.Label>
          <Form.Control type="text" placeholder="Enter City Name" required
            onChange={(e) => {
              setCityName(e.target.value);
            }} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Get Weather
        </Button>
      </form>
      {
        data.map((eachForcast, index) => (
          <WeatherCard
            key={index}
            city={cityName}
            date={eachForcast.dt_txt}
            temp={eachForcast.main.temp}
            min={eachForcast.main.temp_min}
            max={eachForcast.main.temp_max}
          />
        ))
      }
    </div>
  );
};
export default Home;
