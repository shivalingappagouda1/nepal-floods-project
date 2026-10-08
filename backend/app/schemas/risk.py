"""Schemas for Geospatial Risk Analysis Module."""

from typing import List, Optional, Tuple, Dict
from enum import Enum
from pydantic import BaseModel, Field, field_validator
from app.schemas.common import ProvenanceMeta, SeverityLevel


class RiskFactorLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"
    DATA_UNAVAILABLE = "DATA_UNAVAILABLE"


class RiskFactorAssessment(BaseModel):
    key: str
    label: str
    level: RiskFactorLevel
    normalizedValue: Optional[float] = Field(default=None, ge=0.0, le=1.0)
    configuredWeight: float
    effectiveWeight: float
    weightedContribution: float
    statusDisplay: str
    description: str
    provenanceTier: str = "DEMO_VALUE"


class RiskEngineWeights(BaseModel):
    slopeWeight: float = Field(default=0.20, ge=0.0, le=1.0)
    rainfallWeight: float = Field(default=0.20, ge=0.0, le=1.0)
    satelliteChangeWeight: float = Field(default=0.25, ge=0.0, le=1.0)
    geologyWeight: float = Field(default=0.15, ge=0.0, le=1.0)
    exposureWeight: float = Field(default=0.10, ge=0.0, le=1.0)
    historicalRiskWeight: float = Field(default=0.10, ge=0.0, le=1.0)

    @field_validator("*")
    @classmethod
    def check_non_negative(cls, v: float) -> float:
        if v < 0.0:
            raise ValueError("Weight cannot be negative.")
        return v


class RiskCalculationRequest(BaseModel):
    zoneId: Optional[str] = None
    customWeights: Optional[RiskEngineWeights] = None
    factorOverrides: Optional[Dict[str, float]] = None


class RiskZoneResult(BaseModel):
    id: str
    name: str
    coordinates: Tuple[float, float]
    prototypeScoreLabel: str = "Prototype risk score"
    overallRisk: SeverityLevel
    calculatedScore: float = Field(ge=0.0, le=100.0)
    dataCompletenessPercent: float
    activeFactorsCount: int
    factors: Dict[str, RiskFactorAssessment]
    operationalRecommendation: str
    disclaimer: str = "Advisory directive for Incident Commander & Emergency Operations Center review (Does not issue autonomous evacuation orders)."
    provenance: ProvenanceMeta
