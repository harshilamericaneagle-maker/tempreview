def determine_sentiment(text: str, rating: int) -> str:
    normalized = (text or "").lower()
    negative_keywords = ["slow", "bad", "late", "poor", "dirty", "issue", "problem", "rude", "long wait"]
    positive_keywords = ["great", "friendly", "excellent", "amazing", "fast", "clean", "love"]

    if rating <= 2 or any(word in normalized for word in negative_keywords):
        return "negative"
    if rating >= 4 or any(word in normalized for word in positive_keywords):
        return "positive"
    return "neutral"
