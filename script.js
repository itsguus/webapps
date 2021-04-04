// AUTHOR GUUS GROENINK
// guus@monkeyhead.nl

// First set up some global variables. knownIds gets filled with the predefined valid IDs.
// newestEntry is the most recent entry of the JSON file. This is a global variable as 
// it is often used outside the scope of the refresh function.
// errorsLogged is filled with timestamps of errors, as it otherwise logged the same error often.
// the refreshRate is in ms. This is the rate with which the data is refreshed. 

let knownIds = [];
let newestEntry; 
let errorsLogged = [];
const refreshRate = 1000;

// This is a function that makes fetching easier. Enter the URL and the data
// is returned in a promise.
async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// This function is a variation of getData. With this function the url is mostly filled in,
// so only the name of the database is necessary. Written to keep main code clean. 
async function getDataByDbName(name) {
    const url = `http://192.168.178.24:8888/select_db.php/?db=${name}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// This function searches one database with an ID that is given. The parameter obj
// is an Object, so obj.id is necessary to find the ID.
// 
// First it checks if the find function has a result. If it doesn't it returns null,
// if its does, it returns the tool_type. (i.e. "hammer");
function getToolType(obj) {
    if(knownIds.find(entry => entry.id == obj.id) == undefined) return null;
    return knownIds.find(entry => entry.id == obj.id).tool_type;
}

// This function takes two dates and checks if the difference is under two seconds. 
function isntASecondAgo(dataTime, now) {
    if((now - dataTime) > 2000 ) return false;
    return true;
}

// Self explanatory, on 1 decimal.
function kelvinToCelsius(temp) {
    return (temp-272.15).toFixed(1);
}

// This function creates a HTML <li> element and appends it at the top of the selected <ul>. 
// obj is passed as an Object, toolType is a string. 
function insertEntryIntoList(obj, toolType) {
    const list = document.querySelector(".log ul");
    if(list.classList.contains("empty")) list.classList.remove("empty");
    let node = document.createElement("li");
    node.innerHTML = `<p>${obj.time} | ${toolType} | id: ${obj.id}</p>`
    list.insertBefore(node,list.querySelector("li:first-of-type"));
}

// This function creates a HTML <li> element and appends it at the top of the selected <ul>. 
// obj is passed as an Object. The function first checks if the error is already logged. 
// If so, it does nothing, otherwise it creates and appends the <li> node on top of 
// the <ul>.
function logError(obj) {
    if(errorsLogged.includes(obj.time)) return;
    else {
        const list = document.querySelector(".errors ul");
        if(list.classList.contains("empty")) list.classList.remove("empty");
        let node = document.createElement("li");
        node.innerHTML = `<p>${obj.time} | Unknown tag scanned [id: ${obj.id}]</p>`
        list.insertBefore(node,list.querySelector("li:first-of-type"));
        errorsLogged.push(obj.time);
    }
}

// This is a very specific time conversion function. The time data was passed as a string.
// This function retrieves the characters at the right places and builds them back together 
// as a proper Date format. This readable date is then returned.
function getTime(obj) {
    let timeStr = obj.time,
    yyyy = timeStr.substr(0,4),
    mm = timeStr.substr(5,2),
    dd = timeStr.substr(8,2),
    hh = timeStr.substr(11,2),
    MM = timeStr.substr(14,2),
    ss = timeStr.substr(17,2);
    let newDate =  Date.parse(`${yyyy}-${mm}-${dd}T${hh}:${MM}:${ss}`);
    return new Date(newDate);
}


// This function is triggered by the button on the webapp. If the tool is present the function
// adds an "active" class to the p:last-of-type. This p contains the "All is good" message.
// 
// If the tool is not present, it retrieves the tooltype and ID from the newestEntry. 
// It then inserts this tooltype and ID into the last-p, being the error message. 
// It then makes it pop up by adding a class and removing it after 4 seconds.
function fakeCarTrigger(el) {
    if(document.querySelector("#hammer").classList.contains('active')) {
        el.parentNode.querySelector("p:last-of-type").classList.add("active");
        setTimeout(() => {
            el.parentNode.querySelector("p:last-of-type").classList.remove("active");
        }, 4000);
        return;
    } 
    else {
        const toolText = el.parentNode.querySelector("span.tool"),
        idText = el.parentNode.querySelector("span.id"),
              toolType = getToolType(newestEntry);
        toolText.textContent = "hammer";
        idText.textContent = newestEntry.id;
        // Class makes the popup appear.
        el.parentNode.querySelector("p").classList.add("active");
        setTimeout(() => {
            el.parentNode.querySelector("p").classList.remove("active");
        }, 4000);
    }
}



// This is the core functionality. This function happens every ${refreshRate]. 
// First off, we need to access two databases, so we getDataByDbName twice and store
// the data from these promises into variables to use later.
// 
// Then put the newest refreshed entry from the database into newestEntry and get the time and 
// tooltype of these entries.
// 
// Then we make every <img> of the tools inactive. All the tools but also have a fake__active class,
// which makes them active nonetheless. This is because there is only one NodeMCU we work with during
// prototyping. 
// 
// Then,if the toolType is not found it means an unkown ID is scanned, so we logError it. 
// Otherwise, if the data entry is recent (2000ms) make the img active and log the entry into the list.

let refresh = setInterval(()=> {                 
    getDataByDbName('ids')
        .then (data => {
            knownIds = data;
        }).then(
            getDataByDbName('client_2021')
                .then(
                    data => {
                        newestEntry = data[data.length - 1];
                        const  dataTime = getTime(newestEntry),
                               toolType = getToolType(newestEntry);
                        let images = document.querySelectorAll(".images img");
                        for(let img of images) {
                            img.classList.remove("active");
                        }

                        if(!toolType) logError(newestEntry);
                        else if(isntASecondAgo(dataTime, new Date())) {
                            document.getElementById(toolType).classList.add("active");
                            insertEntryIntoList(newestEntry, toolType);
                        }
                    }
                )
            )
        }, refreshRate);


// This is the API reference and only happens on pageLoad. 
// Before anything happens, we need the users IP adress via api.ipify.org/. We can then use this IP adress
// to get the lat and long with ipapi.co/. Then we insert lat and long coords into api.openweathermap. 
// From there on we combine all the data and put them into our weather tile. 
const ipUrl = 'https://api.ipify.org?format=json';
getData(ipUrl)
    .then(ipObj => {
        const requestUrl = `https://ipapi.co/${ipObj.ip}/json/`;
        getData(requestUrl)
            .then(data => {
                let coords = {
                    long: data.longitude,
                    lat: data.latitude
                };
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.long}&appid=03808207ced7cd2226d5347db519ff9e`;
                getData(weatherUrl)
                .then(weatherData => {
                    let weatherIcon = weatherData.weather[0].icon,
                    weatherDescription = weatherData.weather[0].description,
                    weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}@4x.png`,
                    weatherTemp = kelvinToCelsius(weatherData.main.temp);
                    weatherDOM = document.querySelector(".weather");
                    console.log(weatherTemp);

                    weatherDOM.querySelector("img").src=weatherIconUrl; 
                    weatherDOM.querySelector("p:nth-of-type(1) span").textContent=weatherData.name; 
                    weatherDOM.querySelector("p:nth-of-type(2) span").textContent=weatherTemp;
                    weatherDOM.querySelector("p:last-of-type").textContent=weatherDescription; 
                    weatherDOM.querySelector("p:last-of-type").textContent=weatherDescription; 
                    });
            });
    });


    