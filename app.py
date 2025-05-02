from flask import Flask, render_template, jsonify, request
# from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
todos = []

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/todos", methods=["GET", "POST", "DELETE"])
def handle_todos():
    global todos
    
    if request.method == "GET":
        return jsonify(todos)

    elif request.method == "POST":
        data = request.get_json()
        if "id" in data and "text" in data:
            data["completed"] = data.get("completed",False)
            todos.append(data)
            return jsonify({"status":"added","id":data["id"]}),200
        # handling toggle
        elif "id" in data and "completed" in data:
            for todo in todos:
                if todo["id"] == data["id"]:
                    return jsonify({"status":"updated"}),200
            return jsonify({"error":"Todo no found"}),404
        else :
            return jsonify({"error":"Invalid data"}),400
    elif request.method == "DELETE":
        data = request.get_json()
        todos = [todo for todo in todos if todo["id"] != data.get("id")]
        return jsonify({"status":"deleted"}),200

if __name__ == "__main__":
    app.run(debug=True)
