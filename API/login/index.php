<?php

include('../data/data.php');
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $isUp = $_GET['isUp'];
    $app = $_GET['app']; //GET传参
    $type = $_GET['type']; //GET传参
    foreach ($config['appList'] as $appConfig) {
        if ($appConfig['app'] == $app) {
            $ValueNameList = $appConfig['ValueName'];
            if (strpos($type, 'app') !== false) {
                $ValueName = $ValueNameList['app'];
            } elseif (strpos($type, 'wx') !== false) {
                $ValueName = $ValueNameList['wx'];
            } elseif (strpos($type, 'web') !== false) {
                $ValueName = $ValueNameList['web'];
            }
            break;
        }
    }
    $loginRes = getLoginRes();
    $loginRes = json_decode($loginRes);
    if ($loginRes->status == '1') {
        if ($isUp) {
            $token = getToken();
            $OriginalVariable = getOriginalVariable($token, $ValueName);
            $id = $OriginalVariable->id;
            $newValue = $loginRes->data;
            $value = $OriginalVariable->value . '@' . $newValue;
            $upValueResult = upValue($token, $ValueName, $value, $id);
            if ($upValueResult->code == 200) {
                $res = array(
                    'status' => true,
                    'msg' => '添加变量成功',
                    'data' => $newValue
                );
            } else {
                $res = array(
                    'status' => false,
                    'msg' => '添加变量失败',
                    'data' => $newValue
                );
            }
            header('Content-Type: application/json');
            echo json_encode($res, JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode($loginRes, JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode($loginRes, JSON_UNESCAPED_UNICODE);
    }
} else {
    // 请求方式不是POST，不执行业务代码
    echo 'Invalid request method';
}
function getLoginRes()
{
    $headers = getallheaders();
    $body_json = file_get_contents('php://input'); //POST传参
    $body_data = json_decode($body_json); //解析POST传参
    if (isset($headers['X'])) {
        $jsonString = json_encode($headers); // 将请求头信息转化为JSON格式的字符串
        $jsonObj = json_decode($jsonString); // 解析JSON字符串为对象
        $xValue = $jsonObj->X; // 获取X键的值
        //echo $xValue;
    } else {
        echo 'X key not found';
    }
    $app = $_GET['app']; //GET传参
    $type = $_GET['type']; //GET传参
    $mobile = $body_data->mobile; ////获取post传参mobile
    $code = $body_data->code;
    global $key;
    global $dxUrl;
    $url = $dxUrl . "/api/login" . '?' . 'key=' . $key . '&' . 'app=' . $app . '&' . 'type=' . $type;
    $data = "{\r\n    \"mobile\": \"" . $mobile . "\",\r\n    \"code\":\"" . $code . "\"\r\n}";
    $headers = [
        "content-type: application/json",
        "x: " . $xValue
    ];
    $loginRes = curl_request($url, "POST", $headers, $data);
    return $loginRes;
}
function getOriginalVariable($token, $ValueName)
{
    global $qlUrl;
    $url = $qlUrl . '/open/envs?searchValue=' . $ValueName;
    $headers = [
        "Authorization:" . $token
    ];
    $getOriginalVariableResult = curl_request($url, "GET", $headers);
    $getOriginalVariableResult = json_decode($getOriginalVariableResult);
    if ($getOriginalVariableResult->code == 200) {

        return $getOriginalVariableResult->data[0];
    } else {
        return $getOriginalVariableResult;
    }
}

function upValue($token, $ValueName, $value, $id)
{
    global $qlUrl;
    global $qlClientID;
    global $qlClientSecret;
    $url = $qlUrl . '/open/envs';
    $headers = [
        "content-type: application/json",
        "Authorization:" . $token
    ];
    $data = "{\r\n  \"value\": \"" . $value . "\",\r\n  \"name\": \"" . $ValueName . "\",\r\n  \"remarks\": \"" . null . "\",\r\n  \"id\": " . $id . "\r\n}";
    //echo $data;
    $upValueResult = curl_request($url, 'PUT', $headers, $data);
    $upValueResult = json_decode($upValueResult);
    if ($upValueResult->code == 200) {

        return $upValueResult;
    } else {
        // 返回空字符串
        return $upValueResult;
    }

}
function getToken()
{
    global $qlUrl;
    global $qlClientID;
    global $qlClientSecret;
    $url = $qlUrl . '/open/auth/token' . '?' . 'client_id=' . $qlClientID . "&" . 'client_secret=' . $qlClientSecret;
    $method = 'GET';
    $qlGetTokenResult = curl_request($url, $method);
    // 解析 JSON
    $qlGetTokenResult = json_decode($qlGetTokenResult, true);
    //$qlGetTokenResult = json_encode($qlGetTokenResult);
    // 返回 token
    //return $qlGetTokenResult['code'];
    if ($qlGetTokenResult['code'] == 200) {
        // 提取 token
        //return $qlGetTokenResult['data']['token'];
        $qlToken = $qlGetTokenResult['data']['token'];
        return 'Bearer ' . $qlToken;
    } else {
        // 返回空字符串
        return $url;
    }
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
?>