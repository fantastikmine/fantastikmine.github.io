<?php
// Настройки приложения Discord
$client_id = '1143523217563197440';
$client_secret = 'GBmEA2nHd6pi_wBvZgwJ-XfugkHXZEiZ'; // 🔁 замени на свой секрет
$redirect_uri = 'http://localhost';     // 🔁 замени на свой реальный URI

if (!isset($_GET['code'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Нет кода авторизации']);
    exit;
}

$code = $_GET['code'];

// Шаг 1: Получаем access token
$token_request = curl_init();

curl_setopt_array($token_request, [
    CURLOPT_URL => 'https://discord.com/api/oauth2/token',
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => http_build_query([
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'grant_type' => 'authorization_code',
        'code' => $code,
        'redirect_uri' => $redirect_uri,
        'scope' => 'identify'
    ]),
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/x-www-form-urlencoded'
    ]
]);

$response = curl_exec($token_request);
curl_close($token_request);

$token = json_decode($response, true);

if (!isset($token['access_token'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось получить токен']);
    exit;
}

// Шаг 2: Получаем данные пользователя
$user_request = curl_init();
curl_setopt_array($user_request, [
    CURLOPT_URL => 'https://discord.com/api/users/@me',
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $token['access_token']
    ]
]);

$user_response = curl_exec($user_request);
curl_close($user_request);

$user = json_decode($user_response, true);

if (!isset($user['id'])) {
    http_response_code(500);
    echo json_encode(['error' => 'Не удалось получить пользователя']);
    exit;
}

header('Content-Type: application/json');
echo json_encode([
    'id' => $user['id'],
    'username' => $user['username'],
    'discriminator' => $user['discriminator'],
    'avatar' => $user['avatar']
]);
