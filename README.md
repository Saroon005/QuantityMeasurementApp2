# UC-JS-02 — App Initialisation

Application is initialised on DOMContentLoaded.

- State object is created to track current selections
- Event listeners are attached to all inputs, buttons and dropdowns
- Units are loaded for default type "Length" and dropdowns are populated
- First type card and action button are set as active
- Operator row is hidden initially
- History is fetched and rendered

Error handling:
- If unit loading fails, an alert is shown and UI continues
- If server is unavailable, an alert message is displayed