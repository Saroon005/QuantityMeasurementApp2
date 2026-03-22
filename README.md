# UC-JS-03 — Fetch Units by Type

Implemented getUnits(type) in api.js.

- Fetches units from json-server using query parameter ?type=
- Returns array of unit objects for the selected type
- Checks response status before parsing JSON

Error handling:
- If request fails, logs error and returns empty array