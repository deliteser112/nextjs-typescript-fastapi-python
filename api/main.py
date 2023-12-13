from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from typing import List
from uuid import uuid4

app = FastAPI()

# In-memory data store
incidents_db = []

class Incident(BaseModel):
    dateTime: str
    description: str
    severity: str

# Response Model
class IncidentResp(BaseModel):
    id: str
    dateTime: str
    description: str
    severity: str
    reporter: dict

# CORS settings to allow all origins, methods, and headers.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Secret key to sign JWT tokens
SECRET_KEY = "secret-key"
ALGORITHM = "HS256"

# Create an OAuth2PasswordBearer instance to get the token from the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Sample user data (in-memory database for demonstration purposes)
fake_users_db = {
    "created@admin.com": {
        "name": "Admin",
        "email": "created@admin.com",
        "password": "root",
    }
}

# Function to create JWT tokens
def create_jwt_token(data: dict):
    to_encode = data.copy()
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token

# Function to decode JWT tokens
def decode_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")

# Dependency to get the current user from the token
def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401, detail="Could not validate credentials"
    )
    return decode_jwt_token(token)

# Route to get a token and login
@app.post("/token")
async def login_for_access_token(form_data: dict):
    user = fake_users_db.get(form_data["email"])
    if user and form_data["password"] == user["password"]:
        token_data = {"user": {"name": user["name"], "email": user["email"]}}
        token = create_jwt_token(token_data)

        return {"access_token": token, "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

# Endpoint to report the incident by authorized user, so it's protected route
@app.post("/report-incident", response_model=IncidentResp)
async def report_incident(
    incident: Incident, current_user: dict = Depends(get_current_user)
):
    incident_id = str(uuid4())
    incident_dict = incident.dict()
    incident_dict["id"] = incident_id
    incident_dict["reporter"] = current_user["user"]
    incidents_db.append(incident_dict)
    return incident_dict

# Endpoint to get cybersecurity incidents list, and it's public router to show the list by all users.
@app.get("/list-incidents", response_model=List[IncidentResp])
async def list_incidents():
    return incidents_db

# Endpoint to delete a cybersecurity incident by ID, it can be deleted by authorized user.
@app.delete("/delete-incident/{incident_id}", response_model=IncidentResp)
def delete_incident(incident_id: str, current_user: dict = Depends(get_current_user)):
    for i, incident in enumerate(incidents_db):
        if incident["id"] == incident_id:
            deleted_incident = incidents_db.pop(i)
            return deleted_incident
    raise HTTPException(status_code=404, detail="Incident not found")
