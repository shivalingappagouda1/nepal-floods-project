"""Service for Emergency Response Decision Support Module."""

import uuid
from datetime import datetime, timezone
from typing import List, Optional
from app.schemas.response import (
    PriorityZone,
    ResponsePriorityTier,
    StagedReliefUnit,
    DirectiveSubmissionRequest,
    DirectiveSubmissionResponse
)
from app.data import PRECOMPUTED_RESPONSE_ZONES, DEMO_STAGED_UNITS
from app.schemas.common import ProvenanceMeta, DataTier
from app.core.errors import ResourceNotFoundException


class ResponseService:
    def __init__(self):
        self.zones: List[PriorityZone] = PRECOMPUTED_RESPONSE_ZONES
        self.units: List[StagedReliefUnit] = DEMO_STAGED_UNITS

    async def get_zones(self, tier: Optional[ResponsePriorityTier] = None) -> List[PriorityZone]:
        if tier:
            return [z for z in self.zones if z.priorityTier == tier]
        return self.zones

    async def get_zone_by_id(self, zone_id: str) -> PriorityZone:
        for z in self.zones:
            if z.id.lower() == zone_id.lower() or z.zoneCode.lower() == zone_id.lower():
                return z
        raise ResourceNotFoundException("PriorityZone", zone_id)

    async def get_staged_units(self) -> List[StagedReliefUnit]:
        return self.units

    async def submit_directive(self, request: DirectiveSubmissionRequest) -> DirectiveSubmissionResponse:
        zone = await self.get_zone_by_id(request.zoneId)
        sub_id = f"SUB-{uuid.uuid4().hex[:8].upper()}"
        now_iso = datetime.now(timezone.utc).isoformat()

        return DirectiveSubmissionResponse(
            submissionId=sub_id,
            zoneId=zone.id,
            status="QUEUED_FOR_COMMAND_SIGN_OFF",
            timestamp=now_iso,
            advisoryNotice="Directive logged as human-in-the-loop decision-support advisory. Requires Incident Commander sign-off.",
            provenance=ProvenanceMeta(
                tier=DataTier.DEMO_VALUE,
                source="HIMALAYA-SHIELD Incident Command Dispatch Queue",
                algorithm="Human-in-the-loop Directive Queue",
                isDemoValue=True
            )
        )


response_service = ResponseService()
