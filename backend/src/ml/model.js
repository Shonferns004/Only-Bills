import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseCSV(text) {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',');
    const row = {};
    headers.forEach((h, i) => { row[h.trim()] = parseFloat(vals[i]); });
    return row;
  });
  return rows;
}

function transpose(m) {
  return m[0].map((_, i) => m.map(r => r[i]));
}

function multiply(A, B) {
  const rows = A.length, cols = B[0].length, inner = B.length;
  const result = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++)
      for (let k = 0; k < inner; k++)
        result[i][j] += A[i][k] * B[k][j];
  return result;
}

function inverse(m) {
  const n = m.length;
  const aug = m.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);

  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++)
      if (Math.abs(aug[row][col]) > Math.abs(aug[maxRow][col])) maxRow = row;
    [aug[col], aug[maxRow]] = [aug[maxRow], aug[col]];

    const pivot = aug[col][col];
    for (let j = 0; j < 2 * n; j++) aug[col][j] /= pivot;

    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = aug[row][col];
      for (let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
    }
  }

  return aug.map(row => row.slice(n));
}

let coefficients = null;

export function train() {
  const csvPath = join(__dirname, 'data.csv');
  const text = readFileSync(csvPath, 'utf-8');
  const data = parseCSV(text);

  const features = ['NoOfRooms', 'Occupancy', 'HeavyAppliances', 'HeatingCoolingSystems'];
  const X = data.map(row => [1, ...features.map(f => row[f])]);
  const y = data.map(row => [row.ElectricityBill]);

  const XT = transpose(X);
  const XTX = multiply(XT, X);
  const XTX_inv = inverse(XTX);
  const XTy = multiply(XT, y);
  coefficients = multiply(XTX_inv, XTy).flat();

  console.log('Model trained with', data.length, 'samples');
}

export function predict(features) {
  if (!coefficients) throw new Error('Model not trained');
  const [bias, ...weights] = coefficients;
  return bias + features.reduce((sum, val, i) => sum + val * weights[i], 0);
}
