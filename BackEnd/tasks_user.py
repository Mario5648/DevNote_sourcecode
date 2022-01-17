import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def generate_tid(uid,sid,name):
    combined_inputs = str(uid)+str(sid)+str(name)
    tid = hashlib.sha256(combined_inputs.encode('utf-8')).hexdigest()
    return tid


def check_tasks_names(mycursor,uid,sid,name):
    sql_string = "SELECT uid,sid,name FROM tasks WHERE uid=%(uid)s AND sid = %(sid)s AND name=%(name)s"
    values = {"uid":uid,"sid":sid,"name":name}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    if myresult:
        return True
    return False

def check_date(date):
    if date:
        return date
    else:
        return "1000-01-01"
def check_progress(progress):
    if progress:
        return progress
    else:
        return ""
def check_content(content):
    if content:
        return content
    else:
        return ""

def add_task(uid,sid,name,content,date,progress):
    mydb = connect_database()
    mycursor = mydb.cursor()

    if check_tasks_names(mycursor,uid,sid,name):
        mycursor.close()
        mydb.close()
        return {"code":"Name_in_use"}

    tid = generate_tid(uid,sid,name)
    date = check_date(date)
    print(date)
    progress = check_progress(progress)
    content = check_content(content)

    sql_string = "INSERT INTO tasks (uid,name,sid,tid,content,date,progress) VALUES(%(uid)s, %(name)s, %(sid)s,%(tid)s,%(content)s,%(date)s,%(progress)s)"
    values = {"uid":uid,"name":name,"sid":sid,"tid":tid,"content":content,"date":date,"progress":progress}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}

def view_task(uid,sid,tid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT * FROM tasks WHERE uid = %(uid)s AND sid = %(sid)s AND tid = %(tid)s"
    values = {"uid":uid,"sid":sid,"tid":tid}
    mycursor.execute(sql_string,values)

    myresult = mycursor.fetchall()

    tasks_info = {}
    for index,info in enumerate(myresult):
        tasks_info[index] = {"name":info[1],"content":info[4],"date":str(info[5]),"progress":info[6]}

    tasks_info["code"] = "Success"

    mydb.commit()
    mycursor.close()
    mydb.close()
    return tasks_info
def get_task(uid,sid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT name,tid,progress FROM tasks WHERE uid = %(uid)s AND sid = %(sid)s"
    variables = {"uid":uid,"sid":sid}

    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    tasks_info = {}
    for index,info in enumerate(myresult):
        tasks_info[index] = {"name":info[0],"tid":info[1],"progress":info[2]}

    tasks_info["code"] = "Success"
    tasks_info["num_tasks"] = len(myresult);

    mycursor.close()
    mydb.close()
    return tasks_info

def get_progress(uid,sid,tid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,sid,tid,progress FROM tasks WHERE uid = %(uid)s AND sid = %(sid)s AND tid = %(tid)s"
    variables = {"uid":uid,"sid":sid,"tid":tid}
    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    progress_info = {}
    for index,info in enumerate(myresult):
        progress_info[index] = {"progress":info[3]}

    if progress_info[0]["progress"] != "":
        progress_info["code"] = "Success"
    else:
        progress_info["code"] = "Failure"


    mycursor.close()
    mydb.close()
    return progress_info

def get_task_info(uid,sid,tid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,sid,tid,content,name,date FROM tasks WHERE uid = %(uid)s AND sid = %(sid)s AND tid = %(tid)s"
    variables = {"uid":uid,"sid":sid,"tid":tid}
    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    task_info = {}
    for index,info in enumerate(myresult):
        task_info[index] = {"content":info[3],"name":info[4],"date":str(info[5])}

    task_info["code"] = "Success"
    mycursor.close()
    mydb.close()
    return task_info

def check_tasks_names_edit(mycursor,uid,sid,name,tid):
    sql_string = "SELECT uid,sid,name,tid FROM tasks WHERE uid=%(uid)s AND sid = %(sid)s AND name=%(name)s"
    values = {"uid":uid,"sid":sid,"name":name}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    for index,info in enumerate(myresult):
        if str(info[3]) != str(tid):
            return True
    return False

def edit_task(uid,sid,name,content,date,progress,tid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    if check_tasks_names_edit(mycursor,uid,sid,name,tid):
        mycursor.close()
        mydb.close()
        return {"code":"Name_in_use"}

    date = check_date(date)
    progress = check_progress(progress)
    content = check_content(content)

    sql_string = "UPDATE tasks SET name = %(name)s , content = %(content)s, date = %(date)s, progress = %(progress)s WHERE uid = %(uid)s AND sid = %(sid)s AND tid = %(tid)s"
    values = {"uid":uid,"name":name,"sid":sid,"tid":tid,"content":content,"date":date,"progress":progress}
    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}


def delete_task(uid,sid,tid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "DELETE FROM tasks WHERE uid=%(uid)s AND sid=%(sid)s AND tid=%(tid)s"
    values = {"uid":uid,"sid":sid,"tid":tid}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}
