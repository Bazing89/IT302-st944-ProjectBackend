/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

let observationsCollection;

function escapeRegularExpression(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default class ObservationsDAO {
  static async injectDB(client) {
    if (observationsCollection) return;

    observationsCollection = client
      .db(process.env.MONGODB_DB)
      .collection(process.env.MONGODB_COLLECTION);
  }

  static async getObservations({ filters = {}, pageNumber = 0, itemsPerPage = 20 } = {}) {
    if (!observationsCollection) {
      throw new Error("ObservationsDAO has not been initialized");
    }

    const query = {};

    if (filters.name) {
      const nameExpression = new RegExp(
        escapeRegularExpression(filters.name),
        "i",
      );

      query.$or = [
        { recordName: nameExpression },
        { commonName: nameExpression },
        { scientificName: nameExpression },
      ];
    }

    if (filters.qualityGrade) {
      query.qualityGrade = filters.qualityGrade;
    }

    const cursor = observationsCollection
      .find(query)
      .sort({ observedOn: -1, _id: 1 })
      .skip(pageNumber * itemsPerPage)
      .limit(itemsPerPage);

    const [observations, totalItems] = await Promise.all([
      cursor.toArray(),
      observationsCollection.countDocuments(query),
    ]);

    return { observations, totalItems };
  }
}

export { escapeRegularExpression };
