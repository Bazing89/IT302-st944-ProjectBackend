# IT-302 Phase 3 — Observations and Comments API

Sahith Thopucherla · st944@njit.edu · October 26, 2026
IT-302 Advanced Internet Applications, Section 451
Assignment: Phase 3 CUD MongoDB Data using Node.js

The Express backend keeps the Phase 2 observation GET endpoint and adds a separate `comments_st944` MongoDB collection. The observation router calls the comments controller, which validates request bodies and delegates persistence to a second DAO. Startup initializes both DAOs.

## Run locally

Use Node.js 20 or newer and a running MongoDB server. In `backend`:

```bash
npm ci
cp .env.example .env
# Edit .env with your MongoDB connection details.
npm run seed
npm start
```

Seeding imports the 25 Phase 1 observations and inserts one realistic comment. Repeating it preserves existing documents. Credentials belong only in `.env` or Render environment variables.

## HTTP requests

Base URL: `http://localhost:5050/api/v1/st944/observations`

| Method | Path | Behavior |
|---|---|---|
| GET | `/` | Existing observation list, pagination, and filters |
| GET | `/comments?observationId=402264585` | List an observation's comments |
| POST | `/comments` | Create a comment; return 201 and the inserted document |
| PUT | `/comments` | Update text and lastModified; return the updated document |
| DELETE | `/comments` | Delete the matching comment; return deletedCount |

POST body:

```json
{
  "observationId": 402264585,
  "text": "The Green Heron identification is supported by its compact body and long bill.",
  "userName": "Sahith Thopucherla",
  "userId": "st944"
}
```

Copy the returned `comment._id` into the PUT and DELETE `commentId` field.

PUT body:

```json
{
  "commentId": "COPY_THE_CREATED_COMMENT_ID",
  "text": "The long bill and short neck support the Green Heron identification; a clearer photograph would help confirm the plumage.",
  "userId": "st944"
}
```

DELETE body:

```json
{
  "commentId": "COPY_THE_CREATED_COMMENT_ID",
  "userId": "st944"
}
```

The server creates MongoDB Date values for `lastModified` on POST and PUT; JSON responses serialize them as ISO timestamps. Invalid bodies return 400. An unknown observation, nonexistent comment, or mismatched user ID returns 404. PUT and DELETE match both comment ID and user ID. The assignment's supplied user ID is not authenticated identity; a production app would need login and authorization.

## Validation and exports

```bash
npm run check
npm test
npm run export
postman collection run postman_collection.json --no-report-events
```

The integration test starts an isolated real MongoDB server and checks successful creation, updated text and timestamps, invalid inputs, missing observations, user ID mismatches, and deletion. The export command writes complete Extended JSON collections under `database-export` in the repository root.

Import `postman_collection.json` in the Postman desktop application. Run the requests in order: POST saves the returned comment ID into a collection variable for PUT and DELETE. Set `baseUrl` to the deployed Render endpoint when testing remotely.

## Deploy to Render

The root `render.yaml` defines a free Node web service. Connect this repository through Render Blueprints, or create a web service using root directory `backend`, build command `npm ci --omit=dev`, start command `npm start`, and health path `/health`. Render supplies `PORT`.

Set `MONGODB_URI` to a reachable hosted MongoDB connection, `MONGODB_DB=it302`, `MONGODB_COLLECTION=observations_st944`, and `MONGODB_COMMENTS_COLLECTION=comments_st944`. A local `127.0.0.1` URI cannot be used by Render. Import the provided JSON collections into that hosted database or run `npm run seed` locally with its URI in `.env`. Keep database credentials out of Git. Use the actual URL returned by Render; no deployment URL is assumed here.

## Submission checklist

After successful deployment, run POST, PUT, and DELETE from the Postman app against the Render URL. Each screenshot must show the method, full URL including `st944`, request body, and successful response. POST and PUT must show `lastModified`. ZIP these screenshots for attachment to the Canvas text entry, along with the final GitHub tag URL and actual Render URL. Update the JSON export from the hosted database after testing, then commit and tag the final phase.

## Render service

The free service is live at `https://st944-it302-observations-backend.onrender.com` and uses MongoDB Atlas. The deployed health endpoint and all seven Postman collection requests passed on October 26, 2026. The Postman desktop screenshots show successful POST, PUT, and DELETE requests against this service. Import `postman_render_environment.json` alongside the collection and select that environment to test the deployment.

For local Atlas administration, `.env.atlas` is excluded from Git. Once it contains the real connection URI, run `DOTENV_CONFIG_PATH=.env.atlas npm run seed` and `DOTENV_CONFIG_PATH=.env.atlas npm run export` in `backend`.
