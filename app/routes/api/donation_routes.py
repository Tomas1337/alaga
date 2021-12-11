from flask import Blueprint, jsonify, redirect, request
from datetime import datetime, timedelta
from app.models import db, Obit, Pledge, User, Donation
from app.forms.obit_form import ObitForm
from sqlalchemy.orm import joinedload

donation_routes = Blueprint('donations', __name__)

#Get all donations for a specific project
@donation_routes.route('/obits/<id>/donations')
def getAllObitDonations(id):
    obit = Obit.query.get(id)
    if obit:
        result = Donation.query.filter_by(obit_id=obit.id).all()
        data = [donation.to_dict() for donation in result]
        return {"donations": data}
    else:
        return {"error": f'obit id {id} not found'}, 404


# Create a new donation to a specific obit
@donation_routes.route('/obits/<id>/donations', methods=["POST"])
def newDonation(id):
    data = request.get_json()
    user_id = data["userId"]
    obit_id = data["obitId"]
    try:
        amount = float(data["amount"])
    except ValueError:
        amount = None

    # amount error handling
    error = ""
    if amount is None:
        error = "Donation amount must be numeric"
    elif amount <= 0:
        error = "Donation amount must be at least $1.00"
    if error:
        return {"error": error}, 400

    obit = Obit.query.get(id)
    if obit:
        obit.balance = float(obit.balance) + amount
        donation = Donation()
        donation.user_id = user_id
        donation.obit_id = obit_id
        donation.amount = amount
        db.session.add(donation)
        db.session.commit()
        return {"donation": donation.to_dict(), "obit": obit.to_dict()}
    else:
        return {"error": f'obit id {id} not found'}, 404

# {:,.0f}
# Edit an existing donation to a specific obit


@donation_routes.route('/obits/<id>/donations', methods=["PUT"])
def editDonation(id):
    data = request.get_json()
    user_id = data["userId"]
    amount = float(data["amount"])
    obit = Obit.query.get(id)
    if obit:
        donation = Donation.query.filter_by(obit_id=id, user_id=user_id).first()
        donation_difference = amount - float(donation.amount)
        if donation_difference <= 0:
            return {"error": f'Amount must be higher than your current donation (${donation.amount:,.2f})'}, 400
        obit.balance = float(obit.balance) + donation_difference
        donation.amount = amount
        db.session.commit()
        return {"donation": donation.to_dict(), "obit": obit.to_dict()}
    else:
        return {"error": f'Obit id {id} not found'}, 404


# Get all donations for a specific USER
@donation_routes.route('/users/<id>/donations')
def getAllUserDonations(id):
    user = User.query.get(id)
    # queries for donations attached to user, including obit data
    if user:
        donations = Donation.query.options(
            joinedload(Donation.obit)).filter_by(user_id=user.id).all()
        data = [donation.to_dict_obits() for donation in donations]
        return {"donations": data}
    else:
        return {"error": f'User id {id} not found'}, 404
