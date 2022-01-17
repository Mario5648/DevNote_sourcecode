import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def get_spaces(uid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT * FROM spaces WHERE uid = %(uid)s"
    variables = {"uid":uid}
    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    spaces_info = {}
    for index,info in enumerate(myresult):
        spaces_info[index] = {"name":info[1],"sid":info[2]}

    spaces_info["code"] = "Success"
    spaces_info["num_spaces"] = len(myresult);

    mycursor.close()
    mydb.close()
    return spaces_info

def delete_space(uid,sid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "DELETE FROM spaces WHERE uid=%(uid)s AND sid=%(sid)s"
    values = {"uid":uid,"sid":sid}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}

def generate_sid(uid,name):
    combined_inputs = str(uid)+str(name)
    sid = hashlib.sha256(combined_inputs.encode('utf-8')).hexdigest()
    return sid

def check_space_names(mycursor,uid,name):
    sql_string = "SELECT uid,name FROM spaces WHERE uid=%(uid)s AND name=%(name)s"
    values = {"uid":uid,"name":name}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    if myresult:
        return True
    return False

def add_space(uid,name):
    mydb = connect_database()
    mycursor = mydb.cursor()

    if check_space_names(mycursor,uid,name):
        mycursor.close()
        mydb.close()
        return {"code":"Name_in_use"}

    sid = generate_sid(uid,name)
    sql_string = "INSERT INTO spaces (uid,name,sid) VALUES(%(uid)s, %(name)s, %(sid)s)"
    values = {"uid":uid,"name":name,"sid":sid}

    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}

def get_space_name(uid,sid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,sid,name FROM spaces WHERE uid=%(uid)s AND sid=%(sid)s"
    values = {"uid":uid,"sid":sid}
    mycursor.execute(sql_string,values)
    myresult = mycursor.fetchall()
    spaces_info = {}
    for index,info in enumerate(myresult):
        spaces_info[index] = {"name":info[2]}
    spaces_info["code"] = "Success"
    mycursor.close()
    mydb.close()
    return spaces_info
