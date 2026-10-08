"""Service for Disaster Events & Case Studies."""

from typing import List, Optional
from app.schemas.events import DisasterCaseStudy, DisasterEventSummary, VerifiedGeographicWaypoint
from app.data import CASE_STUDY_2026
from app.core.errors import ResourceNotFoundException


class EventService:
    def __init__(self):
        self.events: List[DisasterCaseStudy] = [CASE_STUDY_2026]

    async def get_all_events(self) -> List[DisasterEventSummary]:
        return [
            DisasterEventSummary(
                id=event.id,
                code=event.code,
                name=event.name,
                eventDate=event.eventDate,
                region=event.region,
                country=event.country,
                eventType=event.eventType,
                mechanismStatus=event.mechanismStatus,
                isPrototypeCaseStudy=True
            )
            for event in self.events
        ]

    async def get_event_by_id(self, event_id: str) -> DisasterCaseStudy:
        for event in self.events:
            if event.id.lower() == event_id.lower() or event.code.lower() == event_id.lower():
                return event
        raise ResourceNotFoundException("DisasterEvent", event_id)

    async def get_event_waypoints(self, event_id: str) -> List[VerifiedGeographicWaypoint]:
        event = await self.get_event_by_id(event_id)
        return event.verifiedWaypoints


event_service = EventService()
