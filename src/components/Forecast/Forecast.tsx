import React from 'react';

interface ForecastInterface {
    tempMax: number, tempMin: number, date: string, condition: string,
}

function Forecast({tempMax, tempMin, date, condition }:ForecastInterface) {
    const options = {
        month: 'long',
        day: 'numeric',
    };
    const dateClass = new Date(date);
    const dayAndMonth = dateClass.toLocaleString('ru', options);
    return (
            <li className='forecast'>
                <div className='forecast__card'>
                    <p className='forecast__date'>
                        {dayAndMonth}
                    </p>
                    <p className='forecast__condition'>{condition}</p>
                    <p className='forecast__temp'>Днем: {Math.floor(tempMax)}</p>
                    <p className='forecast__temp'>Ночью: {Math.floor(tempMin)}</p>
                </div>
            </li>
    );
}

export default Forecast;
