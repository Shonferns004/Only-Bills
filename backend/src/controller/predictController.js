import { predict } from '../ml/model.js';

const predictBill = async (req, res) => {
  try {
    const { size, people, insulation, heating_cooling_systems } = req.body;

    const features = [
      parseFloat(size),
      parseFloat(people),
      parseFloat(insulation),
      parseFloat(heating_cooling_systems),
    ];

    const predicted = predict(features);
    const perRoom = predicted / 8;

    res.json({
      predicted_energy: Math.round(predicted * 100) / 100,
      predicted_energy_divided: Math.round(perRoom * 100) / 100,
    });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).json({ error: 'Prediction failed' });
  }
};

export default predictBill;
