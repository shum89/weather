import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {getForecast, checkRequest, weatherSelector, getQuery, setInputError} from "./searchSlice";

function Search() {
  const dispatch = useDispatch();
  const {query, inputErrorMessage} = useSelector(weatherSelector)

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  e.persist();
  dispatch(getQuery(e.target.value))
};

const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  dispatch(checkRequest(query));
  dispatch(setInputError());
  if(query) {
    dispatch(getForecast(query));
  }
  }

  return (
    <section className="search">
      <div className="search__wrapper">
        <h2 className="search__title">Погода</h2>
        <form className="search__form" onSubmit={handleSubmit} noValidate>
          <input className="search__input" onChange={handleChange} name="search" value={query}  placeholder="Введите город" />
          <span className="search__input-error">{inputErrorMessage}</span>
          <button className="search__button" type="submit">Искать</button>
        </form>
      </div>
    </section>
  );
}

export default Search;
