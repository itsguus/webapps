let knownIds = [];
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
    return new Date(`${yyyy}-${mm}-${dd}T${parseInt(hh) - 2}:${MM}:${ss}Z`);
}



let refresh = setInterval(()=> {                 
    getDataByDbName('ids')
        .then (data => {
            knownIds = data;
        }).then(
            getDataByDbName('client_2021')
                .then(
                    data => {
                        const  newestEntry = data[data.length - 1],
                               dataTime = getTime(newestEntry),
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
