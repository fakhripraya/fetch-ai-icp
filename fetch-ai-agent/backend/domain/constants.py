import os
from dotenv import load_dotenv


load_dotenv()


ASI1_API_KEY = os.getenv("ASI1_API_KEY")
ASI1_BASE_URL = os.getenv("ASI1_BASE_URL")

ASI1_HEADERS = {
    "Authorization": f"Bearer {ASI1_API_KEY}",
    "Content-Type": "application/json"
}



CANISTER_ID = os.getenv("CANISTER_ID")
BASE_URL = os.getenv("BASE_URL")
CANISTER_URI = os.getenv("CANISTER_URI")

HEADERS = {
    "Host": f"{CANISTER_ID}.localhost",
    "Content-Type": "application/json"
}