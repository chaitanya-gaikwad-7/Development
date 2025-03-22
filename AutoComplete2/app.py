from flask import Flask, render_template, request, jsonify
import os
import json

app = Flask(__name__)

# Save location
SAVE_DIRECTORY = r"E:\study\website\AutoComplete2\user_data"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    
    user_id = data.get('userId')
    email = data.get('email')
    selections = data.get('selections')

    if not user_id or not email or not selections:
        return jsonify({'status': 'fail', 'message': 'Missing data!'}), 400

    content = f"User ID: {user_id}\nEmail: {email}\nSelections:\n"
    content += "\n".join(selections)

    file_name = f"{user_id}_new.txt"
    file_path = os.path.join(SAVE_DIRECTORY, file_name)

    try:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return jsonify({'status': 'success', 'message': 'Data saved!'}), 200
    except Exception as e:
        print(f"Error saving file: {e}")
        return jsonify({'status': 'fail', 'message': 'Server error!'}), 500

if __name__ == '__main__':
    app.run(debug=True)
