function get_user_info()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_user_info?uid=${uid}`)
  //send the Http request
  xhr.send()
  //EVENT HANDLERS
  //triggered when the response is completed
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      if (data["code"] == "Success")
      {
        load_user_info();
        document.getElementById("user_name").value = data["username"];
        document.getElementById("user_email").value = data["email"];

      }

    }
  }
}

function get_coding_style_info()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_coding_style?uid=${uid}`)
  //send the Http request
  xhr.send()
  //EVENT HANDLERS
  //triggered when the response is completed
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      if (data["code"] == "Success")
      {
        load_user_preferences();
        document.getElementById("code_theme").value = data["codingstyle"];
        update_display_code_onload();
      }

    }
  }
}

function update_coding_style()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let coding_style = document.getElementById("code_theme").value;
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/update_coding_style?uid=${uid}&codingstyle=${coding_style}`)
  //send the Http request
  xhr.send()
  //EVENT HANDLERS
  //triggered when the response is completed
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      if (data["code"] == "Success")
      {
        location.reload();
      }

    }
  }
}
function check_password(password)
{
  if (document.getElementById("new_password").value == document.getElementById("new_password_confirm").value)
  {
    if(!(password.length > 7))
    {
      alert("Password must be greater than 7 characters");
      return false;
    }else{return true;}
  }
  return false;
}
function update_user_password()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let password = document.getElementById("new_password").value;
  if(!check_password(password))
  {
    return;
  }
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/update_password`)
  //open a get request with the remote server URL
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      uid: uid,
      password: password
  }));
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      if (data["code"] == "Success")
      {
        alert("Successfully updated password!");
        location.reload();
      }

    }
  }
}


//Check if a user is logged in
function check_login()
{

    let uid = sessionStorage.getItem("DevNote_uid");
    let username = sessionStorage.getItem("DevNote_username");
    if(!uid && !username)
    {
      location.replace("./DevNote_login.html")
    }
    get_user_info();

}
