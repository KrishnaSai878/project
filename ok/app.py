from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("in.html")  # For the homepage

@app.route("/laptops")
def laptops():
    return render_template("la.html")  # For laptops page

@app.route("/about")
def about():
    return render_template("ab.html")  # For about page

if __name__ == "__main__":
    app.run(debug=True)
