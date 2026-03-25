from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..models import db, NpsFeedback, AppSetting
from ..utils.logging import log_activity

nps_bp = Blueprint("nps", __name__)


@nps_bp.get("")
@jwt_required()
def list_feedback():
    items = NpsFeedback.query.order_by(NpsFeedback.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items])


@nps_bp.post("")
@jwt_required()
def create_feedback():
    data = request.get_json() or {}
    score = int(data.get("score", -1))

    if not data.get("customerName") or score < 0 or score > 10:
        return jsonify({"message": "customerName and score between 0 and 10 are required"}), 400

    settings = AppSetting.query.first()
    threshold = settings.nps_threshold if settings else 7
    route = "private_feedback" if score < threshold else "public_review"

    item = NpsFeedback(
        customer_name=data["customerName"].strip(),
        email=(data.get("email") or "").strip() or None,
        score=score,
        issue_category=(data.get("issueCategory") or "").strip() or None,
        details=(data.get("details") or "").strip() or None,
        route=route,
    )
    db.session.add(item)
    claims = get_jwt()
    log_activity("submitted nps feedback", claims.get("name", "Unknown User"), "nps_feedback", "new")
    db.session.commit()
    return jsonify(item.to_dict()), 201
