<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // 执行业务代码
    $app = $_GET['app'];
    $type = $_GET['type'];

    $body_json = file_get_contents('php://input');
    //echo $body_json ;
    $body_data = json_decode($body_json);
    $mobile = $body_data->mobile;
    $headers = getallheaders();
    if (isset($headers['X'])) {
        $jsonString = json_encode($headers); // 将请求头信息转化为JSON格式的字符串
        $jsonObj = json_decode($jsonString); // 解析JSON字符串为对象
        $xValue = $jsonObj->X; // 获取X键的值
        //echo $xValue;
    } else {
        echo 'X key not found';
    }
    $config = json_decode(file_get_contents('../config.json'), true);
    $key = $config['key'];
    $dxUrl = $config["dxUrl"];

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_PORT => "3000",
        CURLOPT_URL => $dxUrl . "/api/sendcode" . '?' . 'key=' . $key . '&' . 'app=' . $app . '&' . 'type=' . $type,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => "{\r\n    \"mobile\": \"" . $mobile . "\"\r\n}",
        CURLOPT_HTTPHEADER => [
            "content-type: application/json",
            "x: " . $xValue
        ],
    ]);

    $response = curl_exec($curl);
    $err = curl_error($curl);
    curl_close($curl);
    if ($err) {
        echo "cURL Error #:" . $err;
    } else {
        echo $response;
    }
} else {
    // 请求方式不是POST，不执行业务代码
    echo 'Invalid request method';
}


?>