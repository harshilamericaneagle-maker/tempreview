from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), default="admin", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    platform = db.Column(db.String(100), nullable=False)
    customer_name = db.Column(db.String(255), nullable=False)
    customer_email = db.Column(db.String(255))
    rating = db.Column(db.Integer, nullable=False)
    review_text = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(30), nullable=False)
    status = db.Column(db.String(30), default="unresponded", nullable=False)
    location = db.Column(db.String(255), nullable=False)
    source_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    responses = db.relationship("ReviewResponse", backref="review", lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        latest_response = self.responses[-1].to_dict() if self.responses else None
        return {
            "id": self.id,
            "platform": self.platform,
            "customerName": self.customer_name,
            "customerEmail": self.customer_email,
            "rating": self.rating,
            "reviewText": self.review_text,
            "sentiment": self.sentiment,
            "status": self.status,
            "location": self.location,
            "sourceUrl": self.source_url,
            "createdAt": self.created_at.isoformat(),
            "updatedAt": self.updated_at.isoformat(),
            "latestResponse": latest_response,
        }


class ReviewResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    review_id = db.Column(db.Integer, db.ForeignKey("review.id"), nullable=False)
    response_text = db.Column(db.Text, nullable=False)
    responder_name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "reviewId": self.review_id,
            "responseText": self.response_text,
            "responderName": self.responder_name,
            "createdAt": self.created_at.isoformat(),
        }


class ReviewRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    phone = db.Column(db.String(50))
    channel = db.Column(db.String(20), nullable=False)
    delay_hours = db.Column(db.Integer, default=2, nullable=False)
    platform = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(30), default="queued", nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customer_name,
            "email": self.email,
            "phone": self.phone,
            "channel": self.channel,
            "delayHours": self.delay_hours,
            "platform": self.platform,
            "status": self.status,
            "createdAt": self.created_at.isoformat(),
        }


class NpsFeedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255))
    score = db.Column(db.Integer, nullable=False)
    issue_category = db.Column(db.String(255))
    details = db.Column(db.Text)
    route = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "customerName": self.customer_name,
            "email": self.email,
            "score": self.score,
            "issueCategory": self.issue_category,
            "details": self.details,
            "route": self.route,
            "createdAt": self.created_at.isoformat(),
        }


class AppSetting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nps_threshold = db.Column(db.Integer, default=7, nullable=False)
    default_review_platform = db.Column(db.String(100), default="Google", nullable=False)
    brand_voice = db.Column(db.String(50), default="professional", nullable=False)
    company_name = db.Column(db.String(255), default="Openrize", nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "npsThreshold": self.nps_threshold,
            "defaultReviewPlatform": self.default_review_platform,
            "brandVoice": self.brand_voice,
            "companyName": self.company_name,
        }


class ActivityLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    action = db.Column(db.String(255), nullable=False)
    actor = db.Column(db.String(255), nullable=False)
    entity_type = db.Column(db.String(100), nullable=False)
    entity_id = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "action": self.action,
            "actor": self.actor,
            "entityType": self.entity_type,
            "entityId": self.entity_id,
            "createdAt": self.created_at.isoformat(),
        }
