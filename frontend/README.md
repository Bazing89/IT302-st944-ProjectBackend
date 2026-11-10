# iNaturalist Observations

IT-302 Advanced Internet Applications, Section 451. Phase 4 by Sahith Thopucherla.

From this directory, run `npm ci` and `npm start`. Open
`http://localhost:3000/st944/observations` (use the port printed by the server).
The default backend is the existing Render service. To use a local backend,
set `REACT_APP_BACKEND_URL` in `.env.local` and restart the frontend.

Search by species name, open a card to fetch a record by MongoDB ID, or use the
page controls to browse the list. Login is a local display-name session.

The existing MongoDB collection was read only. Its
[JSON export](https://github.com/Bazing89/IT302-st944-ProjectBackend/tree/IT302-Phase3/database-export)
is in the backend repository.
