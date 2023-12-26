# 載入套件
library(e1071)
# 資料
data <- read.csv("water_potability.csv")
#將缺失的資料移除
data <- na.omit(data)
# 取80% 資料
test.index = sample(1:nrow(data), 0.8 * nrow(data))
# 80%訓練資料與20%測試資料
train.data = data[test.index,] 
test.data = data[-test.index,] 

#找到最符合訓練模型的gamma 和 cost
#tuned <- tune.svm(Potability ~., data = train.data, gamma = 10^(-3:-1), cost = 10^(-1:1)) 
#summary(tuned)

# 使用最佳參數建立支持向量機模型
svm.model <- svm(Potability ~ ., data = train.data, type='C-classification', cost = 1, gamma = 0.1)
summary(svm.model)

#取得預測結果
svm.pred <- predict(svm.model, test.data[,-10])

#用來比較模型預測的結果與實際情況之間的對應
table.svm.test=table(pred = svm.pred, true = test.data[,10])
#計算模型的準確度
correct.svm <- sum(diag(table.svm.test))/sum(table.svm.test)

cat("Accuracy:", round(correct.svm * 100, 2), "%\n")
print("Confusion Matrix:")
print(table.svm.test)

save(svm.model,file="water_potability-svm.RData")