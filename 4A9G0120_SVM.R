args = commandArgs(TRUE)

ph <- as.numeric(args[1])
Hardness <- as.numeric(args[2])
Solids <- as.numeric(args[3])
Chloramines <- as.numeric(args[4])
Sulfate <- as.numeric(args[5])
Conductivity <- as.numeric(args[6])
Organic_carbon <- as.numeric(args[7])
Trihalomethanes <- as.numeric(args[8])
Turbidity <- as.numeric(args[9])

# ph <- 8.684778672 # 酸鹼值
# Hardness <- 161.1242048 # 硬度
# Solids <- 40799.36033 # 固體含量
# Chloramines <- 5.381993558 # 氯胺
# Sulfate <- 305.5337841 # 硫酸鹽
# Conductivity <- 499.2754008 # 導電度
# Organic_carbon <- 15.96565159 # 有機碳
# Trihalomethanes <- 75.9143981 # 三鹵甲烷
# Turbidity <- 3.877349185 # 濁度


library("e1071")
load("water_potability-svm.RData", .GlobalEnv)

# 創建資料框
water_data <- data.frame(ph = ph, 
                         Hardness = Hardness, 
                         Solids = Solids, 
                         Chloramines = Chloramines, 
                         Sulfate = Sulfate, 
                         Conductivity = Conductivity, 
                         Organic_carbon = Organic_carbon, 
                         Trihalomethanes = Trihalomethanes, 
                         Turbidity = Turbidity,
                         Potability=NA)

svm.pred <- predict(svm.model, water_data[-10])
Potability <- as.vector(svm.pred)

#print("Prediction:")
print(Potability)
