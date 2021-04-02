
<?php
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "Cloudcase";

// Create connection
//$conn = internet connectie naar database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
// Als er een connectie is gemaakt wordt er niks laten zien, als er geen connectie wordt gemaakt komt er een weergave met connection failed in de web browser
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

//variabele voor de waarde van de sensor
$value = $_GET["value"];
$sql = "INSERT INTO client_2021(value) VALUE($value);";

//voert de sql query uit
//als er een valide waarde uitkomt krijg je "New record succesfully" terug
//als er geen valide waarde uitkomt krijg je een error terug
if ($conn->query($sql) === TRUE) {
  echo "New record created successfully";
//dit is voor mensen leuk, maar je kan dit ook betekenis geven, bijvoorbeeld een 1
} else {
  echo "Error: " . $sql . "<br>" . $conn->error;
// hier error naar 0
}

$conn->close();
?>
