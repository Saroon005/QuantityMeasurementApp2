# UC-JS-06 — Load History

Implemented getHistory() in api.js.

- Fetches all history records from json-server
- Uses query parameters to sort by timestamp in descending order
- Returns array of records

Error handling:
- If request fails, logs error and returns empty array
- UI displays "No history yet" when array is empty