export const FORM_LABELS = {
  age: 'Age',
  sex: 'Biological Sex',
  cp: 'Chest Pain Type',
  trestbps: 'Resting Blood Pressure',
  chol: 'Cholesterol Level',
  fbs: 'Fasting Blood Sugar',
  restecg: 'Resting ECG Results',
  thalach: 'Maximum Heart Rate',
  exang: 'Exercise Induced Angina',
  oldpeak: 'ST Depression',
  slope: 'ST Slope',
  ca: 'Number of Major Vessels',
  thal: 'Thalassemia'
} as const;

export const HELP_TEXT = {
  sex: '0 = Female, 1 = Male',
  cp: '0 = Typical angina, 1 = Atypical angina, 2 = Non-anginal pain, 3 = Asymptomatic',
  trestbps: 'mm Hg',
  chol: 'mg/dl',
  fbs: '0 = ≤ 120 mg/dl, 1 = > 120 mg/dl',
  restecg: '0 = Normal, 1 = ST-T wave abnormality, 2 = Left ventricular hypertrophy',
  exang: '0 = No, 1 = Yes',
  slope: '0 = Upsloping, 1 = Flat, 2 = Downsloping',
  ca: 'Number (0-4)',
  thal: '0 = Normal, 1 = Fixed defect, 2 = Reversible defect, 3 = Not available'
} as const;