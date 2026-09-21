import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const endpoint =
  "https://api.inaturalist.org/v1/observations?photos=true&quality_grade=research&per_page=25&order=desc&order_by=created_at";

const response = await fetch(endpoint, {
  headers: { "User-Agent": "IT302-Phase1-st944/1.0" },
});

if (!response.ok) {
  throw new Error(`iNaturalist request failed: ${response.status} ${response.statusText}`);
}

const payload = await response.json();
const records = payload.results.slice(0, 25).map((observation) => {
  const taxon = observation.taxon ?? {};
  const commonName = taxon.preferred_common_name ?? observation.species_guess ?? taxon.name ?? "Unknown taxon";
  const scientificName = taxon.name ?? "Unknown";
  const photo = observation.photos?.[0];
  const image = photo?.url?.replace("/square.", "/medium.") ?? null;
  const updatedAt = observation.updated_at ?? new Date().toISOString();

  return {
    observationId: observation.id,
    recordName: `${commonName} observation ${observation.id}`,
    commonName,
    scientificName,
    iconicTaxon: taxon.iconic_taxon_name ?? "Unknown",
    observedOn: observation.observed_on ?? observation.time_observed_at ?? null,
    placeGuess: observation.place_guess ?? "Location not provided",
    qualityGrade: observation.quality_grade,
    image,
    observationUrl: observation.uri,
    observer: observation.user?.login ?? "Unknown",
    lastUpdated: { $date: new Date(updatedAt).toISOString() },
    sourceApi: endpoint,
  };
});

if (records.length < 20) {
  throw new Error(`Expected at least 20 records but received ${records.length}`);
}

if (records.some((record) => !record.image)) {
  throw new Error("Every exported record must have an image URL");
}

if (new Set(records.map((record) => record.recordName)).size !== records.length) {
  throw new Error("recordName values must be unique");
}

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(projectRoot, "database-export", "observations_st944-import.json");
await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(records, null, 2)}\n`, "utf8");

console.log(`Wrote ${records.length} records to ${outputPath}`);
