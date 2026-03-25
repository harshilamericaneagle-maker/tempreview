from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import desc
from ..models import db, Review, ReviewResponse, AppSetting
from ..services.review_helpers import determine_sentiment
from ..services.ai_drafter import draft_review_response
from ..utils.logging import log_activity

reviews_bp = Blueprint("reviews", __name__)


@reviews_bp.get("")
@jwt_required()
def list_reviews():
    platform = request.args.get("platform")
    status = request.args.get("status")
    sentiment = request.args.get("sentiment")
    search = request.args.get("search")

    query = Review.query.order_by(desc(Review.created_at))

    if platform:
        query = query.filter(Review.platform.ilike(platform))
    if status:
        query = query.filter(Review.status.ilike(status))
    if sentiment:
        query = query.filter(Review.sentiment.ilike(sentiment))
    if search:
        like_value = f"%{search}%"
        query = query.filter(
            db.or_(
                Review.customer_name.ilike(like_value),
                Review.review_text.ilike(like_value),
                Review.location.ilike(like_value),
            )
        )

    return jsonify([review.to_dict() for review in query.all()])


@reviews_bp.post("")
@jwt_required()
def create_review():
    data = request.get_json() or {}
    rating = int(data.get("rating", 0))
    review_text = (data.get("reviewText") or "").strip()

    if not data.get("customerName") or not data.get("platform") or not data.get("location") or not review_text or not (1 <= rating <= 5):
        return jsonify({"message": "platform, customerName, location, reviewText and rating are required"}), 400

    review = Review(
        platform=data["platform"].strip(),
        customer_name=data["customerName"].strip(),
        customer_email=(data.get("customerEmail") or "").strip() or None,
        rating=rating,
        review_text=review_text,
        sentiment=determine_sentiment(review_text, rating),
        status="unresponded",
        location=data["location"].strip(),
        source_url=(data.get("sourceUrl") or "").strip() or None,
    )
    db.session.add(review)
    claims = get_jwt()
    log_activity("created review", claims.get("name", "Unknown User"), "review", "new")
    db.session.commit()
    return jsonify(review.to_dict()), 201


@reviews_bp.get("/<int:review_id>")
@jwt_required()
def get_review(review_id: int):
    review = Review.query.get_or_404(review_id)
    payload = review.to_dict()
    payload["responses"] = [response.to_dict() for response in review.responses]
    return jsonify(payload)


@reviews_bp.post("/<int:review_id>/respond")
@jwt_required()
def respond_to_review(review_id: int):
    data = request.get_json() or {}
    review = Review.query.get_or_404(review_id)
    response_text = (data.get("response") or "").strip()

    if not response_text:
        return jsonify({"message": "response is required"}), 400

    claims = get_jwt()
    response = ReviewResponse(
        review_id=review.id,
        response_text=response_text,
        responder_name=claims.get("name", "System User"),
    )
    review.status = "responded"
    db.session.add(response)
    log_activity("responded to review", claims.get("name", "Unknown User"), "review", review.id)
    db.session.commit()

    return jsonify(review.to_dict())


@reviews_bp.post("/ai-draft")
@jwt_required()
def create_ai_draft():
    data = request.get_json() or {}
    rating = int(data.get("rating", 0))
    customer_name = (data.get("customerName") or "Customer").strip() or "Customer"
    review_text = (data.get("reviewText") or "").strip()
    settings = AppSetting.query.first()

    draft = draft_review_response(
        customer_name=customer_name,
        rating=rating,
        review_text=review_text,
        brand_voice=settings.brand_voice if settings else "professional",
        company_name=settings.company_name if settings else "Openrize",
    )
    return jsonify({"draft": draft})
