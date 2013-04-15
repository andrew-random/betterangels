<?php

if (strpos($_SERVER['HTTP_HOST'], 'andrew') !== false) {
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', '');
	define('DB_NAME', 'betterangels');
} else {
	define('DB_HOST', 'localhost');
	define('DB_USER', 'cardbob1_ba');
	define('DB_PASS', 'betterangels');
	define('DB_NAME', 'cardbob1_ba');
}

define('FB_APP_ID','266561183460054');
define('FB_APP_SECRET', 'ce049403232a3039b5cbc803a518b018');