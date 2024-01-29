import React, { useEffect, useState } from 'react'
import axios from 'axios'

const APIweatherKey = process.env.REACT_APP_API_KEY

const App =()=>{
    const [ countrie, setCountrie ] = useState('')
    const [ filterCountrie, setFilterCountrie ] = useState([])
    const [ show, setShow ] = useState([])
    useEffect(()=>{
        axios
            .get(`https://restcountries.com/v3.1/all`)
            .then(response =>{
                const countrieList = response.data
                setFilterCountrie(countrieList)
            }) 
    },[])

    //API WEATHERSTACK.COM
    const [ weather, setWeather ] = useState(null)

        const getWeaterData = async (location)=>{
            try {
                const response = await axios
                    .get(`http://api.weatherstack.com/current?access_key=${APIweatherKey}&query=${location}`);
                setWeather(response.data)
                console.log(response.data)
            } catch(error){
                console.error('error ahora', error)
            }
        }

        let listCountrie = filterCountrie.filter(array=>(
            array.name.common.toUpperCase().includes(countrie.toUpperCase())
        )) 

        useEffect(()=>{
            getWeaterData(listCountrie[0])
            console.log('aca', APIweatherKey)
        },[show])

    const handleFilter =(event)=>{
        setCountrie(event.target.value)
        const showFull =(event)=>{
            let countrieTarget = event.target.parentNode.firstChild.textContent
            let copyList = [...listCountrie]
            let posicionIsTrue = copyList.map(nameList => nameList.name.common.includes(countrieTarget))
            let numberIndex = posicionIsTrue.indexOf(true)
            
            setShow(
            <div>
                <h1>{listCountrie[numberIndex].name.common}</h1>
                <p>capital: {listCountrie[numberIndex].capital}</p>
                <p>population: {listCountrie[numberIndex].population}</p>
                <h2>Languages</h2>
                <ul>
                    {Object.values(listCountrie[numberIndex].languages)
                    .map((language, i) => <li key={i}>{language}</li>)}
                </ul>
                <img src={listCountrie[numberIndex].flags.png} alt='countrie'/>

                
                {weather && (<div>
                    <h2>Weather in {listCountrie[0].name.common}</h2>
                    <p><strong>Temperature:</strong> {weather.current.temperature}ºC</p>
                    <img alt='the pic of the weater' src={weather.current.weather_icons[0]}/>
                    <p><strong>Wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>                    
                </div>)}
             </div> )   
        }

        if(listCountrie.length > 10){
            setShow(<h3>Too many matches, specify another filter</h3>)
        } else if(listCountrie.length > 1 && listCountrie.length < 10){
            setShow(listCountrie.map((filter, index)=>(
            <li key={index}>
                <p>{filter.name.common}</p>
                <button onClick={showFull}>show</button>
            </li>
            )))
        } else if(listCountrie.length === 1){
            setShow(
            <div>
                <h1>{listCountrie[0].name.common}</h1>
                <p>capital: {listCountrie[0].capital}</p>
                <p>population: {listCountrie[0].population}</p>
                <h2>Languages</h2>
                <ul>
                    {listCountrie.map((filter, index)=>(
                        <li key={index}>
                            {Object.values(filter.languages)
                            .map((language, i) => <div key={i}>{language}</div>)}
                        </li>
                    ))}
                </ul>
                <img src={listCountrie[0].flags.png} alt='countrie'/>

                {weather && (<div>
                    <h2>Weather in {listCountrie[0].name.common}</h2>
                    <p><strong>Temperature:</strong> {weather.current.temperature}ºC</p>
                    <img alt='the pic of the weater' src={weather.current.weather_icons[0]}/>
                    <p><strong>Wind:</strong> {weather.current.wind_speed} mph direction {weather.current.wind_dir}</p>                    
                </div>)}
             </div>
            )
        }
    }
                

    return <>
        <label>find countries 
            <input type="text" value={countrie} onChange={handleFilter} />
        </label>
        <ul>
            {show}
        </ul>
    </>
}


export default App
