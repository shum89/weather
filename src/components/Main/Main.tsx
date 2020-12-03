import React from 'react';
import Preloader from '../Preloader/Preloader';
import Search from "../Search/Search";
import {useDispatch, useSelector} from "react-redux";
import {InitialState, weatherSelector} from "../Search/searchSlice";
import Card from "../Card/Card";
import {getThreeDays} from "../Search/searchSlice";
import Forecast from "../Forecast/Forecast";

function Main() {
    const {forecast, loading, threeDay, requestError, networkError}:InitialState = useSelector(weatherSelector)
    const dispatch = useDispatch()
    const handlethreeDays = () => {
        dispatch(getThreeDays());
    };

    return (
        <main className="main">
            <Search  />
            <div className="main__weather-container">
                {loading && <Preloader />}
                {requestError && <div className="main__not-found">
                    <span className="main__not-found-icon" />
                    <h3 className="main__not-found-heading">Ничего не найдено</h3>
                    <p className="main__not-found-text">К сожалению по вашему запросу ничего не найдено.</p>
                </div>}
                {networkError && <div className="main__not-found">
                    <span className="main__not-found-icon" />
                    <h3 className="main__not-found-heading">Кажется что-то не так с интернетом</h3>
                    <p className="main__not-found-text">Проверьте подключение к интернету</p>
                </div>
                }
                {Boolean(forecast.cod) &&
                    <>
                        <Card
                            title={forecast.city.name}
                            condition={forecast.list[0].weather[0].description}
                            feelsLike={Math.floor(forecast.list[0].main.feels_like)}
                            humidity={Math.floor(forecast.list[0].main.humidity)}
                            pressure={Math.floor(forecast.list[0].main.pressure)}
                            temperature={Math.floor(forecast.list[0].main.temp)}
                            wind={forecast.list[0].wind.speed}
                            date={forecast.list[0].dt_txt}
                        />
                        {!Boolean(threeDay.length) && <button className='main__forecast-button' onClick={handlethreeDays} >Прогноз на 3 дня</button>}
                        </>
                }
                {Boolean(threeDay.length) && <ul className='main__forecast'>{threeDay.map((weather, index: number) => <Forecast key={index} tempMax={weather.main.temp_day} tempMin={weather.main.temp_night} date={weather.dt_txt} condition={weather.weather[0].main}/>)}</ul>}
            </div>
        </main>
    );
}

export default Main;
