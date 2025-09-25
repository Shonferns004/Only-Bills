from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib

app = Flask(__name__)
CORS(app)

# Load the pre-trained model
model = joblib.load('elec.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    size = int(data['size'])
    people = int(data['people'])
    insulation = int(data['insulation'])
    heating = int(data['heating_cooling_systems'])

    new_building = np.array([[size, people, insulation, heating]])
    predicted_energy = model.predict(new_building)[0]
    predicted_energy_divided = predicted_energy / 8

    return jsonify({
        'predicted_energy': round(predicted_energy, 2),
        'predicted_energy_divided': round(predicted_energy_divided, 2)
    })

if __name__ == '__main__':
    app.run(debug=True, port=3000)
