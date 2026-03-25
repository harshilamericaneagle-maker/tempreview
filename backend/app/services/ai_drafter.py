import os


def draft_review_response(customer_name: str, rating: int, review_text: str, brand_voice: str, company_name: str) -> str:
    voice = brand_voice or "professional"

    if rating >= 4:
        return (
            f"Hi {customer_name}, thank you for your positive feedback. "
            f"We are glad you had a great experience with {company_name}. "
            f"Your support means a lot to our team."
        )
    if rating == 3:
        return (
            f"Hi {customer_name}, thank you for sharing your feedback. "
            f"We appreciate your honest review and will use it to improve the experience we provide."
        )
    return (
        f"Hi {customer_name}, we are sorry your experience did not meet expectations. "
        f"Thank you for bringing this to our attention. Our team will review your feedback and work on a better experience."
    )
