# views/application.py
from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from models import db, Application

application_bp = Blueprint('application', __name__)

@application_bp.route('/apply', methods=['GET', 'POST'])
def apply():
    if request.method == 'POST':
        user_id = session.get('user_id')
        if not user_id:
            flash('You need to be logged in to apply.', 'danger')
            return redirect(url_for('main.login'))
        
        # Get form data
        full_name = request.form['full_name']
        school = request.form['school']
        major = request.form['major']
        level_of_study = request.form['level_of_study']
        year_of_study = request.form['year_of_study']
        hackathons_attended = request.form['hackathons_attended']
        skills = request.form['skills']
        project_ideas = request.form['project_ideas']
        motivation = request.form['motivation']
        linkedin = request.form['linkedin']
        github = request.form['github']
        portfolio = request.form['portfolio']
        
        # Handle file upload
        resume = None
        if 'resume' in request.files:
            resume_file = request.files['resume']
            resume = f'resumes/{resume_file.filename}'
            resume_file.save(f'static/{resume}')
        
        # Create and save application
        application = Application(
            user_id=user_id,
            full_name=full_name,
            school=school,
            major=major,
            level_of_study=level_of_study,
            year_of_study=year_of_study,
            hackathons_attended=hackathons_attended,
            skills=skills,
            project_ideas=project_ideas,
            motivation=motivation,
            resume=resume,
            linkedin=linkedin,
            github=github,
            portfolio=portfolio
        )
        db.session.add(application)
        db.session.commit()
        
        flash('Application submitted successfully!', 'success')
        return redirect(url_for('main.index'))
    
    return render_template('application_form.html')
