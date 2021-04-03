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
$sqlGet = "SELECT id, tool_type FROM ids";
$result = $conn->query($sqlGet);


$sqlPost = "INSERT INTO client_2021(id) VALUE($id_param);";

$match = false;

$id_param = str_replace("'","",$id_param);

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

if ($conn->query($sqlPost) === TRUE) {
  //  enters data into the SQL.
}


$conn->close();
?>
