from flask import Flask
import json
from flask_cors import CORS
import requests
import os
from flask import request
from waitress import serve

import signup_user
import login_user
import spaces_user
import tasks_user
import note_user
import calendar_user
import account_user

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "DevNote V 1.0.1"

@app.route("/signup", methods=['POST'])
def signup():
    user_info = request.json

    email = user_info["email"].lower()
    username = user_info["username"].lower()
    password = user_info["password"]

    codingstyle = "atom_dark"
    if email and username and password:
        signup_info = signup_user.user_signup(email,username,password,codingstyle)
        return json.dumps(signup_info)
    else:
        return json.dumps({"code":"Please fill out all fields"})

@app.route("/login", methods=['POST'])
def login():
    user_info = request.json
    username = user_info["username"].lower()
    password = user_info["password"]

    if username and password:
        login_info = login_user.user_login(username,password)
        return json.dumps(login_info)
    else:
        return json.dumps({"code":"Please fill out all fields"})

@app.route("/get_spaces")
def get_spaces():
    uid = request.args.get('uid',type=str)
    if uid:
        spaces = spaces_user.get_spaces(uid)
        return json.dumps(spaces)
    else:
        return json.dumps({"code":"Failed to get spaces"})

@app.route("/add_space")
def add_spaces():
    uid = request.args.get('uid',type=str)
    name = request.args.get('name',type=str)

    if uid and name:
        code = spaces_user.add_space(uid,name)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to add space"})

@app.route("/delete_space")
def delete_spaces():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)

    if uid and sid:
        code = spaces_user.delete_space(uid,sid)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to delete space"})


@app.route("/get_space_name_space")
def get_space_name_space():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)

    if uid and sid:
        space_info = spaces_user.get_space_name(uid,sid)
        print(space_info)
        return json.dumps(space_info)
    else:
        return json.dumps({"code":"Failed to delete space"})

@app.route("/get_tasks")
def get_tasks():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)

    if uid and sid:
        tasks = tasks_user.get_task(uid,sid)
        return json.dumps(tasks)
    else:
        return json.dumps({"code":"Failed to get tasks"})

@app.route("/add_task", methods=['POST'])
def add_task():
    add_task_request = request.json

    uid = add_task_request["uid"]
    name = add_task_request["name"]
    sid = add_task_request["sid"]
    content = add_task_request["content"]
    date = add_task_request["date"]
    progress = add_task_request["progress"]

    if uid and name and sid:
        code = tasks_user.add_task(uid,sid,name,content,date,progress)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to add task"})

@app.route("/get_task_progress")
def get_task_progress():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    tid = request.args.get('tid',type=str)

    if uid and sid and tid:
        progress_info = tasks_user.get_progress(uid,sid,tid)
        return json.dumps(progress_info)
    else:
        return json.dumps({"code":"Failed to get progress"})


@app.route("/get_task_info")
def get_task_info():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    tid = request.args.get('tid',type=str)

    if uid and sid and tid:
        task_info = tasks_user.get_task_info(uid,sid,tid)
        return json.dumps(task_info)
    else:
        return json.dumps({"code":"failed to get task info"})

@app.route("/edit_task", methods=['POST'])
def edit_task():
    edit_task_request = request.json

    uid = edit_task_request["uid"]
    name = edit_task_request["name"]
    sid = edit_task_request["sid"]
    content = edit_task_request["content"]
    date = edit_task_request["date"]
    progress = edit_task_request["progress"]
    tid = edit_task_request["tid"]

    if uid and name and sid and tid:
        code = tasks_user.edit_task(uid,sid,name,content,date,progress,tid)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to edit task"})


@app.route("/view_task")
def view_task():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    tid = request.args.get('tid',type=str)

    if uid and sid and tid:
        task_info = tasks_user.view_task(uid,sid,tid)
        return json.dumps(task_info)
    else:
        return json.dumps({"code":"failed to get task info"})

@app.route("/delete_task")
def delete_task():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    tid = request.args.get('tid',type=str)

    if uid and sid and tid:
        code = tasks_user.delete_task(uid,sid,tid)
        return json.dumps(code)
    else:
        return json.dumps({"code":"failed to get task info"})

@app.route("/get_notes")
def get_notes():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)

    if uid and sid:
        notes = note_user.get_notes(uid,sid)
        return json.dumps(notes)
    else:
        return json.dumps({"code":"Failed to get note"})

@app.route("/add_note", methods=['POST'])
def add_note():
    add_note_request = request.json

    uid = add_note_request["uid"]
    name = add_note_request["name"]
    sid = add_note_request["sid"]
    content = add_note_request["content"]

    if uid and name and sid:
        code = note_user.add_note(uid,sid,name,content)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to add note"})

@app.route("/get_note_info")
def get_note_info():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    nid = request.args.get('nid',type=str)

    if uid and sid and nid:
        note_info = note_user.get_note_info(uid,sid,nid)
        return json.dumps(note_info)
    else:
        return json.dumps({"code":"failed to get note info"})

@app.route("/edit_note", methods=['POST'])
def edit_note():
    edit_note_request = request.json

    uid = edit_note_request["uid"]
    name = edit_note_request["name"]
    sid = edit_note_request["sid"]
    content = edit_note_request["content"]
    nid = edit_note_request["nid"]

    if uid and name and sid and nid:
        code = note_user.edit_note(uid,sid,name,content,nid)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to note task"})


@app.route("/view_note")
def view_note():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    nid = request.args.get('nid',type=str)

    if uid and sid and nid:
        note_info = note_user.view_note(uid,sid,nid)
        return json.dumps(note_info)
    else:
        return json.dumps({"code":"failed to get note info"})

@app.route("/delete_note")
def delete_note():
    uid = request.args.get('uid',type=str)
    sid = request.args.get('sid',type=str)
    nid = request.args.get('nid',type=str)

    if uid and sid and nid:
        code = note_user.delete_note(uid,sid,nid)
        return json.dumps(code)
    else:
        return json.dumps({"code":"failed to get note info"})

@app.route("/get_tasks_calendar")
def get_tasks_calendar():
    uid = request.args.get('uid',type=str)

    if uid:
        tasks = calendar_user.get_tasks(uid)
        return json.dumps(tasks)
    else:
        return json.dumps({"code":"failed to get tasks for calendar"})

@app.route("/get_user_info")
def get_user_info():
    uid = request.args.get('uid',type=str)

    if uid:
        user_info = account_user.get_user_info(uid)
        return json.dumps(user_info)
    else:
        return json.dumps({"code":"failed to get user info"})

@app.route("/get_coding_style")
def get_coding_style():
    uid = request.args.get('uid',type=str)

    if uid:
        codingstyle_info = account_user.get_coding_style(uid)
        return json.dumps(codingstyle_info)
    else:
        return json.dumps({"code":"failed to get coding style info"})

@app.route("/update_coding_style")
def update_coding_style():
    uid = request.args.get('uid',type=str)
    codingstyle = request.args.get('codingstyle',type=str)

    if uid and codingstyle:
        code = account_user.update_coding_style(uid,codingstyle)
        return json.dumps(code)
    else:
        return json.dumps({"code":"failed to update coding style"})

@app.route("/update_password", methods=['POST'])
def update_password():
    user_info = request.json
    uid = user_info["uid"]
    password = user_info["password"]
    if uid and password:
        code = account_user.update_password(uid,password)
        return json.dumps(code)
    else:
        return json.dumps({"code":"Failed to update password"})

if __name__ == "__main__":
    serve(app, host="0.0.0.0", port=5000)
