from .db import db
from datetime import datetime, timedelta, date


class Obit(db.Model):
    __tablename__ = 'obits'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    
    # Obituary User Provided Data
    first_name = db.Column(db.String(50), nullable=False)
    middle_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    birth_date = db.Column(db.Date, nullable=False)
    death_date = db.Column(db.Date, nullable=False)
    nick_name = db.Column(db.String(50), nullable=False)
    short_message = db.Column(db.String(100), nullable=True)
    long_message = db.Column(db.Text, nullable=True)
    obit_image = db.Column(db.String(255), nullable=False, default='https://thispersondoesnotexist.com/image')
    
    # Obituary generated Data
    start_date = db.Column(db.DateTime, nullable=False, default = datetime.utcnow)
    delta = timedelta(days=3)
    now = datetime.utcnow()

    #Create a future date using the datetime library and the timedelta function
    end_date = db.Column(db.DateTime, nullable=False, default=now+delta)
    #end_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow())
    
    user = db.relationship("User", back_populates="obits")
    donations = db.relationship(
        "Donation", back_populates="obit", cascade="delete, delete-orphan")

    # Finance Related
    balance = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    funding_goal = db.Column(db.Numeric(10, 2), default=10000)
    # wallet_id = db.Column(db.String(30), nullable=True)

    #Obituary AddOns
    onlineService = db.Column(db.Boolean, nullable=False, default=False)
    memorialStartDate = db.Column(db.DateTime, nullable=True)
    memorialEndDate = db.Column(db.DateTime, nullable=True)
    financialAssistance = db.Column(db.Boolean, nullable=False, default=False)
    bankClientName = db.Column(db.String(50), nullable=True)
    bankName = db.Column(db.String(50), nullable=True) 
    bankAccountNumber = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "first_name": self.first_name,
            "middle_name": self.middle_name,
            "last_name": self.last_name,
            "nick_name": self.nick_name,
            "short_message": self.short_message,
            "long_message": self.long_message,
            "obit_image": self.obit_image,
            "start_date": self.start_date,
            "end_date": self.end_date,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "balance": float(self.balance),
            "funding_goal": float(self.funding_goal),
            "onlineService": self.onlineService,
            "memorialStartDate": self.memorialStartDate,
            "memorialEndDate": self.memorialEndDate,
            "financialAssistance": self.financialAssistance,
            "bankClientName": self.bankClientName,
            "bankName": self.bankName,
            "bankAccountNumber": self.bankAccountNumber
        }
