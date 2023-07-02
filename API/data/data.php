<?php
$config = json_decode(file_get_contents('../config.json'), true);
$qlUrl = $config["ql"]["qlUrl"];
$qlClientID = $config["ql"]['qlClientID'];
$qlClientSecret = $config["ql"]["qlClientSecret"];
$key = $config["key"];
$dxUrl = $config["dxUrl"];
$qq = $config["qq"];