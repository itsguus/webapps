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

// Get the /?='id' parameter from the URL. This is the ID that is sent from the NodeMCU.
$id_param = $_GET["id"];

// This script inserts data into the database and also validates ID's through another database.
// Therefor we need to have access to the SQL that we post to, and a SQL that we GET from.

$sqlGet = "SELECT id, tool_type FROM ids";
$sqlPost = "INSERT INTO client_2021(id) VALUE($id_param);";

// Put the result from the GET into a variable.
$result = $conn->query($sqlGet);

// Make variable match. This variable is false by default and will become true when a match is found.
$match = false;

// The ID is passed as a string with quotation marks. To insert these into the SQL data we need to 
// quotation marks.
$id_param = str_replace("'","",$id_param);

// Retrieve the results from the SQL compare these to the ID parameter. If a match is found,
// the boolean $match is set to true.
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        if($row["id"] == $id_param)  $match = true;
    }
  } else {
    echo "0 results";
  }

// Finally, if there's a match, echo "GREEN". This text is identified by the NodeMCU and will set
// it's light to green. Same goes for red if it's not a match.
if($match) echo "GREEN";
else echo "RED";

if ($conn->query($sqlPost) === TRUE) {
  //  enters data into the SQL.
}

$conn->close();
?>
