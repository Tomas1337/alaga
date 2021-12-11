from flask.cli import AppGroup
from .users import seed_users, undo_users
from .projects import seed_projects, undo_projects
from .pledges import seed_pledges, undo_pledges
from .obits import seed_obits, undo_obits
from .donations import seed_donations, undo_donations
from .comments import seed_comments, undo_comments

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')

# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    pass
    seed_users()
    seed_projects()
    # Add other seed functions here
    seed_obits()
    seed_donations()

@seed_commands.command('obits')
def seed_o():
    seed_obits()

@seed_commands.command('donations')
def seed_d():
    seed_donations()

# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    pass
    undo_users()
    undo_projects()
    undo_pledges()
    undo_donations()
    undo_obits()
    # Add other undo functions here

@seed_commands.command('undo_obits')
def undo_o():
    pass
    undo_obits()

@seed_commands.command('comments')
def seed_c():
    seed_comments()
