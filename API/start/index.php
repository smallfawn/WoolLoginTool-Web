<?php
include('../data/data.php');
echo getKeyStatus();
function getKeyStatus()
{
    global $qq;
    global $key;
    global $dxUrl;
    $url = $dxUrl . "/api/start" . "?" . "qq=" . $qq . "&" . "key=" . urlencode($key);
    $result = curl_request($url);
    return $result;
}
function curl_request($url, $method = 'GET', $headers = [], $data = [])
{
    // 初始化 CURL
    $ch = curl_init();
    // 设置 CURL 的 URL
    curl_setopt($ch, CURLOPT_URL, $url);
    // 设置 CURL 的请求方式
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    // 如果请求方式为 POST 或 PUT，则需要设置请求体
    if ($method == 'POST' || $method == 'PUT') {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }
    // 设置 CURL 的请求头
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    // 设置 CURL 的返回值类型
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // 执行 CURL 请求
    $result = curl_exec($ch);
    // 关闭 CURL
    curl_close($ch);
    // 返回 CURL 的结果
    return $result;
}