<?php

	/***************
	*	This file pulls the current list of abilities and writes them to a JS file. 
	*	This allows individual browsers to cache the files, and reduces the amount of duplicate ajax load that needs to be sent each time a user loads the app.
	***************/
	
	// include required constants
	require_once('config.php');

	/***************************************************************
	 *	Connect to local DB
	 ***************************************************************/
	$localDB = @mysql_connect(DB_HOST, DB_USER, DB_PASS);	
	if ($localDB) {
		@mysql_select_db(DB_NAME);
	}

	// relative location of the content file.
	$destinationFile = 'data/cache.js';

	$cacheData = array(
		'ability' 		=> array(
				'power' 	=> array(),
				'aspect'	=> array(),
			),
		'characters' 	=> array(
			'pregen' 		=> array()
		),
		'pages'			=> array(
			'list'			=> array(),
			'tree'			=> array(),
			'alias'			=> array(),
		)
	);

	// fetch supernatural abilities
	$sql = mysql_query("SELECT * FROM `supernatural_abilities`");
	while ($row = mysql_fetch_assoc($sql)) {
		
		// strip unneeded elements
		unset($row['ability_id']);

		$cacheData['ability'][$row['power_type']][] = $row;
	}

	
	// fetch supernatural abilities
	$sql = mysql_query("SELECT * FROM `characters` WHERE is_pregen = '1'");
	while ($row = mysql_fetch_assoc($sql)) {

		$cacheData['characters']['pregen'][] = filterCharacterData($row);
	}

	// fetch db pages
	$sql = mysql_query("SELECT * FROM `pages`");
	while ($row = mysql_fetch_assoc($sql)) {

		// add empty children array
		$row['children'] = array();
		
		// raw page data
		$cacheData['pages']['list'][$row['page_id']] = $row;

		// aliases
		$cacheData['pages']['alias'][$row['alias']] = $row['page_id'];
		
	}

	// second loop after all pages are added
	foreach ($cacheData['pages']['list'] as $pageId => $row) {

		if ($row['parent']) {
			$cacheData['pages']['list'][$row['parent']]['children'][] = $pageId;
		}

		// place in tree hierarchy
		appendToPageTree($row['page_id'], $row['parent'], $cacheData['pages']['tree']);
	}


	// string to write to the file
	$fileContent = 'var cacheData = ' . json_encode($cacheData, JSON_NUMERIC_CHECK) . ';';

	// write to the appropriate file.
	$success = false;
	if ($fileContent) {
		$success = file_put_contents($destinationFile, $fileContent);	
	}
	

	if ($success) {
		echo 'File written.';
	} else {
		echo 'Could not write to file.';
	}

	/***************************************************************
	 *	Convenience functions
	 ***************************************************************/

	function filterCharacterData($row) {

		foreach ($row as $key => $value) {

			// remove db-only props													
			unset($row['id'], $row['fb_user_id'], $row['key']);

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

	function appendToPageTree($newPageId, $newPageParentId, &$pageArray) {
		
		// hierarchy tree
		if (!$newPageParentId) {
			
			$pageArray[$newPageId] = array();
			return true;

		} else {
			// current level check
			foreach ($pageArray as $pageId => $childPageArray) {

				// can't have two places in the hierarchy
				if ($pageId == $newPageId) {
					return false;
				}

				if ($pageId == $newPageParentId) {
					$pageArray[$pageId][$newPageId] = array();
					return true;
				}
			}

			foreach ($pageArray as $pageId => $childPageArray) {
				// deeper check
				$success = appendToPageTree($newPageId, $newPageParentId, &$childPageArray);
				if ($success) {
					return true;
				}
			}
		}
		return false;
	}

?>