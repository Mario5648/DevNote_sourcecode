import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb


def get_user_info(uid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,username,email FROM users WHERE uid = %(uid)s"
    variables = {"uid":uid}
    mycursor.execute(sql_string,variables)

    myresult = mycursor.fetchall()
    if myresult:
        username = myresult[0][1]
        email = myresult[0][2]


    mycursor.close()
    mydb.close()
    return {"code":"Success","username":username,"email":email}

def get_coding_style(uid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT uid,codingstyle FROM users WHERE uid = %(uid)s"
    variables = {"uid":uid}
    mycursor.execute(sql_string,variables)

    myresult = mycursor.fetchall()
    if myresult:
        codingstyle = myresult[0][1]

    mycursor.close()
    mydb.close()
    return {"code":"Success","codingstyle":codingstyle}

def update_coding_style(uid,codingstyle):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "UPDATE users SET codingstyle = %(codingstyle)s WHERE uid = %(uid)s"
    values = {"uid":uid,"codingstyle":codingstyle}
    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def update_password(uid,password):
    mydb = connect_database()
    mycursor = mydb.cursor()

    password = hash_password(password)
    sql_string = "UPDATE users SET password = %(password)s WHERE uid = %(uid)s"
    values = {"uid":uid,"password":password}
    mycursor.execute(sql_string,values)

    mydb.commit()
    mycursor.close()
    mydb.close()
    return {"code":"Success"}
