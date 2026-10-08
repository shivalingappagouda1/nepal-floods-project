import type { FeatureCollection, Point } from 'geojson';
import { NEPAL_CHINA_BORDER_DISASTER_2026 } from './nepalChinaBorderDisaster2026';
import type { GeoFeatureProperties } from '../demoGeoData';

export const verifiedCaseStudyWaypointsGeoJson: FeatureCollection<Point, GeoFeatureProperties> = {
  type: 'FeatureCollection',
  features: NEPAL_CHINA_BORDER_DISASTER_2026.verifiedWaypoints.map((wp) => ({
    type: 'Feature',
    properties: {
      id: wp.id,
      name: wp.name,
      type: 'VERIFIED_CASE_STUDY_WAYPOINT',
      severity: 'HIGH',
      category: 'CASE_STUDY',
      status: 'VERIFIED_AUTHORITATIVE_LOCATION',
      description: `${wp.significance} (Elev: ${wp.elevationMeters}m). Official source: ${wp.authoritySource}`,
      isDemo: true, // Tagged in prototype phase with verified geographic baseline
      provenance: {
        source: wp.authoritySource,
        timestamp: '2026-08-26T18:30:00Z',
        tier: 'VERIFIED',
        confidence: 1.0,
      },
    },
    geometry: {
      type: 'Point',
      coordinates: wp.coordinates,
    },
  })),
};
