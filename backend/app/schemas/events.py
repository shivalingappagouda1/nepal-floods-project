"""Schemas for Disaster Events and Transboundary Case Studies."""

from typing import List, Optional, Tuple
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMeta


class AuthoritativeSourceRef(BaseModel):
    id: str
    name: str
    authority: str
    url: str
    evidenceScope: str
    accessDate: str
    status: str


class VerifiedGeographicWaypoint(BaseModel):
    id: str
    name: str
    coordinates: Tuple[float, float] = Field(description="[longitude, latitude]")
    elevationMeters: Optional[float] = None
    significance: str
    authoritySource: str


class DisasterCaseStudy(BaseModel):
    id: str
    code: str
    name: str
    eventDate: str
    basin: str
    country: str
    region: str
    eventType: str
    mechanismStatus: str
    mechanismNotes: str
    monitoringReadiness: str
    verifiedWaypoints: List[VerifiedGeographicWaypoint]
    authoritativeSources: List[AuthoritativeSourceRef]
    decisionSupportRecommendations: List[str]
    provenance: ProvenanceMeta


class DisasterEventSummary(BaseModel):
    id: str
    code: str
    name: str
    eventDate: str
    region: str
    country: str
    eventType: str
    mechanismStatus: str
    isPrototypeCaseStudy: bool = True
