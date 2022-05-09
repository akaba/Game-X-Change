<?php
	error_reporting(E_ALL);
	ini_set('display_errors', 1);
	header("Access-Control-Allow-Origin: http://localhost:3000");
	header("Access-Control-Allow-Headers: *");
	header("Access-Control-Allow-Methods: *");	
	header("Access-Control-Allow-Credentials: true");	
	header("Content-Type: application/json; charset=UTF-8");


    include_once 'db_config.php';
	$db = new DbConnect();
	
	include_once 'db_functions.php';
	$util = new DbFunctions\Util();	

	$method = isset($_SERVER['REQUEST_METHOD'])?$_SERVER['REQUEST_METHOD']:'';

	$result;

	if($method == "GET") {		

			$action = $_REQUEST['action'];
			$connection = $db->connect();

			match ($action) {				
				'ViewMyItems' => $result = $util->ViewMyItems($connection),				
				'PlatformList' => $result = $util->PlatformList($connection),
			};
			
			$connection = null;
			echo json_encode($result);


	} else if($method == "POST") {

			$action = $_REQUEST['action'];	
			$input = json_decode(file_get_contents("php://input"),true);
			$connection = $db->connect();			

			match ($action) {				
				'Login' => $result = $util->login($connection,$input),
				'Register' => $result = $util->Register($connection,$input),
				'ViewMainMenu' => $result = $util->ViewMainMenu($connection,$input),
				'ListNewItem' => $result =  $util->ListNewItem($connection,$input),				
				'SearchForItems' => $result =  $util->SearchForItems($connection,$input),
				'ViewMyItems' => $result =  $util->ViewMyItems($connection,$input),
				'ViewItemDetails' => $result =  $util->ViewItemDetails($connection,$input),
				'ViewUnratedSwaps' => $result =  $util->ViewUnratedSwaps($connection,$input),
				'UpdateRating' => $result =  $util->UpdateRating($connection,$input),
				'SwapHistory' => $result =  $util->SwapHistory($connection,$input),
				'ViewSwapDetails' => $result =  $util->ViewSwapDetails($connection,$input),
				'ProposeSwap' => $result =  $util-> ProposeSwap($connection,$input),
				'ViewUserInfo' => $result =  $util->ViewUserInfo($connection,$input),
				'insertswap' => $result =  $util-> insertswap($connection,$input),				
				'viewunacceptedswaps' => $result =  $util-> viewunacceptedswaps($connection,$input),
				'acceptrejectswap' => $result =  $util-> acceptrejectswap($connection,$input),
				'UpdateUserInfo' => $result =  $util-> UpdateUserInfo($connection,$input),
				
				

				
				
			
			};

		
			$connection = null;
			echo json_encode($result);


	}else{

			$json = array("success" => false, "Info" => "Request method not accepted!");
			echo json_encode($json);

	}
	 
	
?>