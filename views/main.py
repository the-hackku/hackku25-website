# views/main.py
from flask import Blueprint, render_template, redirect, url_for, request, session, flash, send_file
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, Application
from functools import wraps

main_bp = Blueprint('main', __name__)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('You need to be logged in to access this page.', 'warning')
            return redirect(url_for('main.login'))
        return f(*args, **kwargs)
    return decorated_function

@main_bp.route('/')
@login_required
def index():
    user_id = session['user_id']
    application = Application.query.filter_by(user_id=user_id).first()
    return render_template('index.html', application=application)

@main_bp.route('/about')
@login_required
def about():
    return render_template('about.html')

@main_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        identifier = request.form['identifier']
        password = request.form['password']
        user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()
        
        if user:
            if check_password_hash(user.password, password):
                session['user_id'] = user.id
                session['user_role'] = user.role
                flash('Login successful', 'success')
                return redirect(url_for('main.index'))
            else:
                flash('Incorrect password. Please try again.', 'danger')
        else:
            flash('Account not found. Please check your identifier.', 'danger')
            
    return render_template('login.html')



@main_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        role = request.form.get('role', 'hacker')  # Default role is 'user'
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        new_user = User(username=username, email=email,  password=hashed_password, role=role)
        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        session['user_role'] = new_user.role
        flash('Registration successful. You are now logged in.', 'success')
        return redirect(url_for('main.index'))
    return render_template('register.html')

@main_bp.route('/logout')
@login_required
def logout():
    session.pop('user_id', None)
    session.pop('user_role', None)
    flash('You have been logged out.', 'info')
    return redirect(url_for('main.login'))

@main_bp.route('/profile')
@login_required
def user_profile():
    user_id = session['user_id']
    user = User.query.get(user_id)
    return render_template('profile.html', user=user)

@main_bp.route('/qr_code/<int:user_id>')
@login_required
def qr_code(user_id):
    user = User.query.get_or_404(user_id)
    qr_code_image = user.generate_qr_code()
    return send_file(qr_code_image, mimetype='image/png')


@main_bp.route('/download_resume/<int:application_id>')
@login_required
def download_resume(application_id):
    application = Application.query.get_or_404(application_id)
    if application.resume:
        return send_file(f'static/{application.resume}', as_attachment=True)
    else:
        flash('No resume found for this application.', 'danger')
        return redirect(url_for('main.index'))
