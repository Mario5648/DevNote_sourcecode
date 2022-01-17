function set_cache(uid,codingstyle,username)
{
  sessionStorage.setItem("DevNote_uid", uid);
  sessionStorage.setItem("DevNote_codingstyle", codingstyle);
  sessionStorage.setItem("DevNote_username", username);
}


function login_request()
{
  let username = document.getElementById("username").value;
  let password = document.getElementById("user_password").value;

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/login`)
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
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

//Check if a user is logged in
function check_login()
{

    let uid = sessionStorage.getItem("DevNote_uid");
    let cs = sessionStorage.getItem("DevNote_codingstyle");
    let username = sessionStorage.getItem("DevNote_username");
    if(uid && cs && username)
    {
      location.replace("./DevNote_home.html")
    }

}
