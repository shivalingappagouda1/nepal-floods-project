"""Schemas for Emergency Response Decision-Support Module."""

from typing import List, Optional, Tuple, Dict
from enum import Enum
from pydantic import BaseModel, Field
from app.schemas.common import ProvenanceMeta, SeverityLevel


class ResponsePriorityTier(str, Enum):
    PRIORITY_1 = "PRIORITY_1"
    PRIORITY_2 = "PRIORITY_2"
    PRIORITY_3 = "PRIORITY_3"


class RouteStatus(BaseModel):
    isAvailable: bool = False
    roadPassability: str = "UNAVAILABLE"
    routeDescription: str = "Route analysis unavailable."
    primaryObstacle: Optional[str] = "Live road network routing data not currently connected; unverified corridor conditions."
    alternativeAccessMethod: str = "Human field reconnaissance or aerial assessment recommended."


class ResponseFactorAssessment(BaseModel):
    key: str
    label: str
    level: str  # CRITICAL, HIGH, MEDIUM, LOW, DATA_UNAVAILABLE
    normalizedScore: Optional[float] = None
    description: str
    statusDisplay: str
    provenanceTier: str = "DEMO_VALUE"
    isAvailable: bool = True
    missingReason: Optional[str] = None


class PriorityZone(BaseModel):
    id: str
    zoneCode: str
    name: str
    sector: str
    priorityTier: ResponsePriorityTier
    priorityRank: int
    score: int
    prototypeScoreLabel: str = "Prototype response priority score"
    severity: SeverityLevel
    populationExposure: str
    infrastructureImpact: str
    accessibility: str
    secondaryHazardRisk: str
    medicalUrgency: str
    whyFactors: List[str]
    recommendedAction: str
    confidence: Optional[float] = None  # Omitted in prototype
    confidenceDisplay: str = "CONFIDENCE: Not available"
    verificationStatus: str = "Human verification required"
    routeStatus: RouteStatus
    coordinates: Tuple[float, float]
    polygon: List[Tuple[float, float]]
    coordinateProvenance: str
    factors: Dict[str, ResponseFactorAssessment]
    provenance: ProvenanceMeta


class StagedReliefUnit(BaseModel):
    id: str
    name: str
    agency: str
    role: str
    callsign: str
    baseLocation: str
    status: str
    statusLabel: str
    assignedZoneId: Optional[str] = None
    contactFrequency: str


class DirectiveSubmissionRequest(BaseModel):
    zoneId: str
    actionDirective: str
    operatorNotes: Optional[str] = None


class DirectiveSubmissionResponse(BaseModel):
    submissionId: str
    zoneId: str
    status: str = "QUEUED_FOR_COMMAND_SIGN_OFF"
    humanReviewRequired: str = "Human review required"
    queueType: str = "Decision-support queue only"
    timestamp: str
    advisoryNotice: str = "Directive logged as human-in-the-loop decision-support advisory. Decision-support queue only (Human review required — does not autonomously dispatch resources, issue evacuation orders, or invoke emergency systems)."
    provenance: ProvenanceMeta
