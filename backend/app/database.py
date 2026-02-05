"""In-memory database for HR Management System."""
import json
import os
from datetime import datetime
from bson import ObjectId

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data.json")

# In-memory storage
_data = {
    "jobs": [],
    "candidates": []
}


def _load_data():
    """Load data from JSON file if exists."""
    global _data
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                _data = json.load(f)
        except:
            pass


def _save_data():
    """Save data to JSON file."""
    with open(DATA_FILE, 'w') as f:
        json.dump(_data, f, indent=2, default=str)


class AsyncCursor:
    """Async cursor for iterating over results."""
    def __init__(self, data):
        self._data = data
        self._sort_key = None
        self._sort_order = 1
    
    def sort(self, key, order=1):
        self._sort_key = key
        self._sort_order = order
        return self
    
    def __aiter__(self):
        data = self._data.copy()
        if self._sort_key:
            data.sort(key=lambda x: x.get(self._sort_key, ""), reverse=(self._sort_order == -1))
        self._iter_data = iter(data)
        return self
    
    async def __anext__(self):
        try:
            return next(self._iter_data)
        except StopIteration:
            raise StopAsyncIteration


class InsertResult:
    def __init__(self, inserted_id):
        self.inserted_id = inserted_id


class UpdateResult:
    def __init__(self, modified_count):
        self.modified_count = modified_count


class Collection:
    """Simulated MongoDB collection."""
    def __init__(self, name):
        self.name = name
    
    async def insert_one(self, document):
        doc = document.copy()
        doc["_id"] = ObjectId()
        _data[self.name].append(doc)
        _save_data()
        return InsertResult(doc["_id"])
    
    async def find_one(self, query):
        for doc in _data[self.name]:
            if self._matches(doc, query):
                return doc
        return None
    
    def find(self, query=None):
        if query is None:
            return AsyncCursor(_data[self.name])
        results = [doc for doc in _data[self.name] if self._matches(doc, query)]
        return AsyncCursor(results)
    
    async def update_one(self, query, update):
        for doc in _data[self.name]:
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(update["$set"])
                _save_data()
                return UpdateResult(1)
        return UpdateResult(0)
    
    async def delete_one(self, query):
        for i, doc in enumerate(_data[self.name]):
            if self._matches(doc, query):
                _data[self.name].pop(i)
                _save_data()
                return UpdateResult(1)
        return UpdateResult(0)
    
    def _matches(self, doc, query):
        for key, value in query.items():
            if key == "_id":
                if isinstance(value, ObjectId):
                    if str(doc.get("_id")) != str(value):
                        return False
                else:
                    if str(doc.get("_id")) != str(value):
                        return False
            elif doc.get(key) != value:
                return False
        return True


class Database:
    """Simulated MongoDB database."""
    def __init__(self):
        self.jobs = Collection("jobs")
        self.candidates = Collection("candidates")


db = Database()


async def connect_to_mongo():
    """Initialize in-memory database."""
    _load_data()
    print("Connected to In-Memory Database (JSON file storage)")


async def close_mongo_connection():
    """Save data on shutdown."""
    _save_data()
    print("Data saved to file")


def get_database():
    """Get database instance."""
    return db
