import os
from .models import db, User, Review, ReviewResponse, AppSetting
from .services.review_helpers import determine_sentiment


def seed_data():
    admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
    admin_password = os.getenv("ADMIN_PASSWORD", "Admin@123")
    should_seed = os.getenv("SEED_SAMPLE_DATA", "true").lower() == "true"

    if not User.query.filter_by(email=admin_email).first():
        admin = User(email=admin_email, full_name="System Admin", role="admin")
        admin.set_password(admin_password)
        db.session.add(admin)

    if not AppSetting.query.first():
        db.session.add(AppSetting())

    if should_seed and Review.query.count() == 0:
        samples = [
            Review(
                platform="Google",
                customer_name="Sarah Johnson",
                customer_email="sarah@example.com",
                rating=5,
                review_text="Great service, clean store, and fast checkout.",
                sentiment=determine_sentiment("Great service, clean store, and fast checkout.", 5),
                status="responded",
                location="Main Store",
                source_url="https://example.com/review/1",
            ),
            Review(
                platform="Facebook",
                customer_name="Brian Lee",
                customer_email="brian@example.com",
                rating=2,
                review_text="The wait time was too long and no one updated me.",
                sentiment=determine_sentiment("The wait time was too long and no one updated me.", 2),
                status="unresponded",
                location="Downtown Branch",
                source_url="https://example.com/review/2",
            ),
            Review(
                platform="Google",
                customer_name="Mia Davis",
                customer_email="mia@example.com",
                rating=4,
                review_text="Friendly staff and smooth pickup experience.",
                sentiment=determine_sentiment("Friendly staff and smooth pickup experience.", 4),
                status="unresponded",
                location="North Side",
                source_url="https://example.com/review/3",
            ),
        ]
        db.session.add_all(samples)
        db.session.flush()
        db.session.add(
            ReviewResponse(
                review_id=samples[0].id,
                response_text="Thank you for your kind words. We appreciate your support and hope to serve you again soon.",
                responder_name="System Admin",
            )
        )

    db.session.commit()
