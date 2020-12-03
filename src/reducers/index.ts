import { combineReducers } from 'redux'

import searchSliceReducer from '../components/Search/searchSlice';

const rootReducer = combineReducers({
    weather: searchSliceReducer,
})

export default rootReducer
