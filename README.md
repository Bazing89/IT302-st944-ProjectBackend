# IT-302 Phase 1 MongoDB Assignment

- Student: Sahith Thopucherla
- UCID: st944
- Email: st944@njit.edu
- Course: IT-302 Advanced Internet Applications
- Section: 451
- Assignment: Phase 1 MongoDB Assignment
- Date: September 21, 2026

## API selection

This project uses the public iNaturalist Observations API to collect 25 recent,
research-grade observations that include photos.

- API documentation: https://api.inaturalist.org/v1/docs/
- Endpoint: https://api.inaturalist.org/v1/observations?photos=true&quality_grade=research&per_page=25&order=desc&order_by=created_at

## MongoDB

- Database: `it302`
- Collection: `observations_st944`
- Export: `database-export/observations_st944.json`

Each document contains a unique observation ID and record name, species details,
location information, an image URL, the public observation URL, observer details,
and a MongoDB date value in `lastUpdated`.

## Rebuild the import file

Run `node scripts/prepare-data.mjs`. The script requests the latest 25 matching
observations and writes MongoDB Extended JSON to
`database-export/observations_st944-import.json`.
