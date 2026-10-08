"""Damage Assessment API router."""

from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.damage import (
    DamageCategory,
    DamageCategoryConfig,
    DamageFeature,
    DamageAssessmentSummary
)
from app.services import damage_service
from app.schemas.common import BaseResponse

router = APIRouter(prefix="/damage", tags=["Damage Assessment"])


@router.get("/categories", response_model=BaseResponse[List[DamageCategoryConfig]], summary="List damage assessment categories")
async def list_categories():
    """Retrieves standard image/GIS evidence damage categories (zero structural claims)."""
    configs = await damage_service.get_categories()
    return BaseResponse(
        success=True,
        data=configs,
        message="Damage evidence categories retrieved."
    )


@router.get("/features", response_model=BaseResponse[List[DamageFeature]], summary="List detected damage features")
async def list_features(
    category: Optional[DamageCategory] = Query(None, description="Filter by damage evidence category")
):
    """Retrieves detected damage features with precomputed GIS/image evidence and human verification markers."""
    features = await damage_service.get_features(category=category)
    return BaseResponse(
        success=True,
        data=features,
        message=f"Retrieved {len(features)} damage assessment features."
    )


@router.get("/features/{feature_id}", response_model=BaseResponse[DamageFeature], summary="Get damage feature by ID")
async def get_feature(feature_id: str):
    """Retrieves a single detected damage feature."""
    feature = await damage_service.get_feature_by_id(feature_id)
    return BaseResponse(
        success=True,
        data=feature,
        provenance=feature.provenance
    )


@router.get("/summary", response_model=BaseResponse[DamageAssessmentSummary], summary="Get damage assessment summary")
async def get_summary():
    """Retrieves aggregated statistics and category breakdowns for the damage assessment module."""
    summary = await damage_service.get_summary()
    return BaseResponse(
        success=True,
        data=summary,
        provenance=summary.provenance
    )
