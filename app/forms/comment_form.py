from flask_wtf import FlaskForm
from sqlalchemy.orm import defaultload
from sqlalchemy.sql.sqltypes import Date, DateTime
from wtforms import widgets, StringField, DecimalField, DateField, SelectMultipleField, BooleanField, DateTimeField
from flask_wtf.file import FileField, FileRequired
from wtforms.fields.core import IntegerField
from wtforms.validators import DataRequired, Email, ValidationError


class CommentForm(FlaskForm):
    author = StringField('author', validators=[DataRequired()])
    comment = StringField('comment', validators=[DataRequired()])
    obit_id = IntegerField('obit_id', validators=[DataRequired()])

    def to_dict(self):
            return {
                "obit_id": self.obit_id,
                "author": self.author,
                "comment": self.comment,
            }
