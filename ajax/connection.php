<?php
$host = 'localhost';
$user_name = 'id14265478_jsdb';
$password = 'nMbLhUN^tP8hIHIa';
$db = 'id14265478_jsdbdata';
$connection = new mysqli($host, $user_name, $password, $db);
$connection->query("SET NAMES utf8");
$connection->query("SET CHARACTER_SET_CLIENT=utf8");
$connection->query("SET CHARACTER_SET_RESULTS=utf8");
?>