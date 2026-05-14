<?php
// connect_db.php
$conn = new mysqli("localhost", "root", "", "sentinel_ai");

// Get data from your JavaScript sensor
$sensor = $_POST['sensor'];
$desc = $_POST['description'];
$sev = $_POST['severity'];
$time = date("h:i:sa");

$sql = "INSERT INTO incidents (timestamp, sensor, description, severity) 
        VALUES ('$time', '$sensor', '$desc', '$sev')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["status" => "success"]);
} else {
    echo json_encode(["status" => "error"]);
}
?>