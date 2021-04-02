
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

$id_param = $_GET["id"];

//selecteren welke data je wilt hebben van je webserver
$sql = "SELECT id, tool_type FROM valid_ids";
$result = $conn->query($sql);

$match = false;

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
        if($row["id"] == $id_param)  $match = true;
    }
  } else {
    echo "0 results";
  }
if($match) echo "GREEN";
else echo "RED";

$conn->close();
?>
