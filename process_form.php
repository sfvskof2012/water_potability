<?php

// 檢查是否是 POST 請求
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 接收 POST 資料
    $ph = $_POST["ph"];
    $hardness = $_POST["hardness"];
    $solids = $_POST["solids"];
    $chloramines = $_POST["chloramines"];
    $sulfate = $_POST["sulfate"];
    $conductivity = $_POST["conductivity"];
    $organicCarbon = $_POST["organicCarbon"];
    $trihalomethanes = $_POST["trihalomethanes"];
    $turbidity = $_POST["turbidity"];

    $str = '"C:\Program Files\R\R-4.2.0\bin\Rscript"'.' .\4A9G0120_SVM.R'." $ph"." $hardness"."  $solids"." $chloramines"." $sulfate"." $conductivity"." $organicCarbon"." $trihalomethanes"." $turbidity";

   
    exec($str, $output, $return_var);
    $pattern = "/\[\d\]/" ;
    $replacement = "";
    $output= preg_replace($pattern, $replacement, $output);



    
    
    // 在這裡進行您的數據處理邏輯
    // 例如，您可以將這些數據存儲到數據庫中，進行進一步的計算，或者返回相應的結果

    // 這裡只是一個簡單的範例，將數據返回瀏覽器
    $response = [
        "status" => "success",
        "message" => "Form data received successfully!",
        "data" => $output  // 這裡將所有 POST 數據返回，實際應用中可以根據需求進行處理
    ];

    echo json_encode($response);
} else {
    // 如果不是 POST 請求，返回錯誤消息
    $response = [
        "status" => "error",
        "message" => "Invalid request method."
    ];

    echo json_encode($response);
}

?>
