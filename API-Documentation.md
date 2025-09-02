# 📌 Clubs Connect API

A simple REST API for accessing **upcoming events** from the Clubs Connect project.  
Deployed on **Render** and powered by **Supabase**.

---

## 🔗 Base URL
https://clubs-connect-api.onrender.com

---

## ✅ Health Check

### `GET /`
- **Description**: Confirms that the server is running.
- **Response Example**:
```json

{
  "message": "Server is running!",
  "timestamp": "2025-09-02T22:30:15.123Z"
}
```

---

## 📅 Events API

### `GET /api/events`

- **Description**: Fetch all upcoming events (only events with a future date).  
- **Method**: `GET`  
- **Authentication**: None required (public).  

---

#### ✅ Success Response
```json
[
  {
    "id": 1,
    "title": "Tech Meetup",
    "date": "2025-09-15T18:00:00Z",
    "location": "Cape Town",
    "description": "Networking and tech talks"
  },
  {
    "id": 2,
    "title": "AI Workshop",
    "date": "2025-09-20T10:00:00Z",
    "location": "Johannesburg",
    "description": "Hands-on session on AI tools"
  }
]
```


### ❌ Error Response

{ "error": "Failed to fetch events" }

### 🛠️ Usage Examples
JavaScript (React / Browser)

fetch("https://clubs-connect-api.onrender.com/api/events")
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));


Python

import requests

res = requests.get("https://clubs-connect-api.onrender.com/api/events")
print(res.json())


cURL

curl https://clubs-connect-api.onrender.com/api/events


### ⚠️ Notes

✅ API is read-only for now (GET only).

✅ Data comes from the events table in Supabase.

❌ Do not use Supabase service keys directly — always go through this API.

🔄 API auto-updates when new events are added to Supabase.

### 🚀 Future Endpoints (Planned)

These endpoints may be added later:

POST /api/events → Add new event

GET /api/events/:id → Get event by ID

PUT /api/events/:id → Update event

DELETE /api/events/:id → Remove event

