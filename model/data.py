# train_model.py
import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

df = pd.read_csv('./my_data.csv')
X = df[['NoOfRooms', 'Occupancy', 'HeavyAppliances', 'HeatingCoolingSystems']]
y = df['ElectricityBill']

model = LinearRegression()
model.fit(X, y)

# Save the trained model
joblib.dump(model, 'elec.pkl')
