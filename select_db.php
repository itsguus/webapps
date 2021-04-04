<?php
// AUTHOR GUUS GROENINK
// guus@monkeyhead.nl



// Set server and database names
$servername = "localhost";
$username = "root";
$password = "root";
$dbname = "Cloudcase";

// Create connection to the SQL database.
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
// Make a 'connection failed' error popup if we can't connect.
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

// Get the /?='db' parameter from the URL. This is the datbase that is .
$db_param = $_GET["db"];


// Since the values are different per database multiple cases are to be made.
switch ($db_param) {
  case "ids":
    $sql = "SELECT time, id, tool_type FROM $db_param";
    break;
  case "client_2021":
    $sql = "SELECT time, id FROM $db_param";
    break;
}

// Put the result from the GET into a variable.
$result = $conn->query($sql);

// Make an empty array named $json. We're going to stuff all our data into this.
$json = array();


//als er een resultaat is met meer rijen dan 0 wordt deze data gepakt
//"fetch_assoc" geeft je getallen in een array met strings

// Retrieve the results from the SQL to build the $json file. We're turning it
// into an Object. With the following format, for case "ids" the Json wil look like this:
// [
//    Object {
//       id: "12345678",
//       tool_type: "hammer"
//    },
//    etc.
// ]

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

// Print the array into the page so it can be retrieved by accessing this .php file.
echo json_encode ($json);
?>