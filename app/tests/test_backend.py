import os
import tempfile
import pytest
import requests
import json

from flask_wtf import FlaskForm
from wtforms import widgets, StringField, DecimalField, DateField, SelectMultipleField
from flask_wtf.file import FileField, FileRequired
from wtforms.validators import DataRequired, Email, ValidationError

LONG_MESSAGE = """
Deborah “Debbie” Lynn Peterson was a caring wife, mother, grandmother, sister, and friend. She left this world suddenly on July 6, 2020 at age 56.

She was born to Craig and Donna Sanders on June 23, 1964. After graduating from high school, Debbie chased her dreams to serve abroad in the Peace Corps where she met her husband, John Peterson. Together, they had 3 children: Brenda, Chad, and Emmy.
Debbie loved spending time in the kitchen, creating delicious meals for her family. Neighborhood children would gather around the kitchen table for after-school cookies and loved listening to Debbie’s stories about her travels. She was a skilled piano player and filled her home with classical music. Most weekends were spent as a volunteer at the local soup kitchen.
A funeral service is scheduled for 11 am on July 9, 2020 at the Presbyterian church on the corner of State Street and Broadway. In lieu of flowers, please donate to the downtown soup kitchen on her behalf."""

def test_get_random_project():  
    response = requests.get('http://localhost:3000/api/projects/random')
    assert type(response.json()['random_project'][0]['user_id']) == int


def test_newObit():
    headers = {
        "Content-Type": "application/json"
    }
    with requests.Session() as s:

        #Get CSRF Cookie from token
        response = s.get('http://localhost:3000/api')
        if 'csrf_token' in response.cookies:
            csrftoken = response.cookies['csrf_token']
        else:
            csrftoken = response.cookies['csrf']
        
        #Login to have authenticated session
        payload = {
            'email': 'tomas@gmail.com',
            'password': '123321',
            'csrfmiddlewaretoken':csrftoken,
            'next':'/'
            }

        p = s.post('http://localhost:3000/users/login',
            json=payload,
            #data=json.dumps(payload), 
            headers=headers)
        assert p.status_code == 200
        
        payload = {
            'firstName': 'FirstTest',
            'middleName': 'MiddleTest',
            'lastName': 'LastTest',
            'nickName': 'NickTest',
            'short_message': 'sampleShortMessage sampleShortMessage sampleShortMessage',
            'long_message': LONG_MESSAGE,
            'funding_goal': 5000,
            'obit_image': 'https://thispersondoesnotexist.com/image',

            'start_date': '2021-11-06',
            'end_date': '2021-11-06',

            #Added Services
            'onlineService': 'True',
            'memorialStartDate': '2021-11-06 21:45:07',
            'memorialEndDate': '2021-11-09 21:45:07',
            'financialAssistance': 'True',
            'bankClientName': 'testBankClientName',
            'bankName': 'testBankName',
            'bankAccountNumber': 'testBankAccoutnNumber',            
        }

        #Post payload to api backend
        print('Posting payload to obits')
        response = s.post('http://localhost:3000/api/obits/',
            json=payload,
            headers=headers)

        assert response.status_code == 200

        #Get obit id from response content
        obit_id = response.json()['id']
        assert type(obit_id) == int
        
        #assert response.json()['obit_first_name'] == 'FirstTest'


def sim_login():
    response = requests.post('http://localhost:3000/api/obits/new', 
        json={'title': 'Test Title', 
            'description': 'Test Description', 
            'user_id': 1
            })

def test_newProject():
    headers = {
        "Content-Type": "application/json"
    }
    with requests.Session() as s:

        #Get CSRF Cookie from token
        response = s.get('http://localhost:3000/api')
        if 'csrf_token' in response.cookies:
            csrftoken = response.cookies['csrf_token']
        else:
            csrftoken = response.cookies['csrf']
        
        #Login to have authenticated session
        payload = {
            'email': 'tomas@gmail.com',
            'password': '123321',
            'csrfmiddlewaretoken':csrftoken,
            'next':'/'
            }

        p = s.post('http://localhost:3000/users/login',
            json=payload,
            #data=json.dumps(payload), 
            headers=headers)
        assert p.status_code == 200
        
        #Create new project
        payload = {'title':'testTitle', 
            'description': 'testDescription', 
            'fundingGoal': 10, 
            'image': 'testImage',
            'category': 'testCategory'}

        #Post payload to api backend
        response = s.post('http://localhost:3000/api/projects/',
            json=payload,
            headers=headers)
        assert response.status_code == 200
        assert response.json()['title'] == 'testTitle'

        #assert p.status_code == 200
        # response = s.get('http://localhost:3000/api/obits/new')
        # assert response.status_code == 200
        # assert response.json()['title'] == 'Test Title'
        # assert response.json()['description'] == 'Test Description'
        # assert response.json()['user_id'] == 1


def test_TrendingProjects():
    response = requests.get('http://localhost:3000/api/projects/trending')
    assert type(response.json()['trending_projects'][0]['user_id']) == int


def test_TrendingObits():
    response = requests.get('http://localhost:3000/api/obits/trending')
    assert type(response.json()['trending_obits'][0]['user_id']) == int
    assert type(response.json()['random_obit'][0]['user_id']) != 0

def test_RandomObit():
    response = requests.get('http://localhost:3000/api/obits/random')
    assert type(response.json()['random_obit'][0]['user_id']) == int
    assert type(response.json()['random_obit'][0]['user_id']) != 0

def test_NewestObit():
    response = requests.get('http://localhost:3000/api/obits/newest')
    assert type(response.json()['newest_obits'][0]['user_id']) == int
    #assert type(response.json()['random_obit'][0]['user_id']) != 0

def test_GetComments():
    id = 99
    response = requests.get(f'http://localhost:3000/api/obits/{str(id)}/comments')
    assert type(response.json()[0]['id']) == int

def test_GetDonations():
    id = 80
    response = requests.get(f'http://localhost:3000/api/obits/{str(id)}/donations')
    assert type(response.json()['donations'][0]['id']) == int

def test_PostComments():
    id = 99
    payload = {
            'author': 'test author',
            'obit_id': f'{str(id)}',
            'comment': 'Sample Comment'
            }

    response = requests.post(f'http://localhost:3000/api/obits/{str(id)}/comments', json=payload)
    assert response.status_code == 200