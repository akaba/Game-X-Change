<?php 
namespace DbFunctions;
use PDO;

class Util 
{
	//*To avoid SQL injection attacks separate the inputdata and SQL, so that inputdata will never be interpreted as commands by the SQL parser.
	
  	public function Login($connection, $input)
	{
		
		//sanitize inputs
		$email_or_phone = htmlspecialchars(strip_tags($input['data']['username']));
		$password = htmlspecialchars(strip_tags($input['data']['password']));

		$query="SELECT user.email, firstname, lastname 
			    FROM user
			    LEFT JOIN phone ON user.email = phone.email
			    WHERE (user.email =:email_or_phone OR phonenumber =:email_or_phone) AND password =:password";

		$statement = $connection->prepare($query);
		$statement->bindParam(":email_or_phone",$email_or_phone);		
		$statement->bindParam(":password",$password);
		$statement->execute();
		$user = $statement->fetch();
		// fetch the next row
		//while (($user = $statement->fetch(PDO::FETCH_ASSOC)) !== false) {
		//	$email= $user['email'];
		//}
		if(!isset($user[0]))
		{
			return $json = array("success" => false, "info" => "Username or password not found ! ");
		} else {			
			return $json = array("success" => true, "accessToken" => "G9lIb30RMHrHDc","email" => $user[0],"fullname" => $user[1]. " " .$user[2] );
		}
		
    }

	
	public function Register($connection, $input)
	{	
		//sanitize inputs
		$email = htmlspecialchars(strip_tags($input['data']['email']));
		$postalcode = htmlspecialchars(strip_tags($input['data']['postalcode']));
		$password = htmlspecialchars(strip_tags($input['data']['password']));
		$firstname = htmlspecialchars(strip_tags($input['data']['firstname']));
		$lastname = htmlspecialchars(strip_tags($input['data']['lastname']));
		$nickname = htmlspecialchars(strip_tags($input['data']['nickname']));
		$city = htmlspecialchars(strip_tags($input['data']['city']));
		$state = strtoupper(htmlspecialchars(strip_tags($input['data']['state'])));
		$postalcode = htmlspecialchars(strip_tags($input['data']['postalcode']));			

				//check if the email already exists
				$query = "SELECT email FROM user WHERE email =:email";
				$statement = $connection->prepare($query);
				$statement->bindParam(":email",$email);
				$statement->execute();
				$user = $statement->fetch();
				if(isset($user[0]))
				{
					return $json = array("success" => false, "info" => "Email is already registered");
				}	

		$phonenumber = htmlspecialchars(strip_tags($input['data']['phonenumber']));
		$phonetype = htmlspecialchars(strip_tags($input['data']['phonetype']));
		$showphone = htmlspecialchars(strip_tags($input['data']['showphone']));

		// check if optional field phonenumber is submitted
		// Null and/or empty strings are still set if the variable is declared. 
		if(isset($input['data']['phonenumber']) && $input['data']['phonenumber'] != "") {	

				//check if the phone number already exists
				$query = "SELECT phonenumber FROM phone WHERE phonenumber =:phonenumber";
				$statement = $connection->prepare($query);		
				$statement->bindParam(":phonenumber",$phonenumber);		
				$statement->execute();
				$phone = $statement->fetch();
				if(isset($phone[0]))
				{
					return $json = array("success" => false, "info" => "Phone number is already registered");
				}	
		}


		//check if the *City exist in Database list
		$query = "SELECT city FROM postalcode WHERE city =:city";
		$statement = $connection->prepare($query);		
		$statement->bindParam(":city",$city);		
		$statement->execute();
		$zipCity = $statement->fetch();
		if(!isset($zipCity[0]))
		{
			return $json = array("success" => false, "info" => "City does not exists in database");
		}	

		//check if the *State exist in Database list
		$query = "SELECT state FROM postalcode WHERE state =:state";
		$statement = $connection->prepare($query);		
		$statement->bindParam(":state",$state);		
		$statement->execute();
		$zipState = $statement->fetch();
		if(!isset($zipState[0]))
		{
			return $json = array("success" => false, "info" => "State does not exists in database");
		}

		//check if the Postal Code exist in Database list
		$query = "SELECT postalcode FROM postalcode WHERE postalcode =:postalcode";
		$statement = $connection->prepare($query);		
		$statement->bindParam(":postalcode",$postalcode);		
		$statement->execute();
		$zipPostalcode = $statement->fetch();
		if(!isset($zipPostalcode[0]))
		{
			return $json = array("success" => false, "info" => "Postal Code does not exists in database");
		}


		//check if the *City - *State - *Postal Code are from the same tuple
		$query = "SELECT state FROM postalcode WHERE city =:city";
		$statement = $connection->prepare($query);		
		$statement->bindParam(":city",$city);
		$statement->execute();
		$required_state = $statement->fetch();
		if($required_state[0] !== $state)
		{
			return $json = array("success" => false, "info" => "State does not match the City");
		}

		$query = "SELECT postalcode FROM postalcode WHERE city =:city";
		$statement = $connection->prepare($query);		
		$statement->bindParam(":city",$city);
		$statement->execute();
		$required_postalcode = $statement->fetch();
		if($required_postalcode[0] !== $postalcode)
		{
			return $json = array("success" => false, "info" => "Postal Code does not match the City");
		}

		// If we get here, time to insert user and phone(if provided).	

				try{

					/* Begin a transaction, turning off autocommit */	
					$connection->beginTransaction();
					$query ="INSERT INTO user (email,postalcode,password,firstname,lastname,nickname) VALUES (?,?,?,?,?,?)";
					$statement = $connection->prepare($query);				
					$statement->bindParam(1,$email);
					$statement->bindParam(2,$postalcode);
					$statement->bindParam(3,$password);
					$statement->bindParam(4,$firstname);
					$statement->bindParam(5,$lastname);
					$statement->bindParam(6,$nickname);
					$statement->execute();

					if($statement->rowCount() === 1) {  

						// insert phonenumber if it was submitted
						if(isset($input['data']['phonenumber']) && $input['data']['phonenumber'] != "") {
							
							$query ="INSERT INTO phone (phonenumber,email,phonetype,showphone) VALUES (?,?,?,?)";
							$statement = $connection->prepare($query);
							$statement->bindParam(1,$phonenumber,PDO::PARAM_STR);
							$statement->bindParam(2,$email,PDO::PARAM_STR);
							$statement->bindParam(3,$phonetype,PDO::PARAM_STR);
							$statement->bindParam(4,$showphone,PDO::PARAM_STR);
							$statement->execute();

							if($statement->rowCount() !== 1){
								$connection->rollBack();
								return array("success" => false, "info" => "Phone Number could not added to database.");
							} 
							
						}

					} else {
						$connection->rollBack();
						return array("success" => false, "info" => "User could not added to database.");
					}

					$connection->commit();
					return array("success" => true, "email" => $email);


				} catch (Exception $error){
					// Send error message to the server log
					error_log($error);
					$connection->rollBack();
					return array("success" => false, "info" => "Failed to create the user");

				}		
			


    }

	
	public function ViewMainMenu($connection,$input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));

		// my rating
		$query ="SELECT Round( AVG(rating), 2) as rating 
				FROM
					(
					SELECT proposeditemnumber as itemnumber, proposerrating as rating
					FROM swap
					UNION ALL
					SELECT desireditemnumber as itemnumber, counterpartyrating as rating
					FROM swap
					) Table1 
				WHERE rating is NOT NULL and itemnumber IN (SELECT itemnumber FROM item WHERE email =:email)";

		$statement = $connection->prepare($query);		
		$statement->bindParam(":email", $email);	
		$statement->execute();
		$rating = $statement->fetch();
		if(!isset($rating[0]))
		{
			$json = array("success" => true, "rating" => "None");
		} else {
			$json = array("success" => true, "rating" => $rating[0] );
		}

		// unaccepted swaps
		$query ="SELECT Count(desireditemnumber) unaccepted, MAX(DATEDIFF( CURDATE(), proposeddate )) as days
				FROM swap
				WHERE desireditemnumber IN (SELECT itemnumber FROM item WHERE email =:email)
				AND swapstatus ='proposed'";

		$statement = $connection->prepare($query);
		$statement->bindParam(":email",$email,PDO::PARAM_STR);	
		$statement->execute();
		$unaccepted = $statement->fetch();
		if(!isset($unaccepted[0]))
		{
			$json['unaccepted']="None";
		} else {			
			$json['unaccepted']=$unaccepted[0];
			$json['days']=$unaccepted[1];
		}
		
		// unrated swaps
		$query ="SELECT Count(proposeditemnumber) unrated
		FROM swap
		WHERE
		( 
		proposerrating IS NULL AND proposeditemnumber IN (SELECT itemnumber FROM item WHERE email =? )
		OR
		counterpartyrating IS NULL AND desireditemnumber IN (SELECT itemnumber FROM item WHERE email =? ) 
		)
		AND swapstatus ='accepted'";

		$statement = $connection->prepare($query);
		$statement->bindParam(1,$email);
		$statement->bindParam(2,$email);		
		$statement->execute();
		$unrated = $statement->fetch();
		if(!isset($unrated[0]))
		{
			$json['unrated']="None";
		} else {			
			$json['unrated']=$unrated[0];
		}

		return $json;

			
    }

	public function ListNewItem($connection, $input )
	{
		//sanitize inputs
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		$gametype = htmlspecialchars(strip_tags($input['data']['gametype']));
		$name = htmlspecialchars(strip_tags($input['data']['name']));
		$itemcondition = htmlspecialchars(strip_tags($input['data']['itemcondition']));
		$description = htmlspecialchars(strip_tags($input['data']['description']));
		$platform = htmlspecialchars(strip_tags($input['data']['platform']));
		$piececount = htmlspecialchars(strip_tags($input['data']['piececount']));
		$platformname = htmlspecialchars(strip_tags($input['data']['platformname']));
		$media = htmlspecialchars(strip_tags($input['data']['media']));

		// insert to item table
		try{

			/* Begin a transaction, turning off autocommit */	
			$connection->beginTransaction();
			$query ="INSERT INTO item (email,name,gametype,itemcondition) VALUES (?,?,?,?)";
			$statement = $connection->prepare($query);				
			$statement->bindParam(1,$email);
			$statement->bindParam(2,$name);
			$statement->bindParam(3,$gametype);
			$statement->bindParam(4,$itemcondition);
			$item = $statement->execute();

			if($statement->rowCount() === 1) { 

				$itemnumber = $connection->lastInsertId();

				// insert description if it was submitted
				if(isset($input['data']['description']) && $input['data']['description'] != "") {
					
					$query ="INSERT INTO description (itemnumber, description) VALUES (?,?)";
					$statement = $connection->prepare($query);
					$statement->bindParam(1,$itemnumber,PDO::PARAM_STR);
					$statement->bindParam(2,$description,PDO::PARAM_STR);
					$statement->execute();

					if($statement->rowCount() !== 1){
						$connection->rollBack();
						return array("success" => false, "info" => "Description could not added to database.");
					} 
					
				}

				// insert ComputerGame-platform if it was submitted
				if(isset($input['data']['platform']) && $input['data']['platform'] != "") {
					$query ="INSERT INTO computergame (itemnumber, platform) VALUES (?,?)";
					$statement = $connection->prepare($query);
					$statement->bindParam(1,$itemnumber,PDO::PARAM_STR);
					$statement->bindParam(2,$platform,PDO::PARAM_STR);
					$statement->execute();

					if($statement->rowCount() !== 1){
						$connection->rollBack();
						return array("success" => false, "info" => "ComputerGame-platform could not added to database.");
					} 
				}

				// insert JigsawPuzzle-piececount if it was submitted
				if(isset($input['data']['piececount']) && $input['data']['piececount'] != "") {
					$query ="INSERT INTO jigsawpuzzle (itemnumber, piececount) VALUES (?,?)";
					$statement = $connection->prepare($query);
					$statement->bindParam(1,$itemnumber,PDO::PARAM_STR);
					$statement->bindParam(2,$piececount,PDO::PARAM_STR);
					$statement->execute();

					if($statement->rowCount() !== 1){
						$connection->rollBack();
						return array("success" => false, "info" => "JigsawPuzzle-piececount could not added to database.");
					} 
				}

				// insert VideoGame-Media and Platform if it was submitted
				if(isset($input['data']['media']) && $input['data']['media'] != "" && isset($input['data']['platformname']) && $input['data']['platformname'] != "" ) {
					$query ="INSERT INTO videogame (itemnumber, platformid, media) VALUES (?,?,?)";
					$statement = $connection->prepare($query);
					$statement->bindParam(1,$itemnumber,PDO::PARAM_STR);
					$statement->bindParam(2,$platformname,PDO::PARAM_STR);
					$statement->bindParam(3,$media,PDO::PARAM_STR);
					$statement->execute();

					if($statement->rowCount() !== 1){
						$connection->rollBack();
						return array("success" => false, "info" => "VideoGame-Media and Platform could not added to database.");
					} 
				}





			} else {
				$connection->rollBack();
				return array("success" => false, "info" => "User could not added to database.");
			}

			$connection->commit();
			return array("success" => true, "itemnumber" => $itemnumber);


		} catch (Exception $error){
			// Send error message to the server log
			error_log($error);
			$connection->rollBack();
			return array("success" => false, "info" => "Failed to create the item");

		}		
	

			
    }

	public function ViewMyItems($connection, $input)
	{
			//sanitize inputs
			$email = htmlspecialchars(strip_tags($input['params']['email']));
			
	
			// insert description if it was submitted
			if(isset($email) && $email != "" ) {


				//check if the Postal Code exist in Database list
				$query = "SELECT gametype, count(*) as count FROM item 
				WHERE email =:email
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)				
				GROUP BY gametype";
				$statement = $connection->prepare($query);		
				$statement->bindParam(":email",$email);		
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {
					$json = array("success" => true, "counts" => $data);
				}

				$query="SELECT item.itemnumber, gametype, name, itemcondition, description						
				FROM item 
				LEFT JOIN description ON item.itemnumber=description.itemnumber 
				WHERE item.email =:email1
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)		
				ORDER BY item.itemnumber ASC";

				$statement = $connection->prepare($query);
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					$json['items'] = $data;
					
				}

				return $json;

			}


    }
	
	public function ViewItemDetails($connection, $input)
	{
		//sanitize inputs
		$itemnumber = htmlspecialchars(strip_tags($input['params']['itemnumber']));
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		

		// insert description if it was submitted
		if(isset($itemnumber) && $itemnumber != "" && isset($email) && $email != "" ) {

			// find item owner
			$owner="";
			$query="SELECT email from item WHERE itemnumber=:itemnumber";
			$statement = $connection->prepare($query);
			$statement->bindParam(':itemnumber',$itemnumber, PDO::PARAM_STR);	
			$statement->execute();
			$data = $statement->fetch();
			if(!isset($data[0]))
			{
				return $json = array("success" => false, "info" => "No item found with this number !");
			} else {
				$owner = $data[0];				
			}


			// if item owner is the current user
			if($owner == $email ){

				$query="SELECT item.itemnumber, name, gametype, itemcondition, description,
				platform, piececount, platform.platformname, videogame.media,
				IF(item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					), true, false) AS isAvailableForSwapping
					
				FROM item
				JOIN user on item.email= user.email
				JOIN postalcode on user.postalcode= postalcode.postalcode
				LEFT JOIN description on item.itemnumber=description.itemnumber
				LEFT JOIN computergame on item.itemnumber=computergame.itemnumber
				LEFT JOIN jigsawpuzzle on item.itemnumber=jigsawpuzzle.itemnumber
				LEFT JOIN videogame on item.itemnumber=videogame.itemnumber
				LEFT JOIN platform on videogame.platformid =platform.platformid
				WHERE item.itemnumber =:itemnumber";

				$statement = $connection->prepare($query);
				$statement->bindParam(':itemnumber',$itemnumber, PDO::PARAM_STR);			
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					return $json = array("success" => true, "items" => $data );					
				}
			}

			// if item owner is not current user
			if($owner != $email ){	

				$query="SELECT item.itemnumber, name, gametype, itemcondition, description,
				nickname, postalcode.city, postalcode.state, postalcode.postalcode,
				platform, piececount, platform.platformname, videogame.media,
				IF(item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					), true, false) AS isAvailableForSwapping

				FROM item
				JOIN user on item.email= user.email
				JOIN postalcode on user.postalcode= postalcode.postalcode
				LEFT JOIN description on item.itemnumber=description.itemnumber
				LEFT JOIN computergame on item.itemnumber=computergame.itemnumber
				LEFT JOIN jigsawpuzzle on item.itemnumber=jigsawpuzzle.itemnumber
				LEFT JOIN videogame on item.itemnumber=videogame.itemnumber
				LEFT JOIN platform on videogame.platformid =platform.platformid
				WHERE item.itemnumber =:itemnumber";

				$statement = $connection->prepare($query);
				$statement->bindParam(':itemnumber',$itemnumber, PDO::PARAM_STR);			
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					$json = array("success" => true, "owner" => $data );					
				}


				// owner rating
				$query ="SELECT Round( AVG(rating), 2) as rating 
				FROM
					(
					SELECT proposeditemnumber as itemnumber, proposerrating as rating
					FROM swap
					UNION ALL
					SELECT desireditemnumber as itemnumber, counterpartyrating as rating
					FROM swap
					) Table1 
				WHERE rating is NOT NULL and itemnumber IN (SELECT itemnumber FROM item WHERE email =:owner)";

				$statement = $connection->prepare($query);		
				$statement->bindParam(":owner", $owner);	
				$statement->execute();
				$rating = $statement->fetchAll(PDO::FETCH_COLUMN);
				if(!isset($rating[0]))
				{					
					$json['rating']="None";
				} else {					
					$json['rating']=$rating[0];						
				}

				// Distance
				$query="SELECT distance FROM
				(SELECT
				@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
				@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
				@lat2 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:owner1 ) lat2,
				@lon2 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:owner2 ) lon2,
				@Dlat := @lat2 - @lat1 Dlat,
				@Dlon := @lon2 - @lon1 Dlon,
				@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
				@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
				@D := ROUND(6371 * 0.621371*@c, 1) AS distance) T1";
				$statement = $connection->prepare($query);
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
				$statement->bindParam(':email2',$email, PDO::PARAM_STR);	
				$statement->bindParam(':owner1',$owner, PDO::PARAM_STR);			
				$statement->bindParam(':owner2',$owner, PDO::PARAM_STR);
				$statement->execute();
				$distance = $statement->fetchAll(PDO::FETCH_COLUMN);
				if(!isset($distance[0]))
				{					
					$json['distance']="None";
				} else {	
					$json['distance']=$distance[0];
				}

				return $json;

			}

		}
    }



	public function PlatformList($connection)
	{
		$query="SELECT platformID, platformname FROM platform";

		$statement = $connection->prepare($query);
		$statement->execute();	
		$data = $statement->fetchALL(PDO::FETCH_ASSOC);	 	

		if(isset($data[0]))
		{		   	
			return $json = array("success" => true, "data" => $data);	
		} else {	
			return $json = array("success" => false, "info" => "No Platform data found !");
		}
    }

	public function ViewUnratedSwaps($connection,$input)
    {
			$email = htmlspecialchars(strip_tags($input['params']['email']));	
    		$query= "WITH Swap_History AS 
			(
			SELECT s.statusdate AS AcceptenceDate, s.swapstatus, 
			pi.name AS ProposedItem,pi.itemnumber as proposeditemnumber,di.name AS DesiredItem, di.itemnumber as desireditemnumber,
			CASE 
			 WHEN pi.email =:email THEN 'Proposer'
			 WHEN di.email =:email THEN 'Counterparty'
			END AS MyRole,			
			CASE 
			 WHEN di.email =:email then (select nickname from user where email=pi.email)
			 else  (select nickname from user where email=di.email)
			end as OtherUser,			
			CASE 
			 WHEN pi.email =:email and proposerrating is NULL then 'NULL'
			 WHEN di.email =:email and counterpartyrating is NULL then 'NULL'
			END AS MyRating		
			FROM swap s 
			INNER JOIN Item pi on (s.proposeditemnumber = pi.ItemNumber)
			INNER JOIN Item di on (s.desireditemnumber = di.ItemNumber)
			)
			SELECT AcceptenceDate, MyRole, ProposedItem, DesiredItem, OtherUser, proposeditemnumber, desireditemnumber
			FROM Swap_History
			where MyRating='NULL' and swapstatus ='accepted'
			";

			$statement = $connection->prepare($query);		
			$statement->bindParam(":email",$email);
			$statement->execute();
			$UnratedSwaps = $statement->fetchALL(PDO::FETCH_ASSOC);	 
			return array("sucess"=>true,"results"=>$UnratedSwaps);
			
}
			


	public function UpdateRating($connection,$input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		$desireditem=htmlspecialchars(strip_tags($input['params']['ditem']));
		$proposeditem=htmlspecialchars(strip_tags($input['params']['pitem']));
		$rating=htmlspecialchars(strip_tags($input['params']['rating']));

		$query = "UPDATE swap s 
				LEFT JOIN item i on s.proposeditemnumber = i.itemnumber 
				LEFT JOIN item i2 on s.desireditemnumber = i2.itemnumber
				set 
				proposerrating = case 
				when i.email=:email then :rating end,
				counterpartyrating = case 
				when i2.email = :email then :rating end 
				WHERE (i.email = :email OR i2.email= :email ) AND i.itemnumber = :proposeditem AND i2.itemnumber = :desireditem
			";

		
		$statement = $connection->prepare($query);
		$statement->bindParam(":rating",$rating);	
		$statement->bindParam(":email",$email);	
		$statement->bindParam(":proposeditem",$proposeditem);	
		$statement->bindParam(":desireditem",$desireditem);	
		$statement->execute();

		return array("sucess"=>true,"ditem"=>$desireditem,"pitem"=>$proposeditem,"rating"=>$rating);;
	}

	public function SwapHistory ($connection, $input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));

		$queryStats="WITH swap_history AS	 
					(SELECT 
					CASE 
						WHEN pi.email =:email  THEN 'Proposer'
						WHEN di.email =:email  THEN 'Counterparty'
					END AS MyRole,	
					CASE when swapstatus = 'accepted' then 1 else 0 end as Accepted,
					CASE when swapstatus = 'rejected' then 1 else 0 end as Rejected
					FROM swap s 
					INNER JOIN Item pi on (s.ProposedItemNumber = pi.ItemNumber)
					INNER JOIN Item di on (s.DesiredItemNumber = di.ItemNumber)
					WHERE  (pi.email =:email   or di.email =:email  )
					)
					SELECT MyRole, Count(*) AS Total, 
					Sum(Accepted) AS Accepted,
					Sum(Rejected) AS Rejected,
					TRUNCATE((Sum(Accepted)/Count(*))*100,1) AS Rejected_prec
					FROM swap_history 
					GROUP BY MyRole"; 

		$statement1 = $connection->prepare($queryStats);
		$statement1->bindParam(":email",$email);	
		$statement1->execute();
		$Statistics = $statement1->fetchALL(PDO::FETCH_ASSOC);
		
		$queryHistory ="SELECT proposeddate, statusdate, swapstatus,
						i.name as ProposedItem, i2.name as DesiredItem,
						i.itemnumber as proposeditemnumber, i2.itemnumber as desireditemnumber,                   
						Case
							WHEN ProposerUser.email = :email THEN 'Proposer'
							WHEN CounterUser.email = :email THEN 'Counterparty'
						END AS MyRole,					
						Case
							WHEN ProposerUser.email = :email THEN CounterUser.nickname
							WHEN CounterUser.email = :email THEN ProposerUser.nickname
						end as OtherUser, 
						Case
							WHEN ProposerUser.email = :email THEN CounterUser.email
							WHEN CounterUser.email = :email THEN ProposerUser.email
						end as OtherUserEmail,                    
						Case 
							WHEN ProposerUser.email = :email THEN s.proposerrating
							WHEN CounterUser.email = :email THEN s.counterpartyrating
						end as Rating                    
						FROM Swap s 
						INNER JOIN item i on s.proposeditemnumber = i.itemnumber 
						INNER JOIN item i2 on s.desireditemnumber = i2.itemnumber
						INNER JOIN user ProposerUser on i.email=ProposerUser.email
						INNER JOIN user CounterUser on i2.email=CounterUser.email 
						WHERE (i.email = :email  or i2.email = :email ) and s.swapstatus IN ('accepted' ,'rejected')
						order by statusdate desc, proposeddate asc";

		$statement2 = $connection->prepare($queryHistory);
		$statement2->bindParam(":email",$email);	
		$statement2->execute();
		$history = $statement2->fetchALL(PDO::FETCH_ASSOC);
		return array("sucess"=>true,"stats"=>$Statistics,"history"=>$history);
    }
	

	public function SearchForItems($connection, $input)	
	{
			
		//sanitize inputs		
		$searchType = htmlspecialchars(strip_tags($input['data']['searchType']));
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		

		// insert description if it was submitted
		if(isset($email) && $email != "" && isset($searchType) && $searchType != ""  ) {

			if( $searchType == "bykeyword" ){

				$keyword = htmlspecialchars(strip_tags($input['data']['keyword']));

				$query="SELECT item.itemnumber, gametype, name, itemcondition, description, 
				@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
				@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
				@lat2 := latitude lat2,
				@lon2 := longitude lon2,
				@Dlat := @lat2 - @lat1 Dlat,
				@Dlon := @lon2 - @lon1 Dlon,
				@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
				@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
				@D := ROUND(6371 * 0.621371*@c, 1) AS distance				
				FROM item 
				LEFT JOIN description ON item.itemnumber=description.itemnumber 
				JOIN user ON user.email=item.email 
				JOIN postalcode ON user.postalcode=postalcode.postalcode 
				WHERE (item.name LIKE :keyword1 OR description LIKE :keyword2)
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)
				AND item.itemnumber NOT IN	(SELECT itemnumber FROM item WHERE email =:email3)		
				ORDER BY distance, item.itemnumber ASC";

				$statement = $connection->prepare($query);
				$keyword = '%' . $keyword . '%';
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
				$statement->bindParam(':email2',$email, PDO::PARAM_STR);
				$statement->bindParam(':keyword1',$keyword, PDO::PARAM_STR);
				$statement->bindParam(':keyword2',$keyword, PDO::PARAM_STR);
				$statement->bindParam(':email3',$email, PDO::PARAM_STR);
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {			
					return $json = array("success" => true, "results" => $data );
				}
			}

			if( $searchType == "inmyzip" ){
				
				$query="SELECT item.itemnumber, gametype, name, itemcondition, description, 
				@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
				@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
				@lat2 := latitude lat2,
				@lon2 := longitude lon2,
				@Dlat := @lat2 - @lat1 Dlat,
				@Dlon := @lon2 - @lon1 Dlon,
				@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
				@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
				@D := ROUND(6371 * 0.621371*@c, 1) AS distance				
				FROM item 
				LEFT JOIN description ON item.itemnumber=description.itemnumber 
				JOIN user ON user.email=item.email 
				JOIN postalcode ON user.postalcode=postalcode.postalcode 
				WHERE user.postalcode = (SELECT postalcode FROM user WHERE email=:email3)
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)
				AND item.itemnumber NOT IN (SELECT itemnumber FROM item WHERE email =:email4)		
				ORDER BY distance, item.itemnumber ASC";

				$statement = $connection->prepare($query);
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
				$statement->bindParam(':email2',$email, PDO::PARAM_STR);
				$statement->bindParam(':email3',$email, PDO::PARAM_STR);
				$statement->bindParam(':email4',$email, PDO::PARAM_STR);
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					return $json = array("success" => true, "results" => $data );
				}


			}



			if( $searchType == "withinmiles" ){

				$withinmiles = htmlspecialchars(strip_tags($input['data']['withinmiles']));

				$query="SELECT * FROM (				
				SELECT item.itemnumber, gametype, name, itemcondition, description, 
				@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
				@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
				@lat2 := latitude lat2,
				@lon2 := longitude lon2,
				@Dlat := @lat2 - @lat1 Dlat,
				@Dlon := @lon2 - @lon1 Dlon,
				@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
				@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
				@D := ROUND(6371 * 0.621371*@c, 1) AS distance				
				FROM item 
				LEFT JOIN description ON item.itemnumber=description.itemnumber 
				JOIN user ON user.email=item.email 
				JOIN postalcode ON user.postalcode=postalcode.postalcode 
				WHERE 
				item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)
				AND item.itemnumber NOT IN (SELECT itemnumber FROM item WHERE email =:email4)		
				ORDER BY distance, item.itemnumber ASC) T1 WHERE T1.distance <= :withinmiles
				";

				$statement = $connection->prepare($query);
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
				$statement->bindParam(':email2',$email, PDO::PARAM_STR);				
				$statement->bindParam(':email4',$email, PDO::PARAM_STR);
				$statement->bindParam(':withinmiles',$withinmiles, PDO::PARAM_STR);
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					return $json = array("success" => true, "results" => $data );
				}
			}

			if( $searchType == "inazip" ){

				$inazip = htmlspecialchars(strip_tags($input['data']['inazip']));

				//check if the Postal Code exist in Database list
				$query = "SELECT postalcode FROM postalcode WHERE postalcode =:postalcode";
				$statement = $connection->prepare($query);		
				$statement->bindParam(":postalcode",$inazip);		
				$statement->execute();
				$zipPostalcode = $statement->fetchAll(PDO::FETCH_ASSOC);				
				if(!isset($zipPostalcode[0]))
				{
					return $json = array("success" => false, "info" => "Postal Code does not exists in database");
				}

				$query="SELECT item.itemnumber, gametype, name, itemcondition, description, 
				@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
				@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
				@lat2 := latitude lat2,
				@lon2 := longitude lon2,
				@Dlat := @lat2 - @lat1 Dlat,
				@Dlon := @lon2 - @lon1 Dlon,
				@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
				@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
				@D := ROUND(6371 * 0.621371*@c, 1) AS distance				
				FROM item 
				LEFT JOIN description ON item.itemnumber=description.itemnumber 
				JOIN user ON user.email=item.email 
				JOIN postalcode ON user.postalcode=postalcode.postalcode 
				WHERE user.postalcode =:inazip
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)
				AND item.itemnumber NOT IN (SELECT itemnumber FROM item WHERE email =:email4)		
				ORDER BY distance, item.itemnumber ASC";

				$statement = $connection->prepare($query);
				$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
				$statement->bindParam(':email2',$email, PDO::PARAM_STR);
				$statement->bindParam(':inazip',$inazip, PDO::PARAM_STR);
				$statement->bindParam(':email4',$email, PDO::PARAM_STR);
				$statement->execute();
				$data = $statement->fetchAll(PDO::FETCH_ASSOC);
				if(!isset($data[0]))
				{					
					return $json = array("success" => false, "info" => "Sorry, no results found!");
				} else {	
					return $json = array("success" => true, "results" => $data );
				}

			}

			


		} 
	}

	public function ProposeSwap ($connection, $input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		
        $query="SELECT item.itemnumber, gametype, name, itemcondition						
				FROM item 
				WHERE item.email =:email
				AND item.itemnumber NOT IN
					(
					SELECT proposeditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')			
					UNION ALL
					SELECT desireditemnumber AS itemnumber
					FROM swap WHERE swapstatus IN ('proposed','accepted','completed')					
					)		
				ORDER BY item.itemnumber ASC";
			        

		$statement1 = $connection->prepare($query);
		$statement1->bindParam(":email",$email);	
		$statement1->execute();
		$MyItems = $statement1->fetchALL(PDO::FETCH_ASSOC);
		return array("sucess"=>true,"data"=>$MyItems);
	}

	
	

	public function insertswap($connection, $input)
	{	
		$proposeditemnumber=htmlspecialchars(strip_tags($input['params']['proposeditem']));
		$desireditemnumber=htmlspecialchars(strip_tags($input['params']['desireditem']));	

		try{
			/* Begin a transaction, turning off autocommit */	
			$connection->beginTransaction();
			$query= "INSERT INTO swap (proposeditemnumber, desireditemnumber,  proposeddate, swapstatus)
					VALUES (?, ?, CURDATE(), 'proposed')";

			$statement = $connection->prepare($query);
			$statement->bindParam(1,$proposeditemnumber);
			$statement->bindParam(2,$desireditemnumber);
				
			$statement->execute();

			//returns the number of rows affected by the last DELETE, INSERT, or UPDATE statement.
			if($statement->rowCount() === 1) { 
				return array("sucess"=>true,"infi"=>"swap is proposed");
			}

		} catch (Exception $error){
			// Send error message to the server log
			error_log($error);
			$connection->rollBack();
			return array("success" => false, "info" => "Failed to propose the swap");

		}	

        

		
	}



	public function viewunacceptedswaps($connection, $input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		
        $query="SELECT
		@rating := 
		(
		SELECT Round( AVG(rating), 2) as rating
		FROM(
				SELECT proposeditemnumber as itemnumber, proposerrating as rating,
				(SELECT email FROM item WHERE itemnumber =proposeditemnumber) email
				FROM swap
				UNION ALL
				SELECT desireditemnumber as itemnumber, counterpartyrating as rating,
				(SELECT email FROM item WHERE itemnumber =desireditemnumber) email
				FROM swap 
		) Table1 WHERE rating is NOT NULL and itemnumber IN (SELECT itemnumber FROM item WHERE email =:email)
		) AS rating,

		@lat1 := counterpartycode.latitude lat1,
		@lon1 := counterpartycode.longitude lon1,
		@lat2 := proposercode.latitude lat2,
		@lon2 := proposercode.longitude lon2,
		@Dlat := @lat2 - @lat1 Dlat,
		@Dlon := @lon2 - @lon1 Dlon,
		@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
		@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
		@D := ROUND(6371 * 0.621371*@c, 1) AS distance,

		proposeddate as date ,i.name as desireditem, Proposeruser.nickname as proposer, Proposeruser.email as proposerEmail,
		Proposeruser.firstname as proposerFirstname, Proposeruser.firstname as proposerFirstname,
		phone.phonenumber as ProposeruserPhoneNumber, 
		phone.phonetype as ProposeruserPhoneType, 
		phone.showphone as ProposeruserShowPhone,
		it.name as proposeditem , i.itemnumber desireditemnumber, it.itemnumber proposeditemnumber,
		it.itemnumber itemnumber

		FROM swap 
		INNER JOIN item i on i.itemnumber=swap.desireditemnumber 
		INNER JOIN item it on it.itemnumber=swap.proposeditemnumber 
		INNER JOIN user CounterUser on i.Email=CounterUser.email 
		INNER JOIN user ProposerUser on it.Email=ProposerUser.email 
		LEFT JOIN phone on ProposerUser.email=phone.email
		INNER JOIN postalcode ProposerCode on proposeruser.postalcode=ProposerCode.postalcode 
		INNER JOIN postalcode CounterPartyCode on CounterUser.postalcode=CounterPartyCode.postalcode 
		WHERE swapstatus = 'Proposed' and counteruser.email=:email
		ORDER BY proposeddate";
		
			        

		$statement = $connection->prepare($query);
		$statement->bindParam(":email",$email);	
		$statement->execute();
		$unacceptedswaps= $statement->fetchALL(PDO::FETCH_ASSOC);		

		return array("sucess"=>true,"data"=>$unacceptedswaps);
    }

	public function acceptrejectswap($connection, $input)

	{   $desireditemnumber=htmlspecialchars(strip_tags($input['params']['ditem']));
		$proposeditemnumber=htmlspecialchars(strip_tags($input['params']['pitem']));
		$acceptreject=htmlspecialchars(strip_tags($input['params']['desicion']));

		$query = "UPDATE swap 
				  SET swapstatus=:acceptreject, statusdate=CURDATE()
				  WHERE desireditemnumber= :desireditemnumber AND proposeditemnumber= :proposeditemnumber";

		$statement = $connection->prepare($query);
		$statement->bindParam(":desireditemnumber",$desireditemnumber);	
		$statement->bindParam(":proposeditemnumber",$proposeditemnumber);	
		$statement->bindParam(":acceptreject",$acceptreject);	
		$statement->execute();

		$queryuser= "SELECT item.email, user.nickname, phonenumber, showphone FROM item 
					INNER JOIN user ON item.email=user.email 
					INNER JOIN  phone ON item.email=phone.email
					WHERE itemnumber= :proposeditemnumber";		

		$statement1 = $connection->prepare($queryuser);
		$statement1->bindParam(":proposeditemnumber",$proposeditemnumber);	
		$statement1->execute();
		$user = $statement1->fetch(PDO::FETCH_ASSOC);

		return $user;



		
	}
    


	public function ViewSwapDetails($connection, $input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));
		$OtherUserEmail = htmlspecialchars(strip_tags($input['params']['OtherUserEmail']));
		$proposeditem = htmlspecialchars(strip_tags($input['params']['proposeditem']));
		$desireditem = htmlspecialchars(strip_tags($input['params']['desireditem']));


			// Swap Details
			$query1 = "SELECT s.proposeddate 'proposed', s.statusdate 'statusdate',  s.swapstatus 'status',  
			s.proposeditemnumber,s.desireditemnumber,
			CASE WHEN pi.email = :email THEN 'Proposer' 
					WHEN di.email = :email THEN 'Counterparty' 
					END AS myrole, 
			CASE WHEN pi.email = :email THEN s.proposerrating 
					WHEN di.email = :email THEN s.counterpartyrating 
					END AS ratingleft
			FROM swap s 
			INNER JOIN Item pi on (s.ProposedItemNumber = pi.ItemNumber) 
			INNER JOIN Item di on (s.DesiredItemNumber = di.ItemNumber) 
			WHERE pi.itemnumber = :proposeditem AND di.itemnumber = :desireditem ";
			
			$statement = $connection->prepare($query1);
			$statement->bindParam(':email',$email);	
			$statement->bindParam(":proposeditem", $proposeditem);	
			$statement->bindParam(":desireditem", $desireditem);			
			$statement->execute();
			$output1 = $statement->fetchALL(PDO::FETCH_ASSOC);	
			
		
		
			// Other User Details
			$query2 = "SELECT nickname, firstname, user.email, phonenumber, phonetype, showphone
			FROM user
			JOIN postalcode on user.postalcode= postalcode.postalcode
			LEFT JOIN phone on user.email=phone.email
			WHERE user.email=:email";
		
		$statement = $connection->prepare($query2);		
		$statement->bindParam(':email',$OtherUserEmail);	
		$statement->execute();
		$output2 = $statement->fetchALL(PDO::FETCH_ASSOC);

		// Distance
		$query="SELECT distance FROM
		(SELECT
		@lat1 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email1 ) lat1,
		@lon1 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:email2 ) lon1,
		@lat2 := (select latitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:owner1 ) lat2,
		@lon2 := (select longitude from user inner join postalcode on postalcode.postalcode = user.postalcode where email=:owner2 ) lon2,
		@Dlat := @lat2 - @lat1 Dlat,
		@Dlon := @lon2 - @lon1 Dlon,
		@a := POWER(SIN(RADIANS(@Dlat)/2), 2) + COS(RADIANS(@lat1)) * COS(RADIANS(@lat2)) * POWER(SIN(RADIANS(@Dlon)/2),2) a,
		@c := 2 * ATAN2(SQRT(@a), SQRT(1-@a)) c,
		@D := ROUND(6371 * 0.621371*@c, 1) AS distance) T1";
		$statement = $connection->prepare($query);
		$statement->bindParam(':email1',$email, PDO::PARAM_STR);	
		$statement->bindParam(':email2',$email, PDO::PARAM_STR);	
		$statement->bindParam(':owner1',$OtherUserEmail, PDO::PARAM_STR);			
		$statement->bindParam(':owner2',$OtherUserEmail, PDO::PARAM_STR);
		$statement->execute();
		$distance = $statement->fetchAll(PDO::FETCH_COLUMN);
		
		
		

		// Proposed Item
			$query3="SELECT item.itemnumber, name, gametype, itemcondition, description,		
			platform, piececount, platform.platformname, videogame.media
			FROM item			
			LEFT JOIN description on item.itemnumber=description.itemnumber
			LEFT JOIN computergame on item.itemnumber=computergame.itemnumber
			LEFT JOIN jigsawpuzzle on item.itemnumber=jigsawpuzzle.itemnumber
			LEFT JOIN videogame on item.itemnumber=videogame.itemnumber
			LEFT JOIN platform on videogame.platformid =platform.platformid
			WHERE item.itemnumber =:proposeditem";
		
		$statement = $connection->prepare($query3);		
		$statement->bindParam(":proposeditem", $proposeditem);
		$statement->execute();
		$output3 = $statement->fetchALL(PDO::FETCH_ASSOC);	
	
		
		// Desired Item
			$query4="SELECT item.itemnumber, name, gametype, itemcondition, description,		
			platform, piececount, platform.platformname, videogame.media
			FROM item			
			LEFT JOIN description on item.itemnumber=description.itemnumber
			LEFT JOIN computergame on item.itemnumber=computergame.itemnumber
			LEFT JOIN jigsawpuzzle on item.itemnumber=jigsawpuzzle.itemnumber
			LEFT JOIN videogame on item.itemnumber=videogame.itemnumber
			LEFT JOIN platform on videogame.platformid =platform.platformid
			WHERE item.itemnumber =:desireditem";
		
		$statement = $connection->prepare($query4);	
		$statement->bindParam(":desireditem", $desireditem);	
		$statement->execute();
		$output4 = $statement->fetchALL(PDO::FETCH_ASSOC);	
		
		
	    return array("swap" => $output1, "otheruser" => $output2,"pitem" => $output3,"ditem" => $output4,"distance"=>$distance);
	}	


	public function ViewUserInfo($connection, $input)
	{
		$email = htmlspecialchars(strip_tags($input['params']['email']));

		$query = "SELECT u.email, u.nickname, u.password, p.city, u.firstname, u.lastname, p.state, u.postalcode, ph.phonenumber, ph.phonetype, ph.showphone
		from user u
		inner join postalcode p on u.postalcode = p.postalcode
		inner join phone ph on u.email = ph.email
		WHERE u.email = :email";

		$statement = $connection->prepare($query);
		$statement->bindParam(':email',$email);	
		$statement->execute();
		$output = $statement->fetchALL(PDO::FETCH_ASSOC);

		return array("sucess"=>true,"userinfo" => $output);
	}

		
	public function UpdateUserInfo($connection, $input)
	{	
			// Check if user has unapproved or unrated swaps


			//sanitize inputs
			$email = htmlspecialchars(strip_tags($input['data']['email']));
			$postalcode = htmlspecialchars(strip_tags($input['data']['postalcode']));
			$password = htmlspecialchars(strip_tags($input['data']['password']));
			$firstname = htmlspecialchars(strip_tags($input['data']['firstname']));
			$lastname = htmlspecialchars(strip_tags($input['data']['lastname']));
			$nickname = htmlspecialchars(strip_tags($input['data']['nickname']));
			$city = htmlspecialchars(strip_tags($input['data']['city']));
			$state = strtoupper(htmlspecialchars(strip_tags($input['data']['state'])));
			$postalcode = htmlspecialchars(strip_tags($input['data']['postalcode']));	
			$phonenumber = htmlspecialchars(strip_tags($input['data']['phonenumber']));
			$phonetype = htmlspecialchars(strip_tags($input['data']['phonetype']));
			$showphone = htmlspecialchars(strip_tags($input['data']['showphone']));
	
			// check if optional field phonenumber is submitted
			// Null and/or empty strings are still set if the variable is declared. 
			if(isset($input['data']['phonenumber'])  && $input['data']['phonenumber'] != "") {	
	
					//check if the phone number already exists
					$query = "SELECT phonenumber FROM phone WHERE phonenumber =:phonenumber";
					$statement = $connection->prepare($query);		
					$statement->bindParam(":phonenumber",$phonenumber);		
					$statement->execute();
					$phone = $statement->fetch();
					if(isset($phone[0]))
					{
						return $json = array("success" => false, "info" => "Phone number is already registered");
					}	
			}
	
	
			//check if the *City exist in Database list
			$query = "SELECT city FROM postalcode WHERE city =:city";
			$statement = $connection->prepare($query);		
			$statement->bindParam(":city",$city);		
			$statement->execute();
			$zipCity = $statement->fetch();
			if(!isset($zipCity[0]))
			{
				return $json = array("success" => false, "info" => "City does not exists in database");
			}	
	
			//check if the *State exist in Database list
			$query = "SELECT state FROM postalcode WHERE state =:state";
			$statement = $connection->prepare($query);		
			$statement->bindParam(":state",$state);		
			$statement->execute();
			$zipState = $statement->fetch();
			if(!isset($zipState[0]))
			{
				return $json = array("success" => false, "info" => "State does not exists in database");
			}
	
			//check if the Postal Code exist in Database list
			$query = "SELECT postalcode FROM postalcode WHERE postalcode =:postalcode";
			$statement = $connection->prepare($query);		
			$statement->bindParam(":postalcode",$postalcode);		
			$statement->execute();
			$zipPostalcode = $statement->fetch();
			if(!isset($zipPostalcode[0]))
			{
				return $json = array("success" => false, "info" => "Postal Code does not exists in database");
			}
	
	
			//check if the *City - *State - *Postal Code are from the same tuple
			$query = "SELECT state FROM postalcode WHERE city =:city AND state =:state";
			$statement = $connection->prepare($query);		
			$statement->bindParam(":city",$city);
			$statement->bindParam(":state",$state);	
			$statement->execute();
			$required_state = $statement->fetch();
			if($required_state[0] !== $state)
			{
				return $json = array("success" => false, "info" => "State does not match the City");
			}
	
			$query = "SELECT postalcode FROM postalcode WHERE city =:city AND state =:state";
			$statement = $connection->prepare($query);		
			$statement->bindParam(":city",$city);
			$statement->bindParam(":state",$state);			
			$statement->execute();
			$required_postalcode = $statement->fetch();
			if($required_postalcode[0] !== $postalcode)
			{
				return $json = array("success" => false, "info" => "Postal Code does not match the City");
			}

			// If we get here, time to update user and phone(if provided).	

			try{

	
				$connection->beginTransaction();
				$query = "UPDATE user
				SET 
					nickname=:nickname, 
					password=:password, 
					firstname=:firstname, 
					lastname=:lastname, 
					postalcode=:postalcode 
				WHERE email=:email";

				$statement = $connection->prepare($query);
				$statement->bindParam(":nickname",$nickname);
				$statement->bindParam(":password",$password);
				$statement->bindParam(":firstname",$firstname);
				$statement->bindParam(":lastname",$lastname);
				$statement->bindParam(":postalcode",$postalcode);
				$statement->bindParam(":email",$email);
				$statement->execute();

				if($statement->rowCount() === 1) {  

					// insert phonenumber if it was submitted
					if(isset($input['data']['phonenumber'])  && $input['data']['phonenumber'] != "") {
						
						$query ="UPDATE phone 
							SET phonenumber =:phonenumber
						WHERE email=:email";

						$statement = $connection->prepare($query);
						$statement->bindParam(":phonenumber",$phonenumber);
						$statement->bindParam(":email",$email);
						$statement->execute();

						if($statement->rowCount() !== 1){
							$connection->rollBack();
							return array("success" => false, "info" => "Phone Number could not added to database.");
						} 
						
					}

				} else {
					$connection->rollBack();
					return array("success" => false, "info" => "User could not added to database.");
				}

				$connection->commit();
				return array("success" => true, "email" => $email,"fullname" => $firstname. " " .$lastname);


			} catch (Exception $error){
				// Send error message to the server log
				error_log($error);
				$connection->rollBack();
				return array("success" => false, "info" => "Failed to update the user");

			}
		}
	

  
  
    

}
?>
