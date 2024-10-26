import {useState, useEffect} from 'react'
import {IoMdSearch} from 'react-icons/io'
import Header from '../Header'
import './index.css'

const Home = () => {
  const apistatusConstants = {
    initial: 'Initial',
    loading: 'Loading',
    success: 'Success',
    failure: 'Failure',
  }

  const [searchInput, setsearchInput] = useState('')
  const [location, setLocation] = useState('')
  const [currentWeather, setcurrentWeather] = useState('')
  const [fivedayreport, setfivedayreport] = useState([])
  const [status, setStatus] = useState(apistatusConstants.initial)
  const geoCodingApi = async () => {
    setStatus(apistatusConstants.loading)
    const APIkey = '9d151ecf580b7f6f1cfda439526089f6'
    const limit = 1
    const cityname = searchInput
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityname}&limit=${limit}&appid=${APIkey}`
    const options = {
      method: 'Get',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      console.log(data)
      const updatedData = {
        lat: data[0].lat,
        lon: data[0].lon,
      }

      setLocation(updatedData)
      setStatus(apistatusConstants.success)
    } else {
      setStatus(apistatusConstants.failure)
    }
  }

  const currentWeatherApi = async () => {
    const APIkey = '9d151ecf580b7f6f1cfda439526089f6'
    console.log(location.lat)
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}`
    console.log(url)
    const options = {
      method: 'Get',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = {
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        conditions: data.weather[0].main,
        name: data.name,
      }
      setcurrentWeather(updatedData)
      console.log(updatedData)
    }
  }

  const fivedaysReportApi = async () => {
    const APIkey = '9d151ecf580b7f6f1cfda439526089f6'
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&appid=${APIkey}`
    const options = {
      method: 'Get',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      console.log(data)
      const updatedData = data.list.map(each => ({
        date: each.dt_txt,
        humidity: each.main.humidity,
        hightemp: each.main.temp_max,
        lowtemp: each.main.temp_min,
        conditions: each.weather[0].main,
      }))
      setfivedayreport(updatedData)
    }
  }
  useEffect(() => {
    currentWeatherApi()
  }, [location])
  useEffect(() => {
    fivedaysReportApi()
  }, [location])
  const searchHandler = () => {
    geoCodingApi()
  }

  const inputHandler = event => {
    setsearchInput(event.target.value)
  }
  const successView = () => (
    <div>
      <div>
        <h2>currentWeather</h2>
        <div>
          <h3>{currentWeather.name}</h3>
          <p>temperature:{currentWeather.temperature}</p>
          <p> Humudity:{currentWeather.humidity}</p>
          <p>windspeed: {currentWeather.windspeed}</p>
          <p>Weather COnditions :{currentWeather.conditions}</p>
        </div>
      </div>
      <div>
        <h2>5 days weather report</h2>
        <ul>
          {fivedayreport.map(each => (
            <li>
              <h4> {each.date}</h4>
              <p>Humidity :{each.humidity}</p>
              <p>max-temperature:{each.hightemp}</p>
              <p>min -temperature :{each.lowtemp}</p>
              <p>weather-conditions :{each.conditions}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
  const initialView = () => (
    <div>
      <h5 className="center">Search for the city Name</h5>
    </div>
  )
  const loadingView = () => <div className="loader">Loading.....</div>
  const failureView = () => (
    <div className="failureView">
      <h1>Somethinh went Wrong</h1>
      <p>please try again</p>
      <button className="try-again" onClick={searchHandler}>
        Try Again
      </button>
    </div>
  )
  const FinalView = () => {
    if (status === apistatusConstants.initial) {
      return initialView()
    }
    if (status === apistatusConstants.loading) {
      return loadingView()
    }
    if (status === apistatusConstants.success) {
      return successView()
    }
    if (status === apistatusConstants.failure) {
      return failureView()
    }
  }
  return (
    <div className="home">
      <Header />
      <input type="search" onChange={inputHandler} />
      <button onClick={searchHandler}>
        <IoMdSearch />
      </button>
      <h1>welcome to Weather Report</h1>
      <FinalView />
    </div>
  )
}

export default Home
