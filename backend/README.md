# IT-302 Phase 2 — iNaturalist Observations API

- **Student:** Sahith Thopucherla
- **UCID:** st944
- **Email:** st944@njit.edu
- **Course:** IT-302, Section 451
- **Assignment:** Phase 2 — Read MongoDB Data using Node.js
**Date:** October 6, 2026

This MVC-style Node.js backend reads the iNaturalist observation documents imported into MongoDB during Phase 1.

## Project structure

```text
backend/
├── api/
│   ├── observations.controller.js
│   └── observations.route.js
├── dao/
│   └── observationsDAO.js
├── test/
│   └── helpers.test.js
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package.json
├── postman_collection.json
└── server.js
```

## Setup

1. Open a terminal in the `backend` folder.
2. Run `npm install`.
3. Edit `.env` so `MONGODB_URI`, `MONGODB_DB`, and `MONGODB_COLLECTION` match the Phase 1 database.
4. Run `npm start`.
5. The API will run at `http://localhost:5000/api/v1/st944/observations`.

Keep the real `.env` out of GitHub because an Atlas URI can contain a username and password. The safe `.env.example` file documents the required variables.

## GET parameters

| Parameter | Description | Example |
|---|---|---|
| `itemsPerPage` | Results per page, from 1 to 100 | `10` |
| `pageNumber` | Zero-based page number | `0` |
| `name` | Case-insensitive record/common/scientific-name text filter | `owl` |
| `speciesName` | Alias for `name` | `owl` |
| `qualityGrade` | Optional exact quality-grade filter | `research` |

## Postman test URLs

All data:

```text
http://localhost:5000/api/v1/st944/observations
```

Pagination:

```text
http://localhost:5000/api/v1/st944/observations?itemsPerPage=10&pageNumber=1
```

Species-name filter:

```text
http://localhost:5000/api/v1/st944/observations?name=owl
```

All filters together:

```text
http://localhost:5000/api/v1/st944/observations?itemsPerPage=10&pageNumber=0&name=bird&qualityGrade=research
```

Import `postman_collection.json` into Postman to run all four requests. Capture each result with the complete URL visible, then place the screenshots in a separate ZIP for Canvas.

## Verification

```bash
npm run check
npm test
```

After testing, commit the project and create the requested Git tag, for example `IT302-Phase2`.
