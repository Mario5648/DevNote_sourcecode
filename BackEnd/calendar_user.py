import mysql.connector
import hashlib
import os
def connect_database():
    mydb = mysql.connector.connect(user="devmario", password=str(os.environ['DB_PASS']), host=str(os.environ['DB_SERVER_HOST']), port=3306, database=str(os.environ['DB_NAME']), ssl_ca="./DigiCertGlobalRootCA.crt.pem", ssl_disabled=False)
    return mydb

def check_date(date):
    if date == "1000-01-01":
        return False
    return True

def get_tasks(uid):
    mydb = connect_database()
    mycursor = mydb.cursor()

    sql_string = "SELECT name,tid,date FROM tasks WHERE uid = %(uid)s"
    variables = {"uid":uid}

    mycursor.execute(sql_string,variables)
    myresult = mycursor.fetchall()

    tasks_info = {}
    count = 0
    for index,info in enumerate(myresult):
        if check_date(str(info[2])):
            tasks_info[count] = {"name":info[0],"tid":info[1],"date":str(info[2])}
            count += 1

    tasks_info["code"] = "Success"
    tasks_info["num_tasks"] = count;

    mycursor.close()
    mydb.close()
    return tasks_info
