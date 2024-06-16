from flask import Blueprint, render_template, redirect, url_for, request, session, flash, jsonify
from functools import wraps
from models import db, User, Event, CheckIn, Application
from werkzeug.security import generate_password_hash
import logging

admin_bp = Blueprint('admin', __name__)

logging.basicConfig(level=logging.DEBUG)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('user_role') != 'admin':
            flash('You do not have access to this page.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

def organizer_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session or session.get('user_role') not in ['admin', 'organizer']:
            flash('You do not have access to this page.', 'danger')
            return redirect(url_for('main.index'))
        return f(*args, **kwargs)
    return decorated_function

@admin_bp.route('/dashboard')
@admin_required
def dashboard():
    return render_template('admin/dashboard.html')

@admin_bp.route('/')
@admin_required
def admin():
    return redirect(url_for('admin.dashboard'))

@admin_bp.route('/delete/<int:user_id>', methods=['POST'])
@admin_required
def delete_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.applications:
        flash('Cannot delete user with existing applications.', 'danger')
        return redirect(url_for('admin.manage_users'))
    db.session.delete(user)
    db.session.commit()
    flash('User has been deleted.', 'success')
    return redirect(url_for('admin.manage_users'))

@admin_bp.route('/edit/<int:user_id>', methods=['GET', 'POST'])
@admin_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    if request.method == 'POST':
        user.username = request.form['username']
        user.role = request.form['role']
        db.session.commit()
        flash('User has been updated.', 'success')
        return redirect(url_for('admin.admin'))
    return render_template('admin/edit_user.html', user=user)

@admin_bp.route('/create', methods=['GET', 'POST'])
@admin_required
def create_user():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        role = request.form['role']
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        flash('User has been created.', 'success')
        return redirect(url_for('admin.admin'))
    return render_template('admin/create_user.html')

@admin_bp.route('/create_event', methods=['POST'])
@admin_required
def create_event():
    name = request.form['name']
    new_event = Event(name=name)
    db.session.add(new_event)
    db.session.commit()
    flash('Event has been created.', 'success')
    return redirect(url_for('admin.manage_events'))

@admin_bp.route('/manage_events')
@admin_required
def manage_events():
    events = Event.query.all()
    return render_template('admin/manage_events.html', events=events)

@admin_bp.route('/delete_event/<int:event_id>', methods=['POST'])
@admin_required
def delete_event(event_id):
    event = Event.query.get_or_404(event_id)
    # Delete all check-ins associated with this event
    CheckIn.query.filter_by(event_id=event.id).delete()
    db.session.delete(event)
    db.session.commit()
    flash('Event and all associated check-ins have been deleted.', 'success')
    return redirect(url_for('admin.manage_events'))


@admin_bp.route('/manage_users')
@admin_required
def manage_users():
    users = User.query.all()
    return render_template('admin/manage_users.html', users=users)


@admin_bp.route('/event_stats/<int:event_id>')
@admin_required
def event_stats(event_id):
    event = Event.query.get_or_404(event_id)
    check_ins = db.session.query(CheckIn, User).join(User, CheckIn.user_id == User.id).filter(CheckIn.event_id == event.id).all()
    return render_template('admin/event_stats.html', event=event, check_ins=check_ins)


@admin_bp.route('/scanner_history', methods=['GET'])
@admin_required
def scanner_history():
    admin_id = session.get('user_id')
    check_ins = db.session.query(CheckIn.timestamp, User.username, Event.name).join(User, CheckIn.user_id == User.id).join(Event, CheckIn.event_id == Event.id).filter(CheckIn.scanned_by == admin_id).all()
    history = [
        {
            'username': username,
            'timestamp': timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            'event_name': event_name
        }
        for timestamp, username, event_name in check_ins
    ]
    return jsonify(history)

@admin_bp.route('/scan', methods=['GET', 'POST'])
@admin_required
def scan():
    if request.method == 'POST':
        data = request.get_json()
        user_id = data.get('user_id')
        event_id = data.get('event_id')
        scanner_id = session.get('user_id')
        
        user = User.query.get(user_id)
        event = Event.query.get(event_id)
        
        if user and event:
            existing_check_in = CheckIn.query.filter_by(user_id=user.id, event_id=event.id).first()
            if existing_check_in:
                return jsonify(success=False, message=f'User {user.username} has already been checked into event {event.name}.', user_name=user.username)
            
            check_in = CheckIn(user_id=user.id, event_id=event.id, scanned_by=scanner_id)
            db.session.add(check_in)
            db.session.commit()
            return jsonify(success=True, message=f'User {user.username} has been checked into event {event.name}.', user_name=user.username)
        else:
            return jsonify(success=False, message='Invalid user ID or event ID.')
    else:
        events = Event.query.all()
        return render_template('scan.html', events=events)
    

@admin_bp.route('/review_applications')
@admin_required
def review_applications():
    applications = Application.query.order_by(Application.application_status, Application.id).all()
    return render_template('admin/review_applications.html', applications=applications)

@admin_bp.route('/view_application/<int:application_id>')
@admin_required
def view_application(application_id):
    application = Application.query.get_or_404(application_id)
    return render_template('admin/view_application.html', application=application)

@admin_bp.route('/update_application_status/<int:application_id>', methods=['POST'])
@admin_required
def update_application_status(application_id):
    application = Application.query.get_or_404(application_id)
    status = request.form['status']
    application.application_status = status
    application.reviewed_by = session.get('user_id')
    db.session.commit()
    flash('Application status updated successfully.', 'success')
    return redirect(url_for('admin.review_applications'))




