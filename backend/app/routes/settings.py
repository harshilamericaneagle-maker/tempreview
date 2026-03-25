from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..models import db, AppSetting
from ..utils.logging import log_activity

settings_bp = Blueprint("settings", __name__)


@settings_bp.get("")
@jwt_required()
def get_settings():
    settings = AppSetting.query.first()
    return jsonify(settings.to_dict())


@settings_bp.put("")
@jwt_required()
def update_settings():
    settings = AppSetting.query.first_or_404()
    data = request.get_json() or {}

    if "npsThreshold" in data:
        settings.nps_threshold = int(data["npsThreshold"])
    if "defaultReviewPlatform" in data:
        settings.default_review_platform = data["defaultReviewPlatform"].strip()
    if "brandVoice" in data:
        settings.brand_voice = data["brandVoice"].strip()
    if "companyName" in data:
        settings.company_name = data["companyName"].strip()

    claims = get_jwt()
    log_activity("updated settings", claims.get("name", "Unknown User"), "settings", settings.id)
    db.session.commit()
    return jsonify(settings.to_dict())
