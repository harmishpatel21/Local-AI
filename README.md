# Run AI on local machine


## Frontend setup
`npx create-next-app@latest frontend`

## Backend setup
```
mkdir backend
cd backend
python -m venv venv
venv\Script\activate   // For Windows
```

```
mkdir models
cd models
git clone https://github.com/mistralai/mistral-src.git
cd mistral-src
pip install -e .
```

### Backend libraries
`pip install torch transformers fastapi uvicorn sentencepiece accelerate python-dotenv requests`

### Start a backend
`python -m uvicorn app:app --reload --port 8000`
`python app.py`

### Frontend libraries
`npm install @mui/material @emotion/react @emotion/styled axios`
`npm install @`

### Frontend start
`npm start`
`npm run dev`


