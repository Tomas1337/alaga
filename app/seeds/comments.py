from werkzeug.security import generate_password_hash
from app.models import db, Comment
from datetime import datetime, timedelta
import requests
import random

def get_random_user():
    url = 'https://randomuser.me/api/'
    res = requests.get(url).json()
    return res['results'][0]

def seed_comments():
    success_count = 0
    error_count = 0
    for i in range(1,100):
        try:
            user = get_random_user()
            first_name = str(user['name']['first'])
            last_name = str(user['name']['last'])
            comment = Comment(
                obit_id = random.randint(1, 200),
                author = first_name + ' ' + last_name,
                comment = 'This is a comment',
                created_at = datetime.now()
                )

            db.session.add(comment)
            db.session.commit()

            success_count += 1
        except Exception as e:
            db.session.rollback()
            error_count += 1
            print(f'Failed to add an entry with error log: {e}')
            continue
    
    print(f'{error_count} entries failed to add')
    print(f'{success_count} entries added')

def undo_comments():
    db.session.execute('TRUNCARE comments CASCADE;')
    db.session.commit()