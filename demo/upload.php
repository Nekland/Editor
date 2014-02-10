<?php

// Send error using another header than 200
function sendError($message) {
	header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
	echo json_encode(array('error' => $message));
	exit;
}

// Check for errors
if (empty($_FILES['image'])) sendError('Image not sent');
if ($_FILES['image']['error'] > 0) sendError('Error while uploading');


// Guessing file extension
$ext = explode('.', $_FILES['image']['name']);
$ext = $ext[count($ext)-1];

// generate name
$name = md5(uniqid(rand(), true)) . '.' . $ext;
$url  = 'uploads/' . $name;

// Save uploaded file
$resultat = move_uploaded_file($_FILES['image']['tmp_name'], $url);

// Last error check
if (!$resultat) sendError('Impossible to move the file into the uploads folder.');

// sending the url of the image
echo json_encode(array('url' => $url));