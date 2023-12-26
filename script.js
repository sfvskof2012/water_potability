// 在页面加载完成后调用 showSubmittedValues 函数
document.addEventListener("DOMContentLoaded", function () {
    // 在此调用 showSubmittedValues 函数，传入您想要显示的默认数值
    var defaultValues = {
        "ph": "",
        "hardness": "",
        "solids": "",
        "chloramines": "",
        "sulfate": "",
        "conductivity": "",
        "organicCarbon": "",
        "trihalomethanes": "",
        "turbidity": ""
    };
    showSubmittedValues(defaultValues);
    
});


var temp = "";

// 生成全部随机数的逻辑
function generateRandomValues() {
    var inputFields = document.querySelectorAll('#waterQualityForm input[type="text"]');
    
    inputFields.forEach(function(input) {
        var min = parseFloat(input.getAttribute('min'));
        var max = parseFloat(input.getAttribute('max'));
        var randomValue = Math.random() * (max - min) + min;
        randomValue = parseFloat(randomValue.toFixed(5)); // 保留五位小数
        randomValue = Math.min(max, Math.max(min, randomValue)); // 确保在范围内
        input.value = randomValue;
    });
}

function submitForm() {
    var form = document.getElementById("waterQualityForm");
    // 使用 FormData 对象获取表单数据
    var formData = new FormData(document.getElementById("waterQualityForm"));
    var inputs = form.getElementsByTagName("input");
    var allInputsFilled = true;
    var firstEmptyInput = null;

    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];

        if (input.value.trim() === "") {
            allInputsFilled = false;
            showErrorMessage(input);

            if (!firstEmptyInput) {
                firstEmptyInput = input;
            }
        } else {
            clearErrorMessage(input);
        }
    }

    if (!allInputsFilled) {
        if (firstEmptyInput) {
            firstEmptyInput.focus();
        }
        return;
    }

    clearErrorMessages();

    var submittedValues = {};

    for (var j = 0; j < inputs.length; j++) {
        var inputItem = inputs[j];
        submittedValues[inputItem.name] = inputItem.value;
        inputItem.value = "";
    }

    showSubmittedValues(submittedValues);

    window.scrollTo({
        top: 0,
        behavior: 'smooth' // 滾動效果，'smooth' 表示平滑滾動
    });

    // 发送 AJAX 请求
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "process_form.php", true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                // 处理成功响应
                var response = JSON.parse(xhr.responseText);

                if (response.status === "success") {
                    // 成功的处理逻辑，例如显示成功消息
                    console.log(response.message);
                    // 假設 response.data 是一個包含字符串的數組
                    var rawData = response.data[0]; // 取出數組中的第一個元素

                    // 去掉額外的引號和空格
                    var cleanedData = rawData.replace(/["\s]/g, "");
                    if(cleanedData === "0")
                        temp = "否";
                    else
                        temp = "是";
                    showSubmittedValues(submittedValues);                   
                } else {
                    // 處理其他情况，例如顯示錯誤消息
                    console.error(response.message);
                }
            } else {
                // 處理錯誤響應
                console.error("Error during the request.");
            }
        }
    };
    xhr.send(formData);

}

function showSubmittedValues(values) {
    var submittedValuesContainer = document.getElementById("submittedValuesContainer");
    submittedValuesContainer.innerHTML = "";  // 清空先前的內容

    var labelMapping = {
        "ph": "酸鹼值 (pH)",
        "hardness": "硬度 (Hardness)",
        "solids": "固體含量 (Solids)",
        "chloramines": "氯胺 (Chloramines)",
        "sulfate": "硫酸鹽 (Sulfate)",
        "conductivity": "導電度 (Conductivity)",
        "organicCarbon": "有機碳 (Organic Carbon)",
        "trihalomethanes": "三鹵甲烷 (Trihalomethanes)",
        "turbidity": "濁度 (Turbidity)"
    };

    // 創建表示可飲用性的元素
    var drinkableElement = document.createElement("div");
    drinkableElement.className = "submitted-item";
    
    var drinkableLabel = document.createElement("div");
    drinkableLabel.className = "submitted-label";
    drinkableLabel.textContent = "可飲用性:";
    drinkableLabel.style.textAlign = "left";

    var drinkableValue = document.createElement("div");
    drinkableValue.className = "submitted-value";
    drinkableValue.textContent = "是";  // 這裡可以根據實際邏輯來設定可飲用性的值
    drinkableValue.style.textAlign = "left";


    var titleContainer = document.createElement("div");
    titleContainer.className = "title-container";
    titleContainer.style.textAlign = "center"; // 設定容器內容居中

    var title = document.createElement("h1");
    title.textContent = "輸出數據";
    titleContainer.appendChild(title);

    // 插入到submittedValuesContainer的最前面
    submittedValuesContainer.appendChild(titleContainer);

        // 添加 <hr> 元素（在titleContainer上方）
        var separatorTop = document.createElement("hr");
        separatorTop.style.margin = "0 0px 30px 0px"; // 上右下左的 margin
        titleContainer.appendChild(separatorTop);

    // 創建其他水質參數的元素
    for (var key in values) {
        if (values.hasOwnProperty(key)) {
            var submittedItem = document.createElement("div");
            submittedItem.className = "submitted-item";

            var label = document.createElement("div");
            label.className = "submitted-label";
            label.textContent = labelMapping[key] + ":";
            label.style.textAlign = "left";

            var value = document.createElement("div");
            value.className = "submitted-value";
            value.textContent = values[key];
            value.style.textAlign = "left";

            submittedItem.appendChild(label);
            submittedItem.appendChild(value);

            submittedValuesContainer.appendChild(submittedItem);
        }
    }
    var separator = document.createElement("hr");
    separator.style.margin = "20px 0"; // 設置分隔線的上下 margin
    submittedValuesContainer.appendChild(separator);

    // 添加表示可飲用性的元素
    var drinkableElement = document.createElement("div");
    drinkableElement.className = "submitted-item";

    var drinkableLabel = document.createElement("div");
    drinkableLabel.className = "submitted-label";
    drinkableLabel.textContent = "可飲用性(Potability):";
    drinkableLabel.style.textAlign = "left";

    var drinkableValue = document.createElement("div");
    drinkableValue.className = "submitted-value";
    drinkableValue.textContent = temp;  // 這裡可以根據實際邏輯來設定可飲用性的值
    drinkableValue.style.textAlign = "left";

    drinkableElement.appendChild(drinkableLabel);
    drinkableElement.appendChild(drinkableValue);

    submittedValuesContainer.appendChild(drinkableElement);

}


// 點擊按鈕顯示浮動視窗
function openModal(imageUrl) {
    var modal = document.getElementById("myModal");
    var modalImage = document.getElementById("modalImage");

    modal.style.display = "block";
    modalImage.src = imageUrl;

    // 建立一個單次監聽器以確保只在按下一次 "ESC" 時觸發
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeModal();
            window.removeEventListener('keydown', handleKeyDown);
        }
    }

    window.addEventListener('keydown', handleKeyDown);
}
  
 // 關閉浮動視窗
 function closeModal() {
    var modal = document.getElementById("myModal");
    modal.style.display = "none";

    document.removeEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

// 顯示專題說明的浮動視窗
function openDescriptionModal() {
    document.getElementById("descriptionModal").style.display = "block";

    // 建立一個單次監聽器以確保只在按下一次 "ESC" 時觸發
    function handleKeyDown(event) {
        if (event.key === 'Escape') {
            closeDescriptionModal();
            window.removeEventListener('keydown', handleKeyDown);
        }
    }

    window.addEventListener('keydown', handleKeyDown);
}

// 關閉專題說明的浮動視窗
function closeDescriptionModal() {
    document.getElementById("descriptionModal").style.display = "none";

    document.removeEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeDescriptionModal()
        }
    });
}

function showErrorMessage(input) {
    var existingError = input.parentNode.querySelector(".error-message");

    if (!existingError) {
        var errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        errorSpan.style.color = "red";
        errorSpan.textContent = "請填寫此欄位";

        var labelElement = input.parentNode.querySelector("label");

        input.parentNode.insertBefore(errorSpan, labelElement.nextSibling);
    }
}

function clearErrorMessage(input) {
    var existingError = input.parentNode.querySelector(".error-message");

    if (existingError) {
        existingError.parentNode.removeChild(existingError);
    }
}

function clearErrorMessages() {
    var errorSpans = document.querySelectorAll(".error-message");

    for (var i = 0; i < errorSpans.length; i++) {
        var errorSpan = errorSpans[i];
        errorSpan.parentNode.removeChild(errorSpan);
    }
}