import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def generate_nid(uid,sid,name):
    combined_inputs = str(uid)+str(sid)+str(name)
    nid = hashlib.sha256(combined_inputs.encode('utf-8')).hexdigest()
    return nid

def check_note_names(mycursor,uid,sid,name):
    sql_string = "SELECT uid,sid,name FROM notes WHERE uid=%(uid)s AND sid = %(sid)s AND name=%(name)s"
    values = {"uid":uid,"sid":sid,"name":name}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    if myresult:
        return True
    return False

def check_content(content):
    if content:
        return content
    else:
        return ""

def add_note(uid,sid,name,content):
    mydb = connect_database()
    mycursor = mydb.cursor()

    if check_note_names(mycursor,uid,sid,name):
        mycursor.close()
        mydb.close()
        return {"code":"Name_in_use"}

    nid = generate_nid(uid,sid,name)
    content = check_content(content)

    sql_string = "INSERT INTO notes (uid,name,sid,nid,content) VALUES(%(uid)s, %(name)s, %(sid)s,%(nid)s,%(content)s)"
    values = {"uid":uid,"name":name,"sid":sid,"nid":nid,"content":content}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}

def get_notes(uid,sid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT name,nid FROM notes WHERE uid = %(uid)s AND sid = %(sid)s"
    variables = {"uid":uid,"sid":sid}

    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    notes_info = {}
    for index,info in enumerate(myresult):
        notes_info[index] = {"name":info[0],"nid":info[1]}

    notes_info["code"] = "Success"
    notes_info["num_notes"] = len(myresult);

    mycursor.close()
    mydb.close()
    return notes_info
def delete_note(uid,sid,nid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "DELETE FROM notes WHERE uid=%(uid)s AND sid=%(sid)s AND nid=%(nid)s"
    values = {"uid":uid,"sid":sid,"nid":nid}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}


def check_note_names_edit(mycursor,uid,sid,name,nid):
    sql_string = "SELECT uid,sid,name,nid FROM notes WHERE uid=%(uid)s AND sid = %(sid)s AND name=%(name)s"
    values = {"uid":uid,"sid":sid,"name":name}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    print(myresult)
    for index,info in enumerate(myresult):
        if str(info[3]) != str(nid):
            return True
    return False

def edit_note(uid,sid,name,content,nid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    if check_note_names_edit(mycursor,uid,sid,name,nid):
        mycursor.close()
        mydb.close()
        return {"code":"Name_in_use"}

    content = check_content(content)

    sql_string = "UPDATE notes SET name = %(name)s , content = %(content)s WHERE uid = %(uid)s AND sid = %(sid)s AND nid = %(nid)s"
    values = {"uid":uid,"name":name,"sid":sid,"nid":nid,"content":content}
    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}
def view_note(uid,sid,nid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT * FROM notes WHERE uid = %(uid)s AND sid = %(sid)s AND nid = %(nid)s"
    values = {"uid":uid,"sid":sid,"nid":nid}
    mycursor.execute(sql_string,values)

    myresult = mycursor.fetchall()

    notes_info = {}
    for index,info in enumerate(myresult):
        notes_info[index] = {"name":info[1],"content":info[4]}

    notes_info["code"] = "Success"

    mydb.commit()
    mycursor.close()
    mydb.close()
    return notes_info

def get_note_info(uid,sid,nid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,sid,nid,content,name FROM notes WHERE uid = %(uid)s AND sid = %(sid)s AND nid = %(nid)s"
    variables = {"uid":uid,"sid":sid,"nid":nid}
    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    note_info = {}
    for index,info in enumerate(myresult):
        note_info[index] = {"content":info[3],"name":info[4]}

    note_info["code"] = "Success"
    mycursor.close()
    mydb.close()
    return note_info
