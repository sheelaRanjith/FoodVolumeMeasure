from datetime import datetime
from pymongo import MongoClient
from bson import ObjectId

from config import MONGO_URI, DB_NAME, COLLECTION_NAME


class MongoService:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.collection = self.client[DB_NAME][COLLECTION_NAME]

    def save_result(self, payload):
        payload['created_at'] = datetime.utcnow()
        result = self.collection.insert_one(payload)
        return str(result.inserted_id)

    def fetch_history(self, limit=100):
        docs = list(self.collection.find().sort('created_at', -1).limit(limit))
        for doc in docs:
            doc['_id'] = str(doc.get('_id', ObjectId()))
        return docs
