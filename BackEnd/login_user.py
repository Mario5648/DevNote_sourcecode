import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def check_valid_credentials(mycursor,username,password):
    sql_string = "SELECT uid,username, password, codingstyle FROM users WHERE username = %(username)s AND password = %(password)s"
    variables = {"username":username,"password":password}
    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    if myresult:
        uid = myresult[0][0]
        codingstyle = myresult[0][3]
        return [True,uid,codingstyle]
    return [False,None]

def user_login(username,password):
    mydb = connect_database()
    mycursor = mydb.cursor()
    password = hash_password(password)
    valid = check_valid_credentials(mycursor,username,password)
    if valid[1]:
        uid = valid[1]
        codingstyle = valid[2]
        mycursor.close()
        mydb.close()
        return {"code":"Success","uid":uid,"codingstyle":codingstyle}
    else:
        mycursor.close()
        mydb.close()
        return {"code":"Invalid Credentials"}
