from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from sqlalchemy import func
from ..models import Review, ReviewRequest, NpsFeedback, ActivityLog

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.get("/stats")
@jwt_required()
def stats():
    total_reviews = Review.query.count()
    responded_reviews = Review.query.filter_by(status="responded").count()
    negative_reviews = Review.query.filter_by(sentiment="negative").count()
    average_rating = db_average_rating()
    requests_count = ReviewRequest.query.count()
    private_feedback = NpsFeedback.query.filter_by(route="private_feedback").count()

    return jsonify(
        {
            "totalReviews": total_reviews,
            "respondedReviews": responded_reviews,
            "negativeReviews": negative_reviews,
            "averageRating": average_rating,
            "reviewRequests": requests_count,
            "privateFeedbackCount": private_feedback,
        }
    )


@dashboard_bp.get("/activity")
@jwt_required()
def activity():
    items = ActivityLog.query.order_by(ActivityLog.created_at.desc()).limit(20).all()
    return jsonify([item.to_dict() for item in items])


def db_average_rating():
    avg_value = Review.query.with_entities(func.avg(Review.rating)).scalar()
    return round(float(avg_value), 2) if avg_value is not None else 0
