from flask import Blueprint, jsonify, redirect, request
from datetime import datetime, timedelta
from app.models import db, Project, User
from app.forms.project_form import ProjectForm
from flask_login import current_user
from sqlalchemy.orm import joinedload
from sqlalchemy import func, or_

project_routes = Blueprint('projects', __name__)


@project_routes.route('/')
def getAllProjects():
    result = Project.query.all()
    data = [project.to_dict() for project in result]
    return {"projects": data}


@project_routes.route('/', methods=["POST"])
def newProject():
    form = ProjectForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        project = Project(
            user_id=current_user.get_id(),
            title=form.data['title'],
            description=form.data['description'],
            funding_goal=form.data['fundingGoal'],
            balance=0.00,
            image=form.data['image'],
            date_goal=(datetime.now() + timedelta(days=30)).isoformat(),
            category=form.data['category']
        )
        db.session.add(project)
        db.session.commit()
        return project.to_dict()
    print(form.errors)
    return jsonify(form.errors)


@project_routes.route('/<id>')
def getSpecificProject(id):
    result = Project.query.get(id)
    if result is None:
        return {"error": "Not found"}
    return result.to_dict()


@project_routes.route('/newest')
def getNewest():
    result = Project.query.order_by(Project.date_goal.desc()).limit(9).all()
    data = [ project.to_dict() for project in result ]
    return {"newest_projects": data}

@project_routes.route('/trending')
def getTrending():
    result = Project.query.order_by(Project.balance.desc()).limit(4).all()
    data = [ project.to_dict() for project in result ]
    return {"trending_projects": data}

@project_routes.route('/random')
def get_random_project():
    result = Project.query.order_by(func.random()).limit(1).all()
    data = [project.to_dict() for project in result ]
    return {"random_project": data}

@project_routes.route('/<id>', methods=["PUT"])
def updateProject(id):
    project = Project.query.get(id)

    project.user_id = request.json.get('userId', project.user_id)
    project.title = request.json.get('title', project.title)
    project.description = request.json.get('description', project.description)
    project.funding_goal = request.json.get(
        'fundingGoal', project.funding_goal)
    project.balance = request.json.get('balance', project.balance)
    project.image = request.json.get('image', project.image)
    project.date_goal = request.json.get('date_goal', project.date_goal)
    project.category = request.json.get('category', project.category)

    db.session.commit()
    return project.to_dict()


@project_routes.route('/<id>', methods=["DELETE"])
def deleteProject(id):
    project = Project.query.get(id)
    if project is not None:
        db.session.delete(project)
        db.session.commit()
        return {"id deleted": id}
    else:
        return {"error": f'id {id} not found'}

# a little more robust but still not perfect.  Will search in multiple places on table but can't handle multiple search keywords well yet
@project_routes.route('/search/<query>')
def searchForProjects(query):
    result = Project.query.filter(or_(Project.title.ilike(f"%{query}%"),Project.description.ilike(f"%{query}%"),Project.category.ilike(f"%{query}%"))).options(joinedload(Project.user)).all()
    data = [ project.to_dict() for project in result ]
    return {"projects": data}
