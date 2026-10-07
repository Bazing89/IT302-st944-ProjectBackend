# IT302-st944-ProjectBackend

- **Student:** Sahith Thopucherla
- **UCID:** st944
- **Email:** st944@njit.edu
- **Course:** IT-302 Advanced Internet Applications
- **Section:** 451

## Phase 1 — MongoDB dataset

This project uses the public iNaturalist Observations API to collect 25 recent, research-grade observations that include photos.

- API documentation: https://api.inaturalist.org/v1/docs/
- Endpoint: https://api.inaturalist.org/v1/observations?photos=true&quality_grade=research&per_page=25&order=desc&order_by=created_at
- Database: `it302`
- Collection: `observations_st944`
- Export: `database-export/observations_st944.json`

Run `node scripts/prepare-data.mjs` to request the latest 25 matching observations and create the MongoDB Extended JSON import file.

## Phase 2 — Node.js backend

The MVC-style Node.js, Express, and MongoDB application is in the [`backend`](backend) folder. It reads the Phase 1 collection and provides pagination and text filtering through:

```text
GET /api/v1/st944/observations
```

Setup, environment variables, Postman URLs, and verification commands are documented in [`backend/README.md`](backend/README.md).

The real `backend/.env` file is intentionally excluded from Git because a MongoDB Atlas connection string may contain credentials. Copy `backend/.env.example` to `backend/.env` and enter the Phase 1 connection string locally.
