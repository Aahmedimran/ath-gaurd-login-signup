import moment from 'moment';
import './index.css';
import Card from 'react-bootstrap/Card';

let WeatherCard = ({ date, city, temp, min, max }) => {
  return (
    <div className='item'>
      <Card className="mb-4 mt-3 ml-3" style={{ width: '12rem' }}>
        <Card.Body>
          <h1>{city}</h1>
          <p>{moment(date).format(' dddd, h:mm a')}</p>
          <h1>{temp}</h1>
          <p>  {min} - {max}</p>
        </Card.Body>
      </Card>
    </div>
  )
}
export default WeatherCard;