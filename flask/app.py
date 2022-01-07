from flask import Flask

app = Flask(__name__)


@app.route('/flask', methods=['GET'])
def index():
    return 'This is my first API Call'


if __name__ == '__main__':
    app.run(debug=True)
