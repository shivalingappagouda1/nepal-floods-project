"""Service for Damage Assessment (GIS & Image Evidence)."""

from typing import List, Optional, Dict
from app.schemas.damage import (
    DamageCategory,
    DamageCategoryConfig,
    DamageFeature,
    DamageAssessmentSummary
)
from app.data import DAMAGE_CONFIGS, PRECOMPUTED_DAMAGE_FEATURES
from app.schemas.common import ProvenanceMeta, DataTier
from app.core.errors import ResourceNotFoundException


class DamageService:
    def __init__(self):
        self.configs: List[DamageCategoryConfig] = DAMAGE_CONFIGS
        self.features: List[DamageFeature] = PRECOMPUTED_DAMAGE_FEATURES

    async def get_categories(self) -> List[DamageCategoryConfig]:
        return self.configs

    async def get_features(self, category: Optional[DamageCategory] = None) -> List[DamageFeature]:
        if category:
            return [f for f in self.features if f.category == category]
        return self.features

    async def get_feature_by_id(self, feature_id: str) -> DamageFeature:
        for f in self.features:
            if f.id.lower() == feature_id.lower() or f.featureCode.lower() == feature_id.lower():
                return f
        raise ResourceNotFoundException("DamageFeature", feature_id)

    async def get_summary(self) -> DamageAssessmentSummary:
        counts: Dict[DamageCategory, int] = {cat: 0 for cat in DamageCategory}
        for f in self.features:
            counts[f.category] = counts.get(f.category, 0) + 1

        return DamageAssessmentSummary(
            totalFeaturesEvaluated=len(self.features),
            featuresByCategory=counts,
            precomputedFootprintSqKm=4.82,
            disclaimer="Image/GIS evidence categories describe observable spectral and radar changes only. Not certified structural engineering assessments.",
            confidenceStatus="CONFIDENCE: Not available across all synthetic/prototype features",
            provenance=ProvenanceMeta(
                tier=DataTier.DEMO_VALUE,
                source="HIMALAYA-SHIELD Damage Assessment Module (Precomputed Step 5 Evaluation)",
                algorithm="Multi-Sensor Geospatial Change Categorization",
                isDemoValue=True
            )
        )


damage_service = DamageService()
