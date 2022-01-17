function get_spaces()
{
  check_login();
  let uid = sessionStorage.getItem("DevNote_uid");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_spaces?uid=${uid}`)
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
        display_spaces(data);
      }

    }
  }
}

function check_name(name)
{
  if(name.length > 0 && name.length <=255)
  {
    return true;
  }
  alert("Space name should be greater than 1 character and less than 255 characters");
  return false;
}
function add_space_modal()
{
  // Get the modal
  var modal = document.getElementById("modal_add_space");

  // Get the button that opens the modal
  var btn = document.getElementById("add_space");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  //open modal on button click
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }
}
function add_spaces()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let name = document.getElementById("space_name").value;
  if(check_name(name))
  {
    const xhr = new XMLHttpRequest()
    //open a get request with the remote server URL
    xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/add_space?uid=${uid}&name=${name}`)
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

        }else if(data["code"] == "Name_in_use")
        {
          alert("Name in use. Please use another name.");
        }

      }
    }
  }
}


function display_spaces(data)
{

  var table = $('#space_list').DataTable();

  table.clear().draw();

  var table = $('#space_list').DataTable();

  for(let index = 0 ; index < data["num_spaces"]; index+=1)
  {
    let name = data[index]["name"];
    let view_button = `<center><button onclick="view_space('${data[index]["sid"]}')" class="view_button">View</button></center>`;
    let delete_button = `<center><button onclick="delete_space('${data[index]["sid"]}')" class="delete_button">Delete</button></center>`;
    table.row.add([name,view_button,delete_button]).draw();
  }

}

function delete_space(sid)
{
  let uid = sessionStorage.getItem("DevNote_uid");
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/delete_space?uid=${uid}&sid=${sid}`)
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

function view_space(sid)
{
  let uid = sessionStorage.getItem("DevNote_uid");
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_space_name_space?uid=${uid}&sid=${sid}`)
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
        sessionStorage.setItem("DevNote_space_name", data[0]['name']);
        sessionStorage.setItem("DevNote_sid", sid);
        location.replace("./DevNote_space_option_page.html")
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
