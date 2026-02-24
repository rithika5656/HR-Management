"""MongoDB database connection for HR Management System with JSON fallback."""
import json
import os
from datetime import datetime
from bson import ObjectId
from app.config import MONGODB_URL, DATABASE_NAME

# Global database instance
db = None
_using_mongodb = False

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data.json")


# ============== JSON Fallback Implementation ==============

class InMemoryData:
    """In-memory storage with JSON file persistence."""
    _data = {"jobs": [], "candidates": []}
    
    @classmethod
    def load(cls):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r') as f:
                    cls._data = json.load(f)
                    # Convert string _id back to proper format
                    for collection in ["jobs", "candidates"]:
                        for doc in cls._data.get(collection, []):
                            if "_id" in doc and isinstance(doc["_id"], str):
                                pass  # Keep as string for JSON storage
            except:
                pass
    
    @classmethod
    def save(cls):
        with open(DATA_FILE, 'w') as f:
            json.dump(cls._data, f, indent=2, default=str)
    
    @classmethod
    def get_collection(cls, name):
        return cls._data.get(name, [])


class AsyncCursor:
    """Async cursor for JSON storage."""
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
            # Convert values to string for consistent sorting (handles datetime vs string)
            data.sort(key=lambda x: str(x.get(self._sort_key, "")), reverse=(self._sort_order == -1))
        self._iter_data = iter(data)
        return self
    
    async def __anext__(self):
        try:
            return next(self._iter_data)
        except StopIteration:
            raise StopAsyncIteration


class JSONCollection:
    """JSON-based collection mimicking MongoDB operations."""
    def __init__(self, name):
        self.name = name
    
    async def insert_one(self, document):
        doc = document.copy()
        doc["_id"] = str(ObjectId())
        InMemoryData._data[self.name].append(doc)
        InMemoryData.save()
        
        class InsertResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return InsertResult(doc["_id"])
    
    async def find_one(self, query):
        for doc in InMemoryData._data[self.name]:
            if self._matches(doc, query):
                return doc
        return None
    
    def find(self, query=None):
        if query is None:
            return AsyncCursor(InMemoryData._data[self.name])
        results = [doc for doc in InMemoryData._data[self.name] if self._matches(doc, query)]
        return AsyncCursor(results)
    
    async def update_one(self, query, update):
        class UpdateResult:
            def __init__(self, modified_count):
                self.modified_count = modified_count
        
        for doc in InMemoryData._data[self.name]:
            if self._matches(doc, query):
                if "$set" in update:
                    doc.update(update["$set"])
                InMemoryData.save()
                return UpdateResult(1)
        return UpdateResult(0)
    
    async def delete_one(self, query):
        class DeleteResult:
            def __init__(self, deleted_count):
                self.deleted_count = deleted_count
        
        for i, doc in enumerate(InMemoryData._data[self.name]):
            if self._matches(doc, query):
                InMemoryData._data[self.name].pop(i)
                InMemoryData.save()
                return DeleteResult(1)
        return DeleteResult(0)
    
    async def count_documents(self, query):
        if not query:
            return len(InMemoryData._data[self.name])
        return sum(1 for doc in InMemoryData._data[self.name] if self._matches(doc, query))
    
    async def create_index(self, key):
        pass  # No-op for JSON storage
    
    def _matches(self, doc, query):
        for key, value in query.items():
            if key == "_id":
                if str(doc.get("_id")) != str(value):
                    return False
            elif doc.get(key) != value:
                return False
        return True


class JSONDatabase:
    """JSON-based database mimicking MongoDB."""
    def __init__(self):
        self.jobs = JSONCollection("jobs")
        self.candidates = JSONCollection("candidates")


# ============== MongoDB Implementation ==============

async def connect_to_mongo():
    """Connect to MongoDB or fall back to JSON storage."""
    global db, _using_mongodb
    
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        
        print(f"📡 Connecting to MongoDB Atlas...")
        client = AsyncIOMotorClient(
            MONGODB_URL, 
            serverSelectionTimeoutMS=15000,  # 15 seconds for cloud
            connectTimeoutMS=15000,
        )
        
        # Test connection
        await client.admin.command('ping')
        db = client[DATABASE_NAME]
        _using_mongodb = True
        
        # Create indexes
        await db.jobs.create_index("status")
        await db.jobs.create_index("created_at")
        await db.candidates.create_index("job_id")
        await db.candidates.create_index("email")
        await db.candidates.create_index("status")
        
        print(f"✓ Connected to MongoDB Atlas: {DATABASE_NAME}")
        print("✓ Database indexes created")
        
    except Exception as e:
        print(f"\n⚠️  MongoDB not available: {e}")
        print("📁 Using JSON file storage as fallback (data.json)")
        print("   To use MongoDB Atlas, check your connection string.\n")
        
        InMemoryData.load()
        db = JSONDatabase()
        _using_mongodb = False


async def close_mongo_connection():
    """Close database connection."""
    global db
    
    if _using_mongodb and db:
        db.client.close()
        print("✓ MongoDB connection closed")
    else:
        InMemoryData.save()
        print("✓ Data saved to JSON file")


def get_database():
    """Get database instance."""
    if db is None:
        raise RuntimeError("Database not connected.")
    return db


def is_using_mongodb():
    """Check if using MongoDB or JSON fallback."""
    return _using_mongodb
