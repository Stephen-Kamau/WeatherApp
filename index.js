
// since the time is from 0000hrs, we slice from index 6 in order to get 0600hrs and 1900hrs for 6pm.
let START_INDEX = 6
let END_INDEX = 19
var LATITUDE = 1.2921
var LONGITUDE = 36.8219



// global variable
let  lat, long, windspeed_120m, relativehumidity_2m, temperature_2m, cloudcover_mid, time_recorded

// function to fetch data
function getResults(){
  var URL = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&hourly=temperature_2m,relativehumidity_2m,cloudcover_mid,windspeed_120m&timezone=Africa%2FCairo`
  fetch(URL)
  .then(weather => {
    console.log(URL)
    return weather.json();
  })
  .then(displayResults)
  .catch((e)=>{
    alert("Error. Please try another city " + e)
  })

}


function displayResults(weather){
  lat = weather.latitude
  long = weather.longitude
  windspeed_120m = weather.hourly.windspeed_120m.slice(START_INDEX, END_INDEX)
  relativehumidity_2m = weather.hourly.relativehumidity_2m.slice(START_INDEX, END_INDEX)
  temperature_2m = weather.hourly.temperature_2m.slice(START_INDEX, END_INDEX)
  cloudcover_mid = weather.hourly.cloudcover_mid.slice(START_INDEX, END_INDEX)
  time_recorded = weather.hourly.time.slice(START_INDEX, END_INDEX)

  // default value is @0600am
  document.getElementById("temp-id").innerHTML = getTemp(0);
  document.getElementById("humidity-id").innerHTML = getHumidity(0);
  document.getElementById("cloud-id").innerHTML = getCloud(0);
  document.getElementById("wind-id").innerHTML = getWind(0);

  setSelectTimes()
  console.log(time_recorded)


// Update the cards showing time and temperature
  let all_cards = document.getElementsByClassName('card');
  console.log(all_cards)
  for(let i=0; i<all_cards.length; i++){
    all_cards[i].addEventListener('click', (e) => {
      let queryIndex = parseInt(document.getElementsByClassName("card")[i].id)
      document.getElementsByClassName("card")[i].classList.add("active")
      console.log("clicked   "+ queryIndex +"  "+ getTemp(queryIndex))
      // updated selected item
        document.getElementById("temp-id").innerHTML = getTemp(queryIndex);
        document.getElementById("humidity-id").innerHTML = getHumidity(queryIndex);
        document.getElementById("cloud-id").innerHTML = getCloud(queryIndex);
        document.getElementById("wind-id").innerHTML = getWind(queryIndex);
  });
  }
}

// return wind speed at passed index
function getWind(index){
  return windspeed_120m[index] + "Km/h";
}

// help to get the temperature
function getTemp(index){
  return temperature_2m[index] +" °C";
}

// returns humidity at a given index
function getHumidity(index){
  return relativehumidity_2m[index]+"%";
}

// return cloud concentratiion at the index
function getCloud(index){
  return cloudcover_mid[index] +"%";
}


// call the function to get all results on the page.
getResults()



// function that returns a div
function makeText(time, temp,id){
  let text = `
  <div class="card" id="${id}">
  <h6 class="clock">${time}</h6>
  <h3>${temp} </h3>
  </div>
  `
  return text
}


// add items to the timer on the down side div.
function setSelectTimes(){
  let selectObject = document.getElementById("down-timer")

  let finalText =""
  let options = time_recorded

  for(let i = 0; i < options.length; i++) {
    let opt = new Date(options[i]).getHours();

    if (opt < 12){
      opt = opt + " AM"
    }
    else if (opt ==12) {
      opt = opt + " PM"
    }
    else{
      opt = (opt -12) + " PM"
    }

    finalText = finalText + makeText(opt, getTemp(i), i)
    selectObject.innerHTML = finalText;
  }
}



function findData(){
  let longitude = document.getElementById('longitude').value
  let latitude = document.getElementById('latitude').value

  longitude = parseFloat(longitude)
  latitude = parseFloat(latitude)

  if(longitude && latitude){
    if ((longitude<=180 && longitude >=-180) && (latitude <=90 && latitude >=-90)) {
      // #update the longitude and Latitude
      LATITUDE = latitude
      LONGITUDE = longitude
      getResults()
      console.log(URL)

      // reset the values of input
      document.getElementById('longitude').value =""
      document.getElementById('latitude').value = ""

    }
    else{
      alert("Enter Correct longitude(Betwen -180 and 180) or Latitude (Betwen -90 and 90) values")
    }
  }
  else{
    alert("Please Ensure you Entered Correct Numerical values");
  }

}


document.getElementById('longitude').addEventListener("onkeypress", ()=>{
  console.log("Released")
})
