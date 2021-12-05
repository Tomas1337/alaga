from app.models import db, Obit
from datetime import datetime, timedelta
import random
import requests, os
import pandas as pd
import cloudinary
import cloudinary.uploader
import cloudinary.api
from dotenv import load_dotenv

load_dotenv()
cloudinary.config( 
    cloud_name=os.getenv('CLOUDINARY_CLOUDNAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

def get_random_user():
    url = 'https://randomuser.me/api/'
    res = requests.get(url).json()
    return res['results'][0]

def calculate_age(born, death):
    return death.year - born.year - ((death.month, death.day) < (born.month, born.day))


def generate_picture(gender="male", min_age=20, max_age=80):
    generate_url = f"https://fakeface.rest/face/json?gender={gender}&minimum_age={min_age}&maximum_age={max_age}"
    resp = requests.get(generate_url)
    img_url = resp.json()['image_url']   
    upload_url = cloudinary.uploader.upload(img_url)['url']
    print('Image uploaded}')
    return upload_url


def seed_obits():
    random.seed('obit')

    """
    for i in range(1,20):
        csv_file = pd.read_csv('app/seeds/seed_list.csv')
        csv_file = csv_file[['First Name', 'Middle Name', 'Last Name', 'Gender', 'Short Description','OBITUARY', 'Date of Birth', 'Date of Death']]

        img_list = pd.read_csv('app/seeds/img_list.csv')
        user = get_random_user()
        nick_name = str(user['name']['title'] +' '+ user['name']['last']) 
        obit = Obit(
            user_id= random.randrange(1, 12),
            first_name= str(user['name']['first']),
            middle_name= "Middle",
            last_name= str(user['name']['last']),
            nick_name=(nick_name[:20] + '..') if len(nick_name) > 20 else nick_name,
            short_message="May you rest in peace",
            long_message="We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels. We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels. We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels. We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels. We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels. We pray for the eternal repose of our most beloved friend, father and husband. May he rest in peace with the angels.",
            obit_image='https://thispersondoesnotexist.com/image',
            start_date=(datetime.now() + timedelta(days=random.randrange(0,3))).isoformat(),
            end_date=(datetime.now() + timedelta(days=random.randrange(3, 10))).isoformat(),
            created_at=(datetime.now()).isoformat(),
            funding_goal=float(100000)

            #TODO
            #Add the bank details, financial assistance toggle and online novena thing.
        )

    """
    csv_file = pd.read_csv('app/seeds/seed_list.csv')
    error_count = 0
    sucess_count = 0
    for index, row in csv_file.iterrows():
        try:
            bd=  datetime.strptime(row['Date of Birth'], '%B %d, %Y')
            dd=  datetime.strptime(row['Date of Death'], '%B %d, %Y')
            age = calculate_age(bd, dd)
            obit = Obit(
                user_id = random.randrange(1, 12),
                first_name = row['First Name'],
                middle_name = row['Middle Name'],
                last_name = row['Last Name'],
                nick_name = row['First Name'],
                birth_date = bd,
                death_date = dd,
                short_message = row['Short Description'],
                long_message = row['OBITUARY'],

                #Generate picture
                obit_image=generate_picture(row['Gender'].lower(), min_age=age-5, max_age=age+5),
                #obit_image="test"
                start_date=(datetime.now() + timedelta(days=random.randrange(7,20))).isoformat(),
                end_date=(datetime.now() + timedelta(days=random.randrange(20,50))).isoformat(),
                created_at=(datetime.now()).isoformat(),
                funding_goal=float(100000)
            )
            db.session.add(obit)
            db.session.commit()
            sucess_count += 1

        except Exception as e:
            error_count += 1
            print(f'Failed to add an entry with error log: {e}')
            continue

    print(f'{error_count} entries failed to add')
    print(f'{sucess_count} entries added')

def undo_obits():
    db.session.execute('TRUNCATE obits CASCADE;')
    db.session.commit()


