'use strict';

import { apiKeyOpenweather, apiKeyGiphy } from "./config.js";

const formElement = document.querySelector('form');
const inputElement = document.querySelector('#towninput');
const h2Element = document.querySelector('h2');
const img = document.querySelector('img');
const loader = document.querySelector('#loader');
const divDisplay = document.querySelector('#image-display');

function formatSearch(word) {
    let result;
    let arrayResult = word.toLowerCase().split(/[\s-_,']/);
    result = arrayResult.join('+');
    return result;
}

function convertKelvinToCelsius(temp) {
    const stringResult = parseFloat(temp) - 273.15;
    return Math.round(stringResult).toString();
}

async function getLocation(town) {

    const url = new URL("https://api.openweathermap.org/data/2.5/weather");
    const inputTown = formatSearch(town);
    const appId = apiKeyOpenweather;
    const params = {
        q: inputTown,
        APPID: appId
    };
    let result;
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url);
        const locationData = await response.json();
        result = "Currently, in " + locationData.name + ", the weather is " + locationData.weather[0].description + ", with the temperature at " + convertKelvinToCelsius(locationData.main.temp) + "°C";
    }
    catch (error) {
        result = 'Unknown town';
    }
    finally {
        return result;
    }

}

async function getImage(word) {

    const url = new URL("https://api.giphy.com/v1/gifs/translate");
    const inputWord = formatSearch(word);

    const apiKey = apiKeyGiphy;
    const params = {
        api_key: apiKey,
        s: inputWord
    };

    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, { mode: 'cors' });
    const imageData = await response.json();
    return imageData.data.images.original.url;

}

async function getWorking(word) {
    divDisplay.style.display = "none";
    loader.classList.add("display");
    const fWord = await getLocation(word);
    const result = await getImage(fWord);
    loader.classList.remove("display");
    h2Element.textContent = fWord;
    img.src = result;
    divDisplay.style.display = "block";
}

formElement.addEventListener('submit', event => {
    event.preventDefault();
    getWorking(inputElement.value);
});
