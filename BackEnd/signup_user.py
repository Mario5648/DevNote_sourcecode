import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def generate_user_id(email, username, password):
    combined_inputs = str(email)+str(username)+str(password)
    user_id = hashlib.sha256(combined_inputs.encode('utf-8')).hexdigest()
    return user_id

def check_unique(mycursor,email,username):
    #check email
    mycursor.execute("SELECT email FROM users WHERE email = %(email)s",{'email':email})
    myresult = mycursor.fetchall()
    if myresult:
        return [False,"Email is in use"]
    #check username
    mycursor.execute("SELECT username FROM users WHERE username = %(username)s",{'username':username})
    myresult = mycursor.fetchall()
    if myresult:
        return [False,"Username is in use"]

    return [True,None]

def hash_password(password):
    return hashlib.sha256(password.encode('utf-8')).hexdigest()

def check_valid_input(email,username):
    if len(email) > 255:
        return [False,"Email exceeds character limit (255)"]
    if len(username) > 25:
        return [False,"Username exceeds character limit (25)"]
    return [True,None]

def user_signup(email,username,password,codingstyle):
    mydb = connect_database()
    mycursor = mydb.cursor()

    password = hash_password(password)
    uid = generate_user_id(email,username,password)
    unique_status = check_unique(mycursor,email,username)

    if unique_status[0] == False:
        return unique_status[1]
    valid_input_status = check_valid_input(email,username)

    if valid_input_status[0] == False:
        return valid_input_status[1]
    try:
        sql_string = "INSERT INTO users (uid,email,username,password,codingstyle) VALUES (%(uid)s, %(email)s, %(username)s, %(password)s,%(codingstyle)s)"
        vals = {"uid":uid,"email":email,"username":username,"password":password,"codingstyle":codingstyle}
        mycursor.execute(sql_string,vals)
        mydb.commit()
        mycursor.close()
        mydb.close()
        return {"code":"Success","uid":uid,"codingstyle":codingstyle}
    except e as Exception:
        mycursor.close()
        mydb.close()
        return {"code":"Failed to Sign up! Please try again later."}
