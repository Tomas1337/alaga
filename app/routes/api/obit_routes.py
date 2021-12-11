from flask import Blueprint, jsonify, redirect, request
from datetime import datetime, timedelta
from app.models import db, Obit, User, Comment
from app.forms.obit_form import ObitForm
from app.forms.comment_form import CommentForm
from flask_login import current_user
from sqlalchemy.orm import joinedload
from sqlalchemy import func, or_
from itertools import chain
from werkzeug.utils import secure_filename
import json

obit_routes = Blueprint('obits', __name__)

@obit_routes.route('/')
def getAllObits():
    result = Obit.query.all()
    data = [obit.to_dict() for obit in result]
    return {"obits": data}

@obit_routes.route('/<id>/comments', methods=["POST"])
def addComment(id):
    form = CommentForm()
    #form['csrf_token'].data = request.form['csrf_token']
    print('here at addComment')
    if form.validate_on_submit():
        comment = Comment(
            author=form.data['author'],
            comment=form.data['comment'],
            obit_id=form.data['obit_id']
        )
    db.session.add(comment)
    db.session.commit()
    return comment.to_dict()



@obit_routes.route('/', methods=["POST"])
def newObit():
    form = ObitForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        #print("Validating Form")
        obit = Obit(
            user_id=current_user.get_id(),
            first_name=form.data['firstName'],
            middle_name=form.data['middleName'],
            last_name=form.data['lastName'],
            nick_name=form.data['nickName'],
            short_message=form.data['short_message'],
            long_message=form.data['long_message'],
            funding_goal=form.data['funding_goal'],
            balance=0.00,
            obit_image=form.data['obit_image'],

            start_date=form.data['start_date'],
            end_date=form.data['end_date'],

            onlineService=bool(form.data['onlineService']),
            memorialStartDate=form.data['memorialStartDate'],
            memorialEndDate=form.data['memorialEndDate'],
            financialAssistance=bool(form.data['financialAssistance']),
            bankClientName=form.data['bankClientName'],
            bankName=form.data['bankName'],
            bankAccountNumber=form.data['bankAccountNumber'],
        )

        print('Saving to database')
        db.session.add(obit)
        db.session.commit()
        return obit.to_dict()
    print(form.errors)
    return jsonify(form.errors)

# GET route for a specific obit id
@obit_routes.route('/<id>')
def getSpecificObit(id):
    result = Obit.query.get(id)
    if result is None:
        return {"error": "Not found"}
    return result.to_dict()

# GET route for comments on a specific obit id
@obit_routes.route('/<id>/comments')
def getComments(id):
    # Get all comments for a specific obit
    result = Comment.query.filter_by(obit_id=id).with_entities(Comment.id, Comment.author, Comment.comment).all()
    #pdb.set_trace()
    keys = result[0].keys()
    
    numfields = len(keys)
    data = []

    # Combine the keys tuple and the data tuple to output a json dictionary
    for row in result:
        dictrow = {}
        for idx, key in enumerate(keys):
            dictrow[key] = row[idx]
        data.append(dictrow)
    if result is None:
        return {"error": "Not found"}

    return json.dumps(data, indent=4, sort_keys=True, default=str)




# GET route for obits started by user
@obit_routes.route('/users/<user_id>')
def getUserObits(user_id):
    obits = Obit.query.filter_by(user_id=user_id).all()
    if obits:
        data = [obit.to_dict() for obit in obits]
        return {"obits": data}
    return {"error": "Not found"}


@obit_routes.route('/newest')
def getNewest():
    result = Obit.query.order_by(Obit.end_date.desc()).limit(9).all()
    data = [obit.to_dict() for obit in result]
    return {"newest_obits": data}


@obit_routes.route('/trending')
def getTrending():
    result = Obit.query.order_by(Obit.balance.desc()).limit(4).all()
    data = [obit.to_dict() for obit in result]
    return {"trending_obits": data}


@obit_routes.route('/random')
def get_random_obit():
    result = Obit.query.order_by(func.random()).limit(1).all()
    data = [obit.to_dict() for obit in result]
    return {"random_obit": data}


@obit_routes.route('/<id>', methods=["PUT"])
def updateObit(id):
    obit = Obit.query.get(id)

    obit.user_id = request.json.get('userId', obit.user_id)
    obit.title = request.json.get('title', obit.title)
    obit.description = request.json.get('description', obit.description)
    obit.funding_goal = request.json.get(
        'fundingGoal', obit.funding_goal)
    obit.balance = request.json.get('balance', obit.balance)
    obit.image = request.json.get('image', obit.image)
    obit.date_goal = request.json.get('date_goal', obit.date_goal)
    obit.category = request.json.get('category', obit.category)

    db.session.commit()
    return obit.to_dict()


@obit_routes.route('/<id>', methods=["DELETE"])
def deleteObit(id):
    obit = Obit.query.get(id)
    if obit is not None:
        db.session.delete(obit)
        db.session.commit()
        return {"id deleted": id}
    else:
        return {"error": f'id {id} not found'}

@obit_routes.route('/search/<query>')
def searchForObits(query):

    search_terms = query.split('+')

    result = list(chain.from_iterable((Obit.query.filter(or_(Obit.title.ilike(f"%{term}%"), Obit.description.ilike(f"%{term}%"), Obit.category.ilike(f"%{term}%"))).options(joinedload(Obit.user)).all()) for term in search_terms))

    data = [obit.to_dict() for obit in result]

    return {"obits": data}


