from ..models import db, ActivityLog


def log_activity(action: str, actor: str, entity_type: str, entity_id: str):
    entry = ActivityLog(action=action, actor=actor, entity_type=entity_type, entity_id=str(entity_id))
    db.session.add(entry)
