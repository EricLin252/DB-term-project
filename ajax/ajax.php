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
	else if($_POST["mode"] == "select"){
		$select_arg = array(
			"county" => "",
			"township" => "",
			"street" => "",
			"detail" => "",
			"start_t" => "",
			"end_t" => "",
		);
		foreach($select_arg as $key => $value){
			if(isset($_POST[$key])) $select_arg[$key] = $_POST[$key];
		}

		$where = "";
		if($select_arg["county"] != "") $where .= "AND P.`county` = ? ";
		if($select_arg["township"] != "") $where .= "AND P.`township` = ? ";
		if($select_arg["street"] != "") $where .= "AND P.`street` = ? ";
		if($select_arg["detail"] != "") $where .= "AND P.`detail` LIKE ? ";
		if($select_arg["start_t"] != "" && $select_arg["end_t"] != "") $where .= "AND D.`datetime` BETWEEN ? AND ? ";

		$type = "";
		for($i = 0; $i < count($select_arg); $i++){
			if($select_arg[$i] == ""){
				array_splice($select_arg, $i, 1);
				$i--;
			}
			else $type .= $select_arg[$i];
		}

		if($_POST["a1"] != ""){
			$query = "SELECT P.`detail` FROM `pos_a1` P, `data_a1` D, `vehicle_a1` V
					  WHERE D.`uid` = P.`data_id` AND D.`uid` = V.`data_id` " . $where;
			$stmt = $connection -> prepare($query);
			$stmt -> bind_param($type, ...$select_arg);
			$stmt -> execute();
			$stmt -> bind_result($detail);
			while($stmt -> fetch()){
				if($return != "") $return .= " ";
				$return .= $detail;
			}
		}
		if($_POST["a2"] != ""){
			$query = "SELECT P.`detail` FROM `pos_a2` P, `data_a2` D, `vehicle_a2` V
					  WHERE D.`uid` = P.`data_id` AND D.`uid` = V.`data_id` " . $where;
			$stmt = $connection -> prepare($query);
			$stmt -> bind_param($type, ...$select_arg);
			$stmt -> execute();
			$stmt -> bind_result($detail);
			while($stmt -> fetch()){
				if($return != "") $return .= " ";
				$return .= $detail;
			}
		}
	}
	else if($_POST["mode"] == "group"){
	}
	echo $return;
}
?>