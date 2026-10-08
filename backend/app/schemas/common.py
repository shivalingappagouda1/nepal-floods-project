"""Common shared schemas across disaster intelligence modules."""

from typing import Optional, Any, Generic, TypeVar, List
from enum import Enum
from pydantic import BaseModel, Field

T = TypeVar("T")


class DataTier(str, Enum):
    VERIFIED = "VERIFIED"
    AI_COMPUTED = "AI_COMPUTED"
    DEMO_VALUE = "DEMO_VALUE"
    AWAITING_PASS = "AWAITING_PASS"


class SeverityLevel(str, Enum):
    CRITICAL = "CRITICAL"
    SEVERE = "SEVERE"
    HIGH = "HIGH"
    MODERATE = "MODERATE"
    LOW = "LOW"
    INFORMATIONAL = "INFORMATIONAL"


class ProvenanceMeta(BaseModel):
    tier: DataTier = Field(default=DataTier.DEMO_VALUE, description="Data provenance tier")
    source: str = Field(description="Authoritative source or precomputed model reference")
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp of observation or computation")
    algorithm: Optional[str] = Field(default=None, description="Analytical algorithm or method")
    sensor: Optional[str] = Field(default=None, description="Satellite sensor or data instrument")
    confidence: Optional[float] = Field(default=None, description="Calibrated numerical confidence (omitted if unverified)")
    isDemoValue: bool = Field(default=True, description="Explicit flag indicating whether this is prototype/demo data")


class BaseResponse(BaseModel, Generic[T]):
    success: bool = True
    message: Optional[str] = None
    data: T
    provenance: Optional[ProvenanceMeta] = None


class GeoJsonFeature(BaseModel):
    type: str = "Feature"
    properties: dict
    geometry: dict


class GeoJsonFeatureCollection(BaseModel):
    type: str = "FeatureCollection"
    features: List[GeoJsonFeature]
    metadata: Optional[dict] = None
