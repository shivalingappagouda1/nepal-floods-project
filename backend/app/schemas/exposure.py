"""Schemas for Exposure, Critical Infrastructure, and Tactical KPIs."""

from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMeta, SeverityLevel, DataTier


class ExposureLayerInfo(BaseModel):
    id: str
    label: str
    category: str  # IMAGERY, HAZARD, INFRASTRUCTURE, DEMOGRAPHICS
    enabled: bool = True
    opacity: float = 1.0
    badge: DataTier
    description: str
    isDemo: bool = True
    provenance: ProvenanceMeta


class KPICardData(BaseModel):
    id: str
    label: str
    value: str
    unit: Optional[str] = None
    statusLabel: Optional[str] = None
    trend: Optional[str] = None
    severity: SeverityLevel
    provenance: ProvenanceMeta
