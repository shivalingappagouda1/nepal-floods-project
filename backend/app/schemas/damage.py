"""Schemas for Damage Assessment Module (GIS/Image Evidence)."""

from typing import List, Optional, Tuple, Dict
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMeta, SeverityLevel


class DamageCategory(str, Enum):
    NO_SIGNIFICANT_CHANGE = "NO_SIGNIFICANT_CHANGE"
    POSSIBLE_DAMAGE = "POSSIBLE_DAMAGE"
    MODERATE_DAMAGE = "MODERATE_DAMAGE"
    SEVERE_DAMAGE = "SEVERE_DAMAGE"
    DESTROYED_INACCESSIBLE = "DESTROYED_INACCESSIBLE"


class DamageCategoryConfig(BaseModel):
    category: DamageCategory
    label: str
    color: str
    description: str
    evidenceCharacteristics: List[str]


class DamageFeature(BaseModel):
    id: str
    featureCode: str
    category: DamageCategory
    categoryLabel: str
    evidenceSource: str  # e.g., "Sentinel-2 Multi-Spectral Delta (Synthetic/Precomputed)"
    timestamp: str
    verificationStatus: str  # e.g., "Human verification required"
    confidenceDisplay: str = Field(default="CONFIDENCE: Not available")
    coordinates: Tuple[float, float] = Field(description="[longitude, latitude]")
    locationName: str
    observedChangeSummary: str
    isPrecomputed: bool = True
    provenance: ProvenanceMeta


class DamageAssessmentSummary(BaseModel):
    totalFeaturesEvaluated: int
    featuresByCategory: Dict[DamageCategory, int]
    precomputedFootprintSqKm: float
    disclaimer: str = Field(
        default="Image/GIS evidence categories describe observable spectral and radar changes only. Not certified structural engineering assessments."
    )
    confidenceStatus: str = Field(default="CONFIDENCE: Not available across all synthetic/prototype features")
    provenance: ProvenanceMeta
