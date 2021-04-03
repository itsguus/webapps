<!DOCTYPE html>
<html>
<head>
    <title>CloudCase Tool Tracker</title>
</head>
<body>
    <h1></h1>
    <script>

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

    let refresh = setInterval(()=> {                 
        getDataByDbName('ids')
            .then (data => {
                knownIds = data;
            }).then(
                getDataByDbName('client_2021')
                    .then(
                        data => {
                            const newestEntry = data[data.length - 1];
                            const toolType = getToolType(newestEntry);
                            document.querySelector("h1").textContent = toolType;
                        }
                    )
                )
            }, refreshRate);

        </script>
</body>
</html>