<?php 

	// include required constants
	require_once('config.php');

	// libraries
	require_once('includes/facebook.php');

	// kick up the PHP Facebook class
	$facebook = new Facebook(array(
	  'appId'  => FB_APP_ID,		// the Better Angels app ID
	  'secret' => FB_APP_SECRET,	// the Better Angels app secret
	));

	// handy variables
	$action 		= (isset($_REQUEST['action']) 		? $_REQUEST['action'] 		: false);	// current API action
	$accessToken 	= (isset($_REQUEST['access_token']) ? $_REQUEST['access_token'] : false);	// Access token passed from JS
	$character 		= (isset($_REQUEST['character']) 	? $_REQUEST['character'] 	: false);	// If a character is being edited, this contains the data.
	
	$messages 		= array();		// messages stacked here will be displayed sequentially as dialogs
	$userData		= false;		// will be filled in by Facebook.
	$success		= false;		// this glass starts empty.

	// use the session data provided by JS
	$facebook->setAccessToken($accessToken);	

	// get the user id of the active user
	$userId = $facebook->getUser();

	/***************************************************************
	 *	Connect to local DB
	 ***************************************************************/
	$localDB = @mysql_connect(DB_HOST, DB_USER, DB_PASS);	
	if ($localDB) {
		@mysql_select_db(DB_NAME);	
	}

	/***************************************************************
	 *	Check if this is an existing user. If not, init them.
	 ***************************************************************/
	if ($userId) {

		$sql = mysql_query("SELECT * FROM `users` WHERE fb_user_id = '"  . $userId . "'");
		$userData = mysql_fetch_assoc($sql);

		if ($userData) {

			// update last login date
			$sql = "UPDATE `users` SET last_login = '" . date('Y-m-d H:i:s', time()) . "' WHERE fb_user_id = '" . $userId . "'";
			mysql_query($sql);

		} else {

			// initialize a new user
			try {

				// We request user data from the GRAPH API here, which is butt-ass slow.
				$userData = $facebook->api('/me?fields=name,first_name,last_name,email,gender,locale,timezone');

				unset($userData['id']);

				// add the facebook user id
				$userData['fb_user_id'] = $userId;

				// add a user creation date
				$userData['created'] 	= date('Y-m-d H:i:s', time());
				$userData['last_login'] = date('Y-m-d H:i:s', time());

				$sqlKeys	= array();
				$sqlValues 	= array();
				foreach ($userData as $key => $value) {
					// TRUST NO ONE, NOT EVEN FACEBOOK
					$sqlKeys[] 		= htmlentities($key, ENT_QUOTES);
					$sqlValues[] 	= "'" . htmlentities($value, ENT_QUOTES) . "'";
				}
				$sql = 'INSERT INTO `users` (' . implode(",", $sqlKeys) .') VALUES (' . implode(",", $sqlValues) . ')';
				$success = mysql_query($sql);

				if (!$success) {
					// Something went wrong! Throw the response into the messages array.
					$messages[] = array(
						'title'	=> 'Login error', 
						'body' 	=> 'Database Failure.',
						'type' 	=> 'error',
					);
				}

			} catch (FacebookApiException $e) {

				// Something went wrong! Throw the response into the messages array.
				$messages[] = array(
					'title'	=> 'Login error', 
					'body' 	=> $e->getMessage(),
					'type' 	=> 'error',
				);

			}
		}
		
		
	}

	/***************************************************************
	 *	Response starts here
	 ***************************************************************/
	header('Cache-Control: no-cache, must-revalidate');
	header('Content-type: application/json');

	// json response we're going to return
	$json = array();

	// validate that we have a real FB user session
	if (!$userId) {
		
		$messages[] = array(
			'title'	=> 'No session found.', 
			'body' 	=> 'Please login to Facebook to access your characters.',
			'type' 	=> 'error',
		);

	} else if (!$localDB) {

		$message[] = array(
			'title'	=> 'Connection error.', 
			'body' 	=> 'Could not connect to DB.',
			'type' 	=> 'error',
		);

	} else {

		// do stuff, based on the passed action
		switch ($action) {

			case 'init':
				$success = true;
				
				// send back user data on first app load
				$json['user'] = $userData;

				// fetch characters
				$json['characters'] = array();

				$sql = mysql_query("SELECT * FROM `characters` WHERE fb_user_id = '"  . $userId . "'");
				while ($row = mysql_fetch_assoc($sql)) {
					$json['characters'][] = filterCharacterData($row);
				}

				break;

			case 'save_character':
				
				$insertSqlValues = array();
				$updateSqlValues = array();

				$characterData = $_REQUEST['character'];
				$characterData['fb_user_id'] = $userId;

				$canSaveCharacter = true;

				// check if the character already exists, and if the current user is the owner.
				$sql = mysql_query("SELECT fb_user_id, is_pregen FROM `characters` WHERE unique_id = '" . $characterData['unique_id'] . "'");
				if ($existingCharacterData = mysql_fetch_assoc($sql)) {

					if ($existingCharacterData['is_pregen'] || $existingCharacterData['fb_user_id'] != $userId) {
						$canSaveCharacter = false;
						$success = false;
					}
				}

				if ($canSaveCharacter) {
					// remove non-db fields
					unset($characterData['is_pregen']);
					unset($characterData['key']);
					
					foreach ($characterData as $key => $value) {
						switch ($key) {
							case 'strategies':
							case 'powers':
							case 'aspects':
							case 'meta_tags':
								if (!$value) {
									$value = array();
								}
								$value = json_encode($value);
								break;

							case 'created':
							case 'modified':
								$value = date('Y-m-d H:i:s', $value);
								break;

						}
						$insertSqlValues[$key] = "'" . htmlentities($value, ENT_QUOTES) . "'";
						$updateSqlValues[] = $key . " = '" . htmlentities($value, ENT_QUOTES) . "'";
					}

					// insert statement
					$sql = 'INSERT INTO `characters` (' . implode(",", array_keys($insertSqlValues)) .') VALUES (' . implode(",", $insertSqlValues) . ')';

					// update statement if the row already exists
					$sql .= 'ON DUPLICATE KEY UPDATE ' . implode(", ", $updateSqlValues);

					$success = mysql_query($sql);
					if (mysql_error()) {
						$messages[] = array('title' => 'Error', 'body' => 'DB failure.');
					}
				}
				
				break;

			case 'get_character':

				// retrieve one unique character
				$sql = mysql_query("SELECT * FROM `characters` WHERE unique_id = '" . $_REQUEST['unique_id'] . "'");
				$json['character'] = filterCharacterData(mysql_fetch_assoc($sql));

				if (mysql_error()) {
					$messages[] = array('title' => 'Error', 'body' => 'DB Failure');
				}	
				break;

			case 'delete_character':

				$characterData = $_REQUEST['character'];

				// check if the character already exists, and if the current user is the owner.
				$sql = mysql_query("SELECT fb_user_id, is_pregen FROM `characters` WHERE unique_id = '" . $characterData['unique_id'] . "'");
				$canDeleteCharacter = true;
				if ($existingCharacterData = mysql_fetch_assoc($sql)) {

					if ($existingCharacterData['is_pregen'] || $existingCharacterData['fb_user_id'] != $userId) {
						$canDeleteCharacter = false;
						$success = false;
					}
				}

				if ($canDeleteCharacter) {
					$sql = "DELETE FROM `characters` WHERE unique_id = '" . $characterData['unique_id'] ."' LIMIT 1";
					$success = mysql_query($sql);
					
					if (mysql_error()) {
						$messages[] = array('title' => 'Error', 'body' => 'DB Failure');
					}
				}
				
				break;
		}

	}

	if ($messages) {
		$json['messages'] 	= $messages;	// messages array	
	}
	
	$json['success'] 	= $success;

	echo @json_encode($json, JSON_NUMERIC_CHECK);

	if ($localDB) {
		mysql_close($localDB);	
	}



	/***************************************************************
	 *	Convenience functions
	 ***************************************************************/

	function filterCharacterData($row) {

		foreach ($row as $key => $value) {

			// remove db-only props													
			unset($row['id'], $row['key']);

			switch ($key) {
				default:
					$row[$key] = html_entity_decode($value);
					break;

				case 'created':
				case 'modified':
					$row[$key] = strtotime($value);
					break;

				case 'strategies':
				case 'powers':
				case 'aspects':
				case 'meta_tags':
					
					$value = html_entity_decode($value);

					if ($value) {
						$row[$key] = json_decode($value);
					} else {
						$row[$key] = array();
					}
					
					break;
			}
		}

		return $row;
	}
	
?>