<?php
include_once("connection.php");

if(isset($_POST["mode"])){
	global $connection;
	$return = "";
	if($_POST["mode"] == "county"){
		$query = "SELECT DISTINCT `county` FROM `streetname`";
		$result = $connection -> query($query);
		while($row = $result -> fetch_array()){
			if($return != "") $return .= " ";
			$return .= $row["county"];
		}
	}
	else if($_POST["mode"] == "township"){
		if(isset($_POST["county"])){
			$county = $_POST["county"];
			$query = "SELECT DISTINCT `township` FROM `streetname` WHERE `county` = ?";
			$stmt = $connection -> prepare($query);
			$stmt -> bind_param('s', $county);
			$stmt -> execute();
			$stmt -> bind_result($township);
			while($stmt -> fetch()){
				if($return != "") $return .= " ";
				$return .= $township;
			}
		}
	}
	else if($_POST["mode"] == "street"){
		if(isset($_POST["county"]) && isset($_POST["township"])){
			$county = $_POST["county"];
			$township = $_POST["township"];
			$query = "SELECT DISTINCT `street` FROM `streetname` WHERE `county` = ? AND `township` = ?";
			$stmt = $connection -> prepare($query);
			$stmt -> bind_param('ss', $county, $township);
			$stmt -> execute();
			$stmt -> bind_result($street);
			while($stmt -> fetch()){
				if($return != "") $return .= " ";
				$return .= $street;
			}
		}
	}
	echo $return;
}
?>