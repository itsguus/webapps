let knownIds = [];
let newestEntry; 
const refreshRate = 1000;

async function getDataByDbName(name) {
    const url = `http://192.168.178.24:8888/select_db.php/?db=${name}`
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

function getToolType(obj) {
    return knownIds.find(entry => entry.id == obj.id).tool_type;
}

function isntASecondAgo(dataTime, now) {
    if((now - dataTime) > 2000 ) return false;
    return true;
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
        console.log(newestEntry);
        toolText.textContent = toolType;
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
                        if(isntASecondAgo(dataTime, new Date()))
                            document.getElementById(toolType).classList.add("active");
                    }
                )
            )
        }, refreshRate);
