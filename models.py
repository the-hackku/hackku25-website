from create_app import db
import qrcode
import io

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), nullable=False, unique=True)
    username = db.Column(db.String(150), nullable=True, unique=True)
    password = db.Column(db.String(150), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='hacker')

    def generate_qr_code(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr_data = str(self.id)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill='black', back_color='white')
        buf = io.BytesIO()
        img.save(buf)
        buf.seek(0)
        return buf
    
class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    full_name = db.Column(db.String(150), nullable=False)
    school = db.Column(db.String(150), nullable=False)
    major = db.Column(db.String(150), nullable=False)
    level_of_study = db.Column(db.String(50), nullable=False)
    year_of_study = db.Column(db.String(50), nullable=False)
    hackathons_attended = db.Column(db.Integer, nullable=False)
    skills = db.Column(db.Text, nullable=True)
    project_ideas = db.Column(db.Text, nullable=True)
    motivation = db.Column(db.Text, nullable=True)
    resume = db.Column(db.String(150), nullable=True)
    linkedin = db.Column(db.String(150), nullable=True)
    github = db.Column(db.String(150), nullable=True)
    portfolio = db.Column(db.String(150), nullable=True)
    application_status = db.Column(db.String(50), nullable=False, default='Pending')
    reviewed_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    user = db.relationship('User', foreign_keys=[user_id], backref=db.backref('application', uselist=False))
    reviewer = db.relationship('User', foreign_keys=[reviewed_by])


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)

class CheckIn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())
    scanned_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', foreign_keys=[user_id])
    event = db.relationship('Event', foreign_keys=[event_id])
    scanner = db.relationship('User', foreign_keys=[scanned_by])
