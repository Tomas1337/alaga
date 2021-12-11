from sqlalchemy.orm import backref
from .db import db
from datetime import datetime

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    obit_id = db.Column(db.Integer, db.ForeignKey('obits.id'))
    author = db.Column(db.String(64), nullable=False)
    comment = db.Column(db.String(256), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'author': self.author,
            'comment': self.comment,
            'obit_id': self.obit_id,
            #'created_at': self.created_at,
            #'updated_at': self.updated_at
        }
