/**
 * Author: Sahith Thopucherla (st944@njit.edu)
 * Date: October 6, 2026
 * Course: IT-302, Section 451
 * Assignment: Phase 2 - Read MongoDB Data using Node.js
 */

import ObservationsDAO from "../dao/observationsDAO.js";

const DEFAULT_ITEMS_PER_PAGE = 20;
const MAX_ITEMS_PER_PAGE = 100;

function parseNonNegativeInteger(value, fallback) {
  if (value === undefined) return fallback;

  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : fallback;
}

export default class ObservationsController {
  static async apiGetObservations(request, response, next) {
    try {
      const requestedItemsPerPage = parseNonNegativeInteger(
        request.query.itemsPerPage,
        DEFAULT_ITEMS_PER_PAGE,
      );
      const itemsPerPage = Math.min(
        Math.max(requestedItemsPerPage, 1),
        MAX_ITEMS_PER_PAGE,
      );
      const pageNumber = parseNonNegativeInteger(request.query.pageNumber, 0);

      const filters = {};
      const requestedName = request.query.name ?? request.query.speciesName;
      if (typeof requestedName === "string") {
        const name = requestedName.trim();
        if (name) filters.name = name;
      }

      if (typeof request.query.qualityGrade === "string") {
        const qualityGrade = request.query.qualityGrade.trim();
        if (qualityGrade) filters.qualityGrade = qualityGrade;
      }

      const { observations, totalItems } = await ObservationsDAO.getObservations({
        filters,
        pageNumber,
        itemsPerPage,
      });

      response.json({
        observations,
        pageNumber,
        itemsPerPage,
        totalItems,
        totalPages: Math.ceil(totalItems / itemsPerPage),
        filters,
      });
    } catch (error) {
      next(error);
    }
  }
}

export { parseNonNegativeInteger };
