"""Service for Explainable Geospatial Risk Analysis Engine."""

from typing import List, Optional, Dict
from app.schemas.risk import (
    RiskZoneResult,
    RiskEngineWeights,
    RiskCalculationRequest,
    RiskFactorAssessment,
    RiskFactorLevel
)
from app.data import PRECOMPUTED_RISK_ZONES
from app.schemas.common import SeverityLevel, ProvenanceMeta, DataTier
from app.core.errors import ResourceNotFoundException


class RiskService:
    def __init__(self):
        self.zones: List[RiskZoneResult] = PRECOMPUTED_RISK_ZONES
        self.default_weights = RiskEngineWeights()

    async def get_zones(self) -> List[RiskZoneResult]:
        return self.zones

    async def get_zone_by_id(self, zone_id: str) -> RiskZoneResult:
        for z in self.zones:
            if z.id.lower() == zone_id.lower():
                return z
        raise ResourceNotFoundException("RiskZone", zone_id)

    async def get_weights(self) -> RiskEngineWeights:
        return self.default_weights

    async def calculate_risk(self, request: RiskCalculationRequest) -> RiskZoneResult:
        base_zone = self.zones[0]
        if request.zoneId:
            base_zone = await self.get_zone_by_id(request.zoneId)

        weights = request.customWeights or self.default_weights
        raw_weights: Dict[str, float] = {
            "slope": weights.slopeWeight,
            "elevation": weights.elevationWeight if hasattr(weights, "elevationWeight") else 0.15,
            "rainfall": weights.rainfallWeight,
            "geology": weights.geologyWeight,
            "satelliteChange": weights.satelliteChangeWeight,
            "exposure": weights.exposureWeight,
            "historicalRisk": weights.historicalRiskWeight,
        }

        # Check active factors and renormalize
        updated_factors: Dict[str, RiskFactorAssessment] = {}
        active_sum = 0.0

        for key, factor in base_zone.factors.items():
            val = factor.normalizedValue
            if request.factorOverrides and key in request.factorOverrides:
                val = request.factorOverrides[key]
            
            w = raw_weights.get(key, 0.15)
            if val is not None:
                active_sum += w

        total_score = 0.0
        active_count = 0

        for key, factor in base_zone.factors.items():
            val = factor.normalizedValue
            if request.factorOverrides and key in request.factorOverrides:
                val = request.factorOverrides[key]

            w = raw_weights.get(key, 0.15)
            eff_w = (w / active_sum) if (active_sum > 0 and val is not None) else 0.0
            contrib = (val * eff_w * 100.0) if (val is not None) else 0.0

            if val is not None:
                total_score += contrib
                active_count += 1

            updated_factors[key] = RiskFactorAssessment(
                key=factor.key,
                label=factor.label,
                level=factor.level,
                normalizedValue=val,
                configuredWeight=w,
                effectiveWeight=round(eff_w, 4),
                weightedContribution=round(contrib, 2),
                statusDisplay=factor.statusDisplay,
                description=factor.description,
                provenanceTier=factor.provenanceTier
            )

        calc_score = round(total_score, 1)
        if calc_score >= 80:
            sev = SeverityLevel.CRITICAL
        elif calc_score >= 65:
            sev = SeverityLevel.SEVERE
        elif calc_score >= 50:
            sev = SeverityLevel.HIGH
        elif calc_score >= 35:
            sev = SeverityLevel.MODERATE
        else:
            sev = SeverityLevel.LOW

        completeness = round((active_count / len(base_zone.factors)) * 100.0, 1)

        return RiskZoneResult(
            id=base_zone.id,
            name=base_zone.name,
            coordinates=base_zone.coordinates,
            prototypeScoreLabel="Prototype risk score",
            overallRisk=sev,
            calculatedScore=calc_score,
            dataCompletenessPercent=completeness,
            activeFactorsCount=active_count,
            factors=updated_factors,
            operationalRecommendation=base_zone.operationalRecommendation,
            disclaimer="Advisory directive for Incident Commander & Emergency Operations Center review (Does not issue autonomous evacuation orders).",
            provenance=ProvenanceMeta(
                tier=DataTier.DEMO_VALUE,
                source="HIMALAYA-SHIELD Prototype Risk Engine (Dynamic Custom Weights Run)",
                algorithm="Transparent Multi-Criteria Geospatial Weighted Sum",
                isDemoValue=True
            )
        )


risk_service = RiskService()
