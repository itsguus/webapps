<!DOCTYPE html>
<html>
<head>
    <title>View chart xsensor</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.4/dist/Chart.min.js"></script>
</head>
<body>
    <canvas id="myChart" width="200" height="200"></canvas>
        <script>
        var ctx = document.getElementById('myChart').getContext('2d');

        fetch ('http://localhost/select_db.php')
        //localhost vervangen met de ngrok link
            .then (response => response.json ())
            .then (data => drawChart (data));

//setinterval, om de 10 seconden de chart opnieuw tekenen
        setInterval (function (){
            fetch ('http://localhost/select_db.php')
        //localhost vervangen met de ngrok link
            .then (response => response.json ())
            .then (data => drawChart (data));
        }, 10000
        );
       

        // var time = ["10:00", "11:00", "12:00"];
        // var sensorValue = ["10", "1", "30"];
        //    drawChart (time, sensorValue); 

        // function drawChart(xAxis, yAxis){
        function drawChart (data){
            var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.time,
                    datasets: [{
                        label: 'Sensor Value xsenor',
                        data: data.sensorValue,
                        // backgroundColor: [
                        //     'rgba(255, 99, 132, 0.2)',
                        //     'rgba(54, 162, 235, 0.2)',
                        //     'rgba(255, 206, 86, 0.2)',
                        //     'rgba(75, 192, 192, 0.2)',
                        //     'rgba(153, 102, 255, 0.2)',
                        //     'rgba(255, 159, 64, 0.2)'
                        // ],
                        // borderColor: [
                        //     'rgba(255, 99, 132, 1)',
                        //     'rgba(54, 162, 235, 1)',
                        //     'rgba(255, 206, 86, 1)',
                        //     'rgba(75, 192, 192, 1)',
                        //     'rgba(153, 102, 255, 1)',
                        //     'rgba(255, 159, 64, 1)'
                        //],
                        borderWidth: 1
                    }]
                },
                options: {
                    animation: {
                        duration: 0
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                }
            });
        }
        </script>

</body>
</html>