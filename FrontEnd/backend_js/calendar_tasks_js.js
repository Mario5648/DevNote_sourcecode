//[{title: 'All Day Event',start: '2021-11-01'}]

function request_tasks_calendar(){
  check_login();
  let tasks = []
  let uid = sessionStorage.getItem("DevNote_uid");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_tasks_calendar?uid=${uid}`)
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
        for(let index = 0 ; index < data["num_tasks"]; index+=1)
        {
          tasks.push({title:data[index]["name"],start:data[index]["date"]});
        }
        sessionStorage.setItem("DevNote_calendar_tasks", JSON.stringify(tasks));
        location.replace("./DevNote_calendar_page.html");
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

}
