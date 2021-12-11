from werkzeug.security import generate_password_hash
from app.models import db, Donation
from datetime import datetime, timedelta

# Adds obits. Add more here if you like!
import random

def seed_donations():
    success_count = 0
    error_count = 0
    for i in range(1, 256):
        try:
            donation = Donation(
                amount = random.randint(50 ,1000),
                user_id = random.randint(1 ,12),
                obit_id = random.randint(15 ,174)
            )
            db.session.add(donation)
            db.session.commit()
            success_count += 1

        except Exception as e:
            db.session.rollback()
            error_count += 1
            print(f'Failed to add an entry with error log: {e}')
            continue
    
    print(f'{error_count} entries failed to add')
    print(f'{success_count} entries added')
    

def undo_donations():
    db.session.execute('TRUNCATE donation;')
    db.session.commit()
