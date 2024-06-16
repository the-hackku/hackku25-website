from create_app import create_app

app = create_app()
app.config['DEBUG'] = True
app.config['TEMPLATES_AUTO_RELOAD'] = True
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
