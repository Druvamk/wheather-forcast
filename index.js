const temp = document.getElementById("temp"),
date = document.getElementById("date-time"),
currentLocation=document.getElementById("location"),
condition = document.getElementById("condition"),
rain = document.getElementById("rain"),
mainIcon = document.getElementsByClassName("icon"),
uvIndex = document.querySelector(".uv-index"),
uvText = document.querySelector(".uv-text"),
windSpeed = document.querySelector(".wind-speed"),
sunRise = document.querySelector(".sunrise"),
sunSet = document.querySelector(".sunset"),
humidity = document.querySelector(".humidity"),
visibility = document.querySelector(".visibility"),
humiditystatus = document.querySelector(".humidity-status"),
airQuality = document.querySelector(".air-quality"),
airQualityStatus = document.querySelector(".air-quality-status"),
visibilityStatus = document.querySelector(".visibility-status"),
weatherCards = document.querySelector("#weather-cards"),
celciusBtn = document.querySelector(".celcius"),
fahrenheitBtn = document.querySelector(".fahrenheit"),
hourlyBtn = document.querySelector(".hourly"),
weekBtn = document.querySelector(".week"),
tempUnit = document.querySelectorAll(".temp-unit"),
searchForm = document.querySelector("#search"),
search = document.querySelector("#query");



let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";

//update date
function getDateTime()
{
    let now = new Date();
    hour = now.getHours();
    minute = now.getMinutes();

    let days = [ "sunday","monday","tuesday","wednusday","thursday","friday","saturday"];

    //12 hours format
    if(hour < 10)
    {
        hour= "0" + hour;
    }
    if(minute < 10)
    {
        minute = "0" + minute;
    }
        let dayString  =  days[now.getDay()];
        return `${dayString}, ${hour}:${minute}`;   
}
date.innerHTML = getDateTime();
//update the time every second
setInterval(()=>{
    date.innerHTML = getDateTime();
},1000);
//function to get public ip with fetch
function getPublicip(){
    fetch("https://geolocation-db.com/json/",
    {method:"GET",
    })
    .then((response) => response.json())
    .then((date) => {
        console.log(date);
       currentCity = date.city;
    //    getWeatherData(date.city,currentUnit,hourlyorWeek);
    getWeatherData(date.city,currentUnit,hourlyorWeek);
    });
   
}
getPublicip();
//function to get weather data

function getWeatherData (city,unit,hourlyorWeek)
{
    const apikey = "5DDBE3U4QYXK3KMB6Z7XQGML8";
  fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apikey}&contentType=json`,
  {
    method:"GET",
  }
  )
  .then((response) => response.json())
  .then((date) => {
    let today = date.currentConditions;
    if(unit ===  'c')
    {
        temp.innerText=today.temp;
    }
    else{
        temp.innerText=celciusToFahrenheit(today.temp);
    }
    currentLocation.innerText = date.resolvedAddress;
    condition.innerText = today.conditions;
    rain.innerText = "Perc - " + today.precip + "%";
    uvIndex.innerText = today.uvindex;
    windSpeed.innerText = today.windspeed;
    humidity.innerText = today.humidity + "%";
    visibility.innerText = today.visibility;
    airQuality.innerText = today.winddir;
    measureUvIndex(today.uvindex);
    updateHumidityStatus(today.humidity);
    updateVisibilityStatus(today.visibility);
    updateAirQualityStatus(today.winddir);
    sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
    sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
    mainIcon.innerText = getIcon(today.icon);

    mainIcon.src = getIcon(today.icon);
    changeBackground(today.icon);

    if(hourlyorWeek === "hourly"){
        updateForecast(date.days[0].hours , unit ,  "day")
    }
    else{
        updateForecast(date.days, unit ,"Week") 
    }

  })
//    .catch((err) =>{
//        alert("city not found");
//    });
}
//convert celcius To Fahrenheit
function celciusToFahrenheit(temp)
{
    return((temp * 9)/ 5 + 32).toFixed(1);
}
//function to get uv index status
function measureUvIndex(uvIndex){
    if(uvIndex <= 2)
    {
        uvText.innerText ="Low";
    }else if(uvIndex <= 5){
        uvText.innerText="Moderate";
    }
    else if(uvIndex <= 5){
        uvText.innerText="Moderate";
    }
    else if(uvIndex <= 7){
        uvText.innerText="High";
    }
    else if(uvIndex <= 10){
        uvText.innerText="Very-High";
    }
    else{
        uvText.innerText="Extream";


    }
}

function updateHumidityStatus(humidity){
    if(humidity<= 30){
        humiditystatus.innerText="Low";
    }else if(humidity <= 60){
        humiditystatus.innerText="Moderate";
    }
    else {
        humiditystatus.innerText="High";
    }

}
function updateVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText="Dense Fog";
    }
    else if(visibility <= 0.16){
        visibilityStatus.innerText="Moderate Fog";
    }
    else if(visibility <= 0.35){
        visibilityStatus.innerText="Moderate Fog";
    }
    else if(visibility <= 1.16){
        visibilityStatus.innerText="Light Fog";
    }
    else if(visibility <= 2.16){
        visibilityStatus.innerText="VeryLight Fog";
    }
    else if(visibility <= 5.6){
        visibilityStatus.innerText="Light Mist";
    }
    else if(visibility <= 10.16){
        visibilityStatus.innerText="Clear Air";
    }else{
        visibilityStatus.innerText="Very Clear Air";


    }
}
function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good"

    }else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate"  
}
else if(airQuality <= 150){
    airQualityStatus.innerText = "Unhealthy for Sensitive Groups "  
}
else if(airQuality <= 200){
    airQualityStatus.innerText = "Unhealthy"  
}
else if(airQuality <= 250){
    airQualityStatus.innerText = "Very-Unhealthy"  
}else{
    airQualityStatus.innerText = "Harzordous"  

}
}
function convertTimeTo12HourFormat(time){
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm":"am";
    hour= hour & 12;
    hour = hour ? hour :12;//the zer hour should be 12
    hour = hour < 10? "0" + hour : hour ;//the zer hour should be 12
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;

}
function getIcon(condition){
    if(condition === "party-cloudy-day"){
        return "images/suns/s1.png";
    }else if(condition === "party-cloudy-night"){
        return "images/suns/s2.png";
    }
    else if(condition === "rain"){
        return "images/suns/rain.png";
    }
    else if(condition === "clear-day"){
        return "images/weather.png";
    }
    else if(condition === "clear-night"){
        return "images/suns/moon.png";
    }else {
        return "images/suns/s3.png";
    }
}
function getDayName(date){
    let day = new Date(date);
    let days = ["sunday","Monday","Tuesday","Wednusday","Thursday","Friday","Saturday"];
    return days[day.getDay()];
}
function getHours(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12)
    {
        hour = hour -12;
        return `${hour}:${min} PM`;
    }else{
        return `${hour}:${min} AM`;
    }

}

function updateForecast(date,unit,type){
    weatherCards.innerHTML = " "; 
    let day = 0;
    let numCards =0;
    if(type === day){
        numCards = 24;
    }else{
        numCards =7;
    }
    for(let i=0; i<numCards ; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHours(date[day].datetime);
        if(type === "Week"){
            dayName = getDayName(date[day].datetime);
        }
        let dayTemp = date[day].temp;
        if(unit === "f"){
            dayTemp = celciusToFahrenheit(date[day].temp);
        }
        let iconCondition = date[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F";
        }
        card.innerHTML = `<h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="" >
        </div>
        <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp-unit">${tempUnit}</span>
        </div>`;
        weatherCards.appendChild(card);
        day++;
    } 
}
function changeBackground(condition){
    const body = document.querySelector("body");
    let bg =" ";
    if(condition === "party-cloudy-day"){
        bg = "images/nature/n1.jpg";
    }else if(condition === "party-cloudy-night"){
        bg = "images/nature/n2.jpg";
    }
    else if(condition === "rain"){
        bg = "images/nature/n3.jpg";
    }
    else if(condition === "clear-day"){
        bg = "images/nature/n4.jpg";
    }
    else if(condition === "clear-night"){
        bg = "images/nature/n5.jpg";
    }else {
        bg = "images/nature/n6.jpg";

    }
    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5),rgb(0,0,0,0.5)),url(${bg})`;

}




fahrenheitBtn.addEventListener("click",function(){
   changeUnit("f");
})
celciusBtn.addEventListener("click",function(){
    changeUnit("c");
 })
 function changeUnit(unit){
    if(currentUnit !== unit){
        currentUnit = unit;
        {
        tempUnit.forEach((elem) =>{
            elem.innerText = `${unit.toUpperCase()}`;
        });
        if(unit === "c"){
            celciusBtn.classList.add("active");
            fahrenheitBtn.classList.remove("active");
        }else{
            celciusBtn.classList.remove("active");
            fahrenheitBtn.classList.add("active");

        }
        getWeatherData(currentCity,currentUnit,hourlyorWeek);

    }
 }
}
hourlyBtn.addEventListener("click",function(){
  changeTimeSpan ("hourly");
});
weekBtn.addEventListener("click",function(){
     changeTimeSpan ("week");
 });
function changeTimeSpan(unit){
    if(hourlyorWeek !== unit){
        hourlyorWeek=unit;
        if(unit !== "hourly"){
            hourlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        }else{
            hourlyBtn.classList.remove("active");
            weekBtn.classList.add("active");

        }
        //update weather on time change
        getWeatherData(currentCity,currentUnit,hourlyorWeek);
    }
}
searchForm.addEventListener("submit",function(e){
  e.preventDefault();
  let location = search.value;
  if(location){
    currentCity = location;
    getWeatherData(currentCity,currentUnit,hourlyorWeek);
  }
})

//lets create a cities which we want to suggest 
cities =["Davanagere","Bengaluru","Mangaluru ","Hubballi","Dharwad","Hampi","Kodagu","Udupi","Bagalkot","Chamarajanagar","Hassan","Kolar","Raichur","Gadag","Kalaburagi","Shivamogga","Bidar","Bengaluru Urban","Kalaburagi","Mandya","Mysuru"];
var currentFocus;
//search eventlisterner on search input
search.addEventListener("input",function(e){
    removeSuggestions();
    var a,b ,i,val = this.value;
    if(!val){
       return false; 
    }
    currentFocus = -1;
    
    a= document.createElement("ul");
    a.setAttribute("id","suggestions");
    this.parentNode.appendChild(a);

   // adding li's with matching search
   for(i=0;i<cities.length;i++){
    //check with items are start with same letter which are in input
    if(cities[i].substr(0,val.length).toUpperCase() === val.toUpperCase())
    {
        //if any suggestion matches then create li
        b = document.createElement("li");

        b.innerHTML = "<strong>" + cities[i].substr(0,val.length) +  "</strong>";
        b.innerHTML += cities[i].substr(val.length);
        //input field to hold the suggestion
        b.innerHTML += "<input type = 'hidden' value = '"+ cities[i] +"'>";


        b.addEventListener("click",function(e){
            search.value = this.getElementsByTagName("input")[0].value;
            removeSuggestions();
        });
        a.appendChild(b);
    }
   }

});
function removeSuggestions(){
    var x= document.getElementById("suggestions");

    if(x) x.parentNode.removeChild(x);
} 
 search.addEventListener("keydown",function(e){
     var x = document.getElementById("suggestions");
     // select the li elements opf suggestion
     if (x) x = x.getElementsByTagName("li");

     if(e.keyCode == 40){
         currentFocus++;
         addActive(x);
     }else if(e.keyCode == 38){
         currentFocus--;
         addActive(x);
     }
     if(e.keyCode == 14){
         e.preventDefault();
         if(currentFocus > -1){
             if (x) x[currentFocus].click();
       }
     }
 })

function addActive(x){
    
     if(!x)
     return false;
     removeActive(x);
     if(currentFocus >= x.length) currentFocus=0;    if(currentFocus < 0)  currentFocus = x.length - 1;
    x[currentFocus].classList.add("active");



 }
function removeActive(x){
    for(var i =0 ; i< x.length ; i++){
        x[i].classList.remove("active");
    }
}