<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "Cloudcase";

// Connectie maken
//$conn = internet connectie naar database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
// Als er een connectie is gemaakt wordt er niks laten zien, als er geen connectie wordt gemaakt komt er een weergave met connection failed in de web browser
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//selecteren welke data je wilt hebben van je webserver
$sql = "SELECT time, value FROM client_2021";
$result = $conn->query($sql);

//een json file aanmaken zodat het voor programma's beter leesbaar is
$json = array();
$value = array ();
$time = array ();



//als er een resultaat is met meer rijen dan 0 wordt deze data gepakt
//"fetch_assoc" geeft je getallen in een array met strings
if ($result->num_rows > 0) {
  
  while($row = $result->fetch_assoc()) {
    //json arrays aanroepen
    $time[] = $row["time"];
    $value[] = $row["value"];
  }
} else {
  echo "0 results";
}
$conn->close();

$json["time"] = $time;
$json["value"] = $value;

//print de array in de webpagina
echo json_encode ($json);

?>