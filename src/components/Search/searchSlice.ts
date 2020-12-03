import {createSlice} from "@reduxjs/toolkit";
import axios from 'axios';
import {API_KEY, BASE_URL, METRIC_UNIT, REQUEST_LANG} from "../../constants/constants";

interface City {
    country: string,
    id: number | null,
    name: string,
}
interface Weather {
    [key:string]: string,
}
interface Wind {
    [key:string]: number,
}
interface Main {
    [key:string]: number
}

export interface ListItem {
    dt_txt: string
    main:Main,
    weather: [Weather],
    wind: Wind,
}

interface Forecast {
    cod:string,
    city: City,
    list:ListItem[],
}

export interface InitialState {
    loading: boolean,
    forecast:Forecast,
    query:string,
    threeDay:ListItem[],
    inputError:boolean,
    inputErrorMessage: string,
    requestError: boolean,
    networkError: boolean,
}

export const initialState:InitialState =  {
    loading: false,
    query:'',
    forecast: {
        cod:'',
        city: {
            country:'',
            id:null,
            name:'',
        },
        list:[]
    },
    threeDay:[],
    inputError: false,
    inputErrorMessage: '',
    requestError: false,
    networkError: false,
}

const checkIfNow = (value:string) => {
    const dateNow = new Date(Date.now()).toDateString();
    return dateNow === value;
}


const searchSlice = createSlice({
    name:'weather',
    initialState,
    reducers: {
        getWeather: state =>  {
            state.forecast = initialState.forecast;
            state.threeDay = initialState.threeDay;
            state.inputError = initialState.inputError;
            state.inputErrorMessage = initialState.inputErrorMessage;
            state.requestError = initialState.requestError;
            state.networkError = initialState.networkError;
            state.loading = true
        },
        setRequestError:(state) => {
            state.loading = false;
            state.requestError = true;
        },
        setNetworkError:(state) => {
            state.loading = false;
            state.networkError = true;
},
        setInputError: (state) => {
            state.inputError ? state.inputErrorMessage = 'Введите Город' : state.inputErrorMessage = '';
        },

        getWeatherSuccess: (state, payload) => {
            state.loading = false;
            state.forecast = payload.payload;
        },
        getQuery: (state, {payload}) => {
            state.query = payload;
        },
        getThreeDays: (state) => {
            let count = 0;
            state.threeDay = state.forecast.list.reduce((previousValue:ListItem[], currentValue) => {
                const date = new Date(currentValue.dt_txt).toDateString();
                    if (currentValue.dt_txt.includes('00:00:00') && !checkIfNow(date) && (count < 3)) {
                        previousValue.push({
                            dt_txt: currentValue.dt_txt,
                            main: {
                                temp_night: currentValue.main.temp_min,
                            },
                            wind: currentValue.wind,
                            weather: [{main: currentValue.weather[0].description}]
                            ,
                        });
                    }
                    else if (currentValue.dt_txt.includes('12:00:00') && !checkIfNow(date) && (count < 3)) {
                        previousValue[count].main.temp_day = currentValue.main.temp_max;
                        count++;
                    }
                return previousValue;
            },[]);
        },
        cacheRequest: (state, {payload}) => {
               const dateRequest = new Date(payload.payload.list[0].dt_txt);
               const dateHourRequest = dateRequest.getHours().toLocaleString();
               const date = dateRequest.toDateString();
               const queryLocal = payload.query.toLowerCase();
               localStorage.setItem('hour', dateHourRequest);
               localStorage.setItem('timeRequest', date);
               localStorage.setItem('state', JSON.stringify(payload.payload));
               localStorage.setItem('request', queryLocal);
        },
        checkRequest: (state, {payload}) => {
          if (!payload) state.inputError = true;
        }
        }
})

export const {getWeather, getWeatherSuccess, getQuery, getThreeDays, cacheRequest, checkRequest, setInputError, setRequestError, setNetworkError} = searchSlice.actions;
export const weatherSelector = (state: any) => state.weather;
export default searchSlice.reducer;

export const getForecast = (query:string) => {
    const getHours =  new Date(Date.now()).getHours();
    const date = localStorage.getItem('timeRequest') ?? '';
    const hour = localStorage.getItem('hour') ?? '';
    const queryLocal = localStorage.getItem('request');
    const queryNow = query.toLocaleLowerCase();
    const data = localStorage.getItem('state') ?? '';
    const timeDifference = getHours - Number(hour);
        return async (dispatch: (arg0: { payload: any; type: string; }) => void) => {
            dispatch(getWeather());
            if(data && timeDifference < 3 && checkIfNow(date) && queryNow === queryLocal) {
                dispatch(getWeatherSuccess(JSON.parse(data)))
            } else {
            try {
                    const response = await axios.get(`${BASE_URL}${query}&appid=${API_KEY}&units=${METRIC_UNIT}&lang=${REQUEST_LANG}`).catch((err) =>  {
                        throw err
                    })
                    dispatch(getQuery(query))
                    dispatch(getWeatherSuccess(response.data));
                    dispatch(cacheRequest({payload: response.data, query: query}))
                } catch (error) {
                    if(error.message === 'Network Error') {
                        dispatch(setNetworkError())
                    } else if (error.response.status  === 404)
                dispatch(setRequestError())
                }
            }

    }
}
