from flask import Blueprint, jsonify, redirect, request
from datetime import datetime, timedelta
from app.models import db, Project
from app.forms.project_form import ProjectForm

project_routes = Blueprint('projects', __name__)

@project_routes.route('/')
def getAllProjects():
    result = Project.query.all()
    data = [ project.to_dict() for project in result ]
    return {"projects": data}


@project_routes.route('/', methods=["POST"])
def newProject():
    form = ProjectForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        project = Project(
            user_id=form.data['userId'],
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
    return result.to_dict()


@project_routes.route('/trending')
def getTrending():
    result = Project.query.order_by(Project.date_goal.desc()).limit(5).all()
    data = [ project.to_dict() for project in result ]
    return {"trending_projects": data}


@project_routes.route('/<id>', methods=["PUT"])
def updateProject(id):
    project = Project.query.get(id)

    project.user_id = request.json.get('userId', project.user_id)
    project.title = request.json.get('title', project.title)
    project.description = request.json.get('description', project.description)
    project.funding_goal = request.json.get('fundingGoal', project.funding_goal)
    project.balance = request.json.get('balance', project.balance)
    project.image = request.json.get('image', project.image)
    project.date_goal = request.json.get('date_goal', project.date_goal)
    project.category = request.json.get('category', project.category)

    db.session.commit()
    return project.to_dict()