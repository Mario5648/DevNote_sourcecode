function load_user_data()
{
  check_login();
  let username = sessionStorage.getItem("DevNote_username");

  document.getElementById("welcome_message").innerHTML = `Welcome ${username}`
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

}
