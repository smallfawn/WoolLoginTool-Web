<?php
// 获取传参
$type = $_GET['type'];
// 读取config.json文件内容
//$config = file_get_contents('../config.json');


// 将JSON字符串转换为PHP数组
//$configArray = json_decode($config, true);
$config = json_decode(file_get_contents('../config.json'), true);
// 根据传参获取特定内容

if ($type == 'tips') {
    echo json_encode($config['tips']);
} else if ($type == 'notice') {
    echo $config["notice"];
} else if ($type == 'appList') {
    echo json_encode($config['appList'], JSON_UNESCAPED_UNICODE);
} else if ($type == 'upServer') {
    if ($config['ql']['qlUrl'] !== '' && $config['ql']['qlClientID'] !== '' && $config['ql']['qlClientSecret'] !== '') {
        $data = array(
            'upServerStatus' => true,
        );
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        header('Content-Type: application/json');
        echo $json;
    } else {
        $data = array(
            'upServerStatus' => false,
        );
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        header('Content-Type: application/json');
        echo $json;
    }
} else if ($type == "pay") {
    if ($config['pay']['type'] == "vmqpay") {
        $payConfig = array(
            'status' => $config['pay']['status'],
            'key' => $config['pay']['vmqpay']['key'],
            'upPrice' => $config['pay']['vmqpay']['upPrice'],
            'getPrice' => $config['pay']['vmqpay']['getPrice'],
            'payType' => $config['pay']['vmqpay']['payType'],
            'wechatPayQrCodeUrl' => $config['pay']['vmqpay']['wechatPayQrCodeUrl'],
            'aliPayQrCodeUrl' => $config['pay']['vmqpay']['aliPayQrCodeUrl']
        );
        $response = array('payConfig' => $payConfig);
        echo json_encode($response, JSON_UNESCAPED_UNICODE); // 将关联数组转换为JSON字符串并输出

    } else if ($config['pay']['type'] == "alipay") {
        $data = array(
            'status' => false,
            'msg' => '暂未开发支付宝当面付',
            'data' => null,
        );
        $json = json_encode($data, JSON_UNESCAPED_UNICODE);
        header('Content-Type: application/json');
        echo $json;
    }

}

?>