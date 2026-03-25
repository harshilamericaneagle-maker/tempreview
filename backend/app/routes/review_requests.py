from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ..models import db, ReviewRequest
from ..utils.logging import log_activity

review_requests_bp = Blueprint("review_requests", __name__)


@review_requests_bp.get("")
@jwt_required()
def list_requests():
    items = ReviewRequest.query.order_by(ReviewRequest.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items])


@review_requests_bp.post("")
@jwt_required()
def create_request():
    data = request.get_json() or {}
    if not data.get("customerName") or not data.get("channel") or not data.get("platform"):
        return jsonify({"message": "customerName, channel and platform are required"}), 400

    item = ReviewRequest(
        customer_name=data["customerName"].strip(),
        email=(data.get("email") or "").strip() or None,
        phone=(data.get("phone") or "").strip() or None,
        channel=data["channel"].strip(),
        delay_hours=int(data.get("delayHours", 2)),
        platform=data["platform"].strip(),
        status="queued",
    )
    db.session.add(item)
    claims = get_jwt()
    log_activity("created review request", claims.get("name", "Unknown User"), "review_request", "new")
    db.session.commit()
    return jsonify(item.to_dict()), 201
