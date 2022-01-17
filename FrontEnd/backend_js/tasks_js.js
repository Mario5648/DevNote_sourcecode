var quill = new Quill('#editor-container', {
  modules: {
    syntax: true,
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],,
      ['bold', 'italic', 'underline','strike'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      [{ 'font': [] }],
      [{ 'align': [] }]
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});

var quilledit = new Quill('#editor-container_edit_task', {
  modules: {
    syntax: true,
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],,
      ['bold', 'italic', 'underline','strike'],
      ['link'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['code-block'],
      [{ 'font': [] }],
      [{ 'align': [] }]
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});

function get_tasks()
{
  check_login();
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let space_name = sessionStorage.getItem("DevNote_space_name");

  document.getElementById("todo_path").innerHTML = `${space_name} > To-Do`;
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_tasks?uid=${uid}&sid=${sid}`)
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
        display_tasks(data);
      }
      get_coding_style_preference();
    }
  }
}


function display_tasks(data)
{

  var table = $('#to-do_list').DataTable();

  table.clear().draw();

  var table = $('#to-do_list').DataTable();

  for(let index = 0 ; index < data["num_tasks"]; index+=1)
  {
    let name = data[index]["name"];
    let progress = `<center><p class="${data[index]["progress"]}_progress">${data[index]["progress"]}</p></center>`;
    let details_button = `<center><a onclick="open_details('${data[index]["tid"]}')" class="edit_button"><i class="fa fa-edit"></i></a></center>`;
    table.row.add([name,progress,details_button]).draw();
  }
}

function get_coding_style_preference()
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
        populate_coding_style(data["codingstyle"]);
      }

    }
  }
}


function populate_coding_style(codingstyle)
{

  switch(codingstyle)
  {
    case 'light':
    document.getElementById("coding_style_user_preference").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/a11y-light.css"> `
    break;
    case 'agate':
    document.getElementById("coding_style_user_preference").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/agate.css"> `
    break;
    case 'atom_dark':
    document.getElementById("coding_style_user_preference").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-dark.css"> `
    break;
    case 'atom_light':
    document.getElementById("coding_style_user_preference").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-light.css"> `
    break;
    case 'vs_2015':
    document.getElementById("coding_style_user_preference").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/vs2015.css"> `
    break;
  }
}

function check_name(name)
{
  if(name.length > 0 && name.length <=255)
  {
    return true;
  }
  alert("Task name should be greater than 1 character and less than 255 characters");
  return false;
}

function add_task()
{

  let uid = sessionStorage.getItem("DevNote_uid");
  let name = document.getElementById("task_name").value;
  let sid  = sessionStorage.getItem("DevNote_sid");
  let content = quill.root.innerHTML;
  let date = document.getElementById("due_date").value;
  let progress = null;
  var radios = document.getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
      if (radios[i].type === 'radio' && radios[i].checked) {
          // get value, set checked flag or do whatever you need to
          progress = radios[i].value;
          radios[i].checked = false;
          break;
      }
  }
  if (!check_name(name))
  {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/add_task`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      uid: uid,
      name: name,
      sid: sid,
      content:content,
      date: date,
      progress: progress
  }));

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

function get_progres(uid,sid,tid,option)
{
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_task_progress?uid=${uid}&sid=${sid}&tid=${tid}`)
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
        if(option == "details")
        {
          document.getElementById(`${data[0]["progress"]}_option`).checked = true;
        }else if(option == "edit")
        {
          document.getElementById(`${data[0]["progress"]}_option_edit`).checked = true;
        }
      }else
      {
        var radios = document.getElementsByTagName('input');
        for (var i = 0; i < radios.length; i++) {
            if (radios[i].type === 'radio' && radios[i].checked) {
                // get value, set checked flag or do whatever you need to
                radios[i].checked = false;
            }
        }
      }

    }
  }
}

function open_details(tid)
{
  // Get the modal
  var modal = document.getElementById("details_modal");

  // Get the button that opens the modal
  var btn = document.getElementById(tid);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  sessionStorage.setItem("DevNote_tid", tid);
  get_progres(uid,sid,tid,"details");

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
function add_task_modal()
{
  // Get the modal
  var modal = document.getElementById("modal_add_task");

  // Get the button that opens the modal
  var btn = document.getElementById("add_task");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

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
function get_task_info(uid,sid,tid)
{
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_task_info?uid=${uid}&sid=${sid}&tid=${tid}`)
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
        document.getElementById("task_name_edit").value = data[0]["name"];
        if (data[0]["date"] != "1000-01-01")
        {
          document.getElementById("due_date_edit").value = data[0]["date"];
        }
        if (data[0]["content"] != "")
        {
          quilledit.root.innerHTML = data[0]["content"];
        }
      }

    }
  }
}

function open_edit_task_modal()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let tid = sessionStorage.getItem("DevNote_tid");
  // Get the modal
  var modal = document.getElementById("modal_edit_task");

  // Get the button that opens the modal
  var btn = document.getElementById(tid);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[2];

  //open modal on button click
  modal.style.display = "block";
  get_task_info(uid,sid,tid);
  get_progres(uid,sid,tid,"edit");

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

function edit_task()
{

  let uid = sessionStorage.getItem("DevNote_uid");
  let tid = sessionStorage.getItem("DevNote_tid");
  let name = document.getElementById("task_name_edit").value;
  let sid  = sessionStorage.getItem("DevNote_sid");
  let content = quilledit.root.innerHTML;
  let date = document.getElementById("due_date_edit").value;
  let progress = null;
  var radios = document.getElementsByTagName('input');
  for (var i = 0; i < radios.length; i++) {
      if (radios[i].type === 'radio' && radios[i].checked) {
          // get value, set checked flag or do whatever you need to
          progress = radios[i].value;
      }
  }

  if (!check_name(name))
  {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/edit_task`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      uid: uid,
      name: name,
      sid: sid,
      content:content,
      date: date,
      progress: progress,
      tid: tid
  }));

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

function open_view_task_modal(task_id)
{
  // Get the modal
  var modal = document.getElementById("modal_view_task");

  // Get the button that opens the modal
  var btn = document.getElementById(task_id);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[3];

  //open modal on button click
  modal.style.display = "block";
  view_task();
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

function view_task()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let tid = sessionStorage.getItem("DevNote_tid");

  let username = sessionStorage.getItem("DevNote_username");
  let space_name = sessionStorage.getItem("DevNote_space_name");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/view_task?uid=${uid}&sid=${sid}&tid=${tid}`)
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

        document.getElementById("space_view").innerHTML = `<i class="fa fa-cube"></i> Space : ${space_name}`;
        document.getElementById("created_by_view").innerHTML = `<i class="fa fa-user"></i> Created By : ${username}`;
        document.getElementById("task_name_view").innerHTML = data[0]["name"];

        if (data[0]["date"] != "1000-01-01")
        {
          document.getElementById("date_view").innerHTML = `<i class="fa fa-clock-o"></i> Due : ${data[0]["date"]}`;
        }
        if (data[0]["progress"] != "")
        {
          document.getElementById("progress_view").innerHTML = `<i class="fa fa-calendar-check-o"></i> Progress : <p class="${data[0]["progress"]}_progress">${data[0]["progress"]}</p>`;
        }
        if (data[0]["content"] != "")
        {
          document.getElementById("note_body").innerHTML = data[0]["content"];
          //Get the number of code blocks (The first half will be in the note body)
          var num_code_blocks = document.getElementsByClassName("ql-syntax").length;

          //Iterate through the blocks and place a code element with the hljs class
          for(let block = 0; block < num_code_blocks; block+=1)
          {
            var code = document.getElementsByClassName("ql-syntax")[block].innerHTML;
            document.getElementsByClassName("ql-syntax")[block].innerHTML = "<code class='language-keyword hljs'>"+code+"</code>";
          }
        }
      }

    }
  }
}

function delete_task()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let tid = sessionStorage.getItem("DevNote_tid");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/delete_task?uid=${uid}&sid=${sid}&tid=${tid}`)
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
        location.reload()
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
