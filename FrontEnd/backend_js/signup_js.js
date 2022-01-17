function set_cache(uid,codingstyle,username)
{
  sessionStorage.setItem("DevNote_uid", uid);
  sessionStorage.setItem("DevNote_codingstyle", codingstyle);
  sessionStorage.setItem("DevNote_username", username);
}

function check_password()
{
  if (document.getElementById("user_password").value == document.getElementById("user_confirm_password").value)
  {
    return true;
  }
  return false;
}

function check_fields()
{
  let username = document.getElementById("username").value;
  let email = document.getElementById("user_email").value;
  let password = document.getElementById("user_password").value;
  let c_password = document.getElementById("user_confirm_password").value;

  if(!(username.length > 3 && username.length <= 25))
  {
    alert("Username must be greater than 3 characters and less than 25 characters");
    return false;
  }
  if(!(email.length > 2 && email.length <= 255))
  {
    alert("Email must be greater than 2 characters and less than 255 character");
    return false;
  }
  if(!(password.length > 7))
  {
    alert("Password must be greater than 7 characters");
    return false;
  }
  if(!(c_password.length > 7))
  {
    alert("Confirmation password must match password and be greater than 7 characters");
    return false;
  }

  return true;

}
function signup_request()
{
  let field_check_status = check_fields();
  if(field_check_status == false)
  {
    return;
  }

  let password_check_status = check_password();
  if(password_check_status == false)
  {
    alert("Your passwords must match.");
    return;
  }

  let email = document.getElementById("user_email").value;
  let username = document.getElementById("username").value;
  let password = document.getElementById("user_password").value;

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/signup`)
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      email: email,
      username: username,
      password: password,
  }));
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      if (data["code"] == "Success")
      {
        set_cache(data["uid"],data["codingstyle"],username)
        location.replace("./DevNote_home.html")
      }

    }
  }

}
