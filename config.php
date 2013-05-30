<?php

if (strpos($_SERVER['HTTP_HOST'], 'andrew') !== false) {
	define('DB_HOST', 'localhost');
	define('DB_USER', 'root');
	define('DB_PASS', '');
	define('DB_NAME', 'betterangels');
} else {
	define('DB_HOST', 'localhost');
	define('DB_USER', 'revolvd6_asteven');
	define('DB_PASS', 'w00llyrh1n0');
	define('DB_NAME', 'revolvd6_betterangelsapp');
}

define('FB_APP_ID','266561183460054');
define('FB_APP_SECRET', 'ce049403232a3039b5cbc803a518b018');
define('DEBUG_MODE', true);