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
`pip install torch transformers fastapi uvicorn sentencepiece accelerate`

### Frontend libraries
`npm install @mui/material @emotion/react @emotion/styled axios`



