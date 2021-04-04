let knownIds = [];
let newestEntry; 
let errorsLogged = [];
const refreshRate = 1000;

async function getDataByDbName(name) {
    const url = `http://192.168.178.24:8888/select_db.php/?db=${name}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function getToolType(obj) {
    if(knownIds.find(entry => entry.id == obj.id) == undefined) return null;
    return knownIds.find(entry => entry.id == obj.id).tool_type;
}

function isntASecondAgo(dataTime, now) {
    if((now - dataTime) > 2000 ) return false;
    return true;
}

function kelvinToCelsius(temp) {
    return (temp-272.15).toFixed(1);
}

function insertEntryIntoList(obj, toolType) {
    const list = document.querySelector(".log ul");
    if(list.classList.contains("empty")) list.classList.remove("empty");
    var node = document.createElement("li");
    node.innerHTML = `<p>${obj.time} | ${toolType} | id: ${obj.id}</p>`
    list.insertBefore(node,list.querySelector("li:first-of-type"));
}


function logError(obj) {
    if(errorsLogged.includes(obj.time)) return;
    else {
        const list = document.querySelector(".errors ul");
        if(list.classList.contains("empty")) list.classList.remove("empty");
        var node = document.createElement("li");
        node.innerHTML = `<p>${obj.time} | Unknown tag scanned [id: ${obj.id}]</p>`
        list.insertBefore(node,list.querySelector("li:first-of-type"));
        errorsLogged.push(obj.time);
    }
}



function getTime(obj) {
    var timeStr = obj.time,
    yyyy = timeStr.substr(0,4),
    mm = timeStr.substr(5,2),
    dd = timeStr.substr(8,2),
    hh = timeStr.substr(11,2),
    MM = timeStr.substr(14,2),
    ss = timeStr.substr(17,2);
    var newDate =  Date.parse(`${yyyy}-${mm}-${dd}T${hh}:${MM}:${ss}`);
    return new Date(newDate);
}

function fakeCarTrigger(el) {
    // If everything is accounted for, stop otherwise run the function.
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
                        for(var img of images) {
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


    