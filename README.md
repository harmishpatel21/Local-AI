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

### Install Ollama
`https://ollama.com/`
once installed, open terminal: `ollama pull deepseek-r1:8b`

### Backend libraries
`pip install langchain-community ollama`

### Start a backend
`python -m uvicorn app:app --reload --port 8000`
`python app.py`

### Frontend libraries
`npm install @mui/material @emotion/react @emotion/styled`
`npm install react-markdown remark-gfm rehype-highlight highlight.js`

### Frontend start
`npm start`
`npm run dev`


