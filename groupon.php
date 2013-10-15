<?php

// PHP wrapper for GroupON API

$api_key = "ee7ef79a62fc7685ac2ef382c7a9ef885a3035d0";

$url = "http://api.groupon.com/v2/deals.json?";
$url .= "client_id=" . $api_key . "&" . http_build_query($_GET);

$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => $url,
    CURLOPT_USERAGENT => 'Mindsumo App'
));

echo curl_exec($curl);

?>