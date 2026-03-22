# UC-JS-05 — Save to History

Implemented saveHistory(record) in api.js.

- Sends POST request to /history endpoint
- Stores calculation record in json-server
- Returns saved object with auto-generated id

Error handling:
- If request fails, error is logged
- Function returns null and does not interrupt application flow