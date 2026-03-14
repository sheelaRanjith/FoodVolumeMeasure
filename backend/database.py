from datetime import datetime
from pymongo import MongoClient
from config import MONGO_URI, DB_NAME, COLLECTION_NAME


class MongoService:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.collection = self.client[DB_NAME][COLLECTION_NAME]

    @staticmethod
    def _serialize_doc(doc):
        serialized = dict(doc)
        serialized['_id'] = str(serialized.get('_id', ''))
        created_at = serialized.get('created_at')
        if isinstance(created_at, datetime):
            serialized['created_at'] = created_at.isoformat() + 'Z'
        return serialized

    def save_result(self, payload):
        # Avoid mutating API response payload with ObjectId/created_at non-JSON types.
        document = dict(payload)
        document['created_at'] = datetime.utcnow()
        result = self.collection.insert_one(document)
        return str(result.inserted_id)

    def fetch_history(self, limit=100):
        docs = list(self.collection.find().sort('created_at', -1).limit(limit))
        return [self._serialize_doc(doc) for doc in docs]
