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

$db_param = $_GET["db"];


switch ($db_param) {
  case "ids":
    $sql = "SELECT time, id, tool_type FROM $db_param";
    break;
  case "client_2021":
    $sql = "SELECT time, id FROM $db_param";
    break;
}

$result = $conn->query($sql);

//een json file aanmaken zodat het voor programma's beter leesbaar is
$json = array();


//als er een resultaat is met meer rijen dan 0 wordt deze data gepakt
//"fetch_assoc" geeft je getallen in een array met strings


if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    switch($db_param) {
      case "ids":
        $json[] = (object) ["id" => $row["id"], "tool_type" => $row["tool_type"]];
        break;
      case "client_2021":
        $json[] = (object) ["time" => $row["time"], "id" => $row["id"]];
        break;
    }
  }
} else {
  echo "0 results";
}
$conn->close(); 

//print de array in de webpagina
echo json_encode ($json);
?>