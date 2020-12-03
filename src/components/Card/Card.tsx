import React from 'react';
import {BiWind} from "react-icons/bi";
import {IoMdSpeedometer} from 'react-icons/io';
import {BsDroplet} from 'react-icons/bs';
import {RiCelsiusFill} from "react-icons/all";
export interface CardInterface {
    title:string,
    temperature:number,
    condition:string,
    feelsLike:number,
    pressure:number,
    humidity:number,
    wind:number,
    date:string,
}

function Card({title, temperature, condition, feelsLike, pressure, humidity, wind, date}:CardInterface) {
    const options = {
        month: 'long',
        day: 'numeric',
    };
    const dateClass = new Date(date);
    const dayAndMonth = dateClass.toLocaleString('ru', options);
    const fullDate = `${dayAndMonth}, ${dateClass.getFullYear()}`;
    return (
        <section className='card'>
            <div className='card__container'>
                <h2 className='card__title'>
                    {`${title}, ${fullDate}`}
                </h2>
                <div className='card__temp-wrap'>
                    <span className='card__temp-value'>{temperature}</span>
                    <RiCelsiusFill size='20px'/>
                    <p className='card__feels-like'>{`Ощущается как ${feelsLike}`}</p>
                </div>
                    <p className='card__condition'>{condition}</p>
                <div className='card__parameters'>
                    <div className='card__parameters-container'>
                        <BiWind/>
                    <p className='card__wind'>{wind} м/с</p>
                    </div>
                    <div className='card__parameters-container'>
                        <IoMdSpeedometer/>
                    <p className='card__pressure'>{pressure} мм.рт.ст</p>
                    </div>
                    <div className='card__parameters-container'>
                        <BsDroplet/>
                    <p className='card__humidity'>{humidity} %</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Card;
