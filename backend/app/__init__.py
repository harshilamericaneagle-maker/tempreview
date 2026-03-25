import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from .models import db
from .routes.auth import auth_bp
from .routes.reviews import reviews_bp
from .routes.dashboard import dashboard_bp
from .routes.review_requests import review_requests_bp
from .routes.nps import nps_bp
from .routes.settings import settings_bp
from .seed import seed_data

jwt = JWTManager()


def create_app():
    load_dotenv()
    app = Flask(__name__)

    database_url = os.getenv("DATABASE_URL", "sqlite:///review_manager.db")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "change-me")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "change-me-too")

    raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
    origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

    db.init_app(app)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(reviews_bp, url_prefix="/api/reviews")
    app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    app.register_blueprint(review_requests_bp, url_prefix="/api/review-requests")
    app.register_blueprint(nps_bp, url_prefix="/api/nps")
    app.register_blueprint(settings_bp, url_prefix="/api/settings")

    @app.get("/api/health")
    def health():
        return {"status": "ok", "database": app.config["SQLALCHEMY_DATABASE_URI"]}

    with app.app_context():
        db.create_all()
        seed_data()

    return app
