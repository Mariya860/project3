/* Global Variables */
// api key
const API_KEY = "ba456cfbcdf4716a95a68b73e610430b"
// get the error message container to display error messages when needed
let error = document.querySelector('#error')

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getDate()+ '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' - ' + ("0" + d.getHours()).slice(-2) + ':'+("0" + d.getMinutes()).slice(-2);

// get data from Open Weather api
async function postWeatherData(e) {
    e.preventDefault()
    let journalPost = null
    // get zip code & feeling text input
    let zip_code = document.querySelector('#zipcode').value
    let feeling = document.querySelector("#feeling").value
    //reset the error text
    error.innerText = ''

    // check if zip code is not empty
    if(zip_code !== ''){
        // try to fetch the weather data
        try {
            const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip_code},us&units=metric&appid=${API_KEY}`)
            const weather = await data.json();
            // store the weather data with user input into journalPost
            journalPost = {
                date: newDate,
                temp: Math.round(weather.main.temp),
                city: weather.name,
                rain: weather.weather[0].description,
                icon: weather.weather[0].icon,
                feeling: feeling
            }
        } catch (error) {
            // if any thing went wrong then display an error message to the user
            error.innerText = 'Sorry something went wrong...'
        } finally {
            try {
                // post the data to the server so we can fetch it later
                await fetch('http://localhost:3000/new', {
                    method: 'POST',
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(journalPost)
                })
    
                // reset the weather journal form
                document.querySelector('#weatherForm').reset()
                // refresh the journal data by calling getJournalData function to fetch the new data.
                getJournalData() 
            } catch (error) {
                // if any thing went wrong then display an error message to the user
                error.innerText = 'Sorry something went wrong...'
            }
        }
    } else {
        // if zip code is empty then display this message to the user
        error.innerText = 'Please fill in your Zip Code'
    }
}

// get and fetch journal data function
function getJournalData() {
    // fetch data from our server
    fetch(`http://localhost:3000/journal`)
    .then(resJson => resJson.json())
    .then(response => {
        // get data and add it to each element
        document.querySelector('#date').innerHTML = response.date
        document.querySelector('#temp').innerHTML = response.temp + ' &#8451'
        document.querySelector('#city').innerHTML = response.city
        document.querySelector('#feelingText').innerHTML = response.feeling
        document.querySelector('#rain').innerHTML = response.rain
        document.querySelector('#icon').src = `https://openweathermap.org/img/wn/${response.icon}@2x.png`
    })
    .catch(err => {
        // if any error display error message
        error.innerText = 'Sorry something went wrong...'
    })
}
// assign a click event to generate button to post the weather data along with user input
window.document.querySelector('#generate').addEventListener('click', postWeatherData, false)

// call the getJournalData function when the page first load.
getJournalData()