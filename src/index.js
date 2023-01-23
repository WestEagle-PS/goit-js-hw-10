import { fetchCountries } from './js/fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputEl: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryDivEl: document.querySelector('.country-info'),
};

refs.inputEl.addEventListener('input', debounce(inputChange, DEBOUNCE_DELAY));

function inputChange() {
  const name = refs.inputEl.value.trim();
  if (name === '') {
    return (
      (refs.countryDivEl.innerHTML = ''), (refs.countryListEl.innerHTML = '')
    );
  }

  fetchCountries(name)
    .then(country => {
      refs.countryListEl.innerHTML = '';
      refs.countryDivEl.innerHTML = '';
      if (country.length === 1) {
        refs.countryDivEl.innerHTML = addMarkupHtml(country);
      } else if (country.length > 10) {
        showWarningInfo();
      } else {
        refs.countryListEl.innerHTML = showCountryList(country);
      }
    })
    .catch(showError);
}

function showCountryList(list) {
  const listMarkup = list
    .map(({ flags, name }) => {
      return `
        <li class="country-list__item">
        <img class="country-img" src="${flags.svg}" alt="" width="85" height="65">
        <p class="country-list__name">${name.official}</p>
        </li>`;
    })
    .join('');

  return listMarkup;
}

function addMarkupHtml(tag) {
  const markup = tag
    .map(({ name, capital, population, flags, languages }) => {
      return `
        <img class="country-img" src="${
          flags.svg
        }" alt="" width="85" height="65">
        <h2 class="country-name">${name.official}</h2>
        <p class="country-capital"><span>Capital: </span>${capital}</p>
        <p class="country-population"><span>Population:</span> ${population} people</p>
        <p class="country-languages"><span>Languages:</span> ${Object.values(
          languages
        ).join(', ')}</p>`;
    })
    .join('');

  return markup;
}

function showWarningInfo() {
  Notiflix.Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function showError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
