# UC-JS-04 — Fetch Conversion Record

Implemented getConversion(from, to) in api.js.

- Fetches conversion data using query parameters from and to
- json-server returns an array, first element is used
- Returns a single conversion object containing factor or formula

Error handling:
- If no conversion exists, throws "No conversion found"
- Errors are propagated to caller for UI handling