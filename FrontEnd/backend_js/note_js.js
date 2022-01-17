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

var quilledit = new Quill('#editor-container_edit_note', {
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


function get_notes()
{
  check_login();
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let space_name = sessionStorage.getItem("DevNote_space_name");
  document.getElementById("note_path").innerHTML = `${space_name} > To-Do`;
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_notes?uid=${uid}&sid=${sid}`)
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
        display_notes(data);
        get_coding_style_preference();
      }

    }
  }
}


function display_notes(data)
{

  var table = $('#note_list').DataTable();

  table.clear().draw();

  var table = $('#note_list').DataTable();

  for(let index = 0 ; index < data["num_notes"]; index+=1)
  {
    let name = data[index]["name"];
    let details_button = `<center><a onclick="open_details_note('${data[index]["nid"]}')" class="edit_button"><i class="fa fa-edit"></i></a></center>`;
    table.row.add([name,details_button]).draw();
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
  alert("Note name should be greater than 1 character and less than 255 characters");
  return false;
}

function add_note()
{

  let uid = sessionStorage.getItem("DevNote_uid");
  let name = document.getElementById("note_name").value;
  let sid  = sessionStorage.getItem("DevNote_sid");
  let content = quill.root.innerHTML;

  if (!check_name(name))
  {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/add_note`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      uid: uid,
      name: name,
      sid: sid,
      content:content,
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


function open_details_note(note_id)
{
  // Get the modal
  var modal = document.getElementById("details_modal_note");

  // Get the button that opens the modal
  var btn = document.getElementById(note_id);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  //open modal on button click
  modal.style.display = "block";
  sessionStorage.setItem("DevNote_nid", note_id);

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

function add_note_modal()
{
  // Get the modal
  var modal = document.getElementById("modal_add_note");

  // Get the button that opens the modal
  var btn = document.getElementById("add_note");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[1];

  //open modal on button click
  modal.style.display = "block";

  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
}

function get_note_info(uid,sid,nid)
{
  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/get_note_info?uid=${uid}&sid=${sid}&nid=${nid}`)
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
        document.getElementById("note_name_edit").value = data[0]["name"];

        if (data[0]["content"] != "")
        {
          quilledit.root.innerHTML = data[0]["content"];
        }
      }

    }
  }
}
function open_edit_note_modal(note_id)
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let nid = sessionStorage.getItem("DevNote_nid");
  // Get the modal
  var modal = document.getElementById("modal_edit_note");

  // Get the button that opens the modal
  var btn = document.getElementById(note_id);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[2];

  //open modal on button click
  modal.style.display = "block";
  get_note_info(uid,sid,nid);

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


function edit_note()
{

  let uid = sessionStorage.getItem("DevNote_uid");
  let nid = sessionStorage.getItem("DevNote_nid");
  let name = document.getElementById("note_name_edit").value;
  let sid  = sessionStorage.getItem("DevNote_sid");
  let content = quilledit.root.innerHTML;

  if (!check_name(name))
  {
    return;
  }
  var xhr = new XMLHttpRequest();
  xhr.open("POST", `https://devnoteapiprod.azurewebsites.net/edit_note`, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({
      uid: uid,
      name: name,
      sid: sid,
      content:content,
      nid: nid
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

function open_view_note_modal(note_id)
{
  // Get the modal
  var modal = document.getElementById("modal_view_note");

  // Get the button that opens the modal
  var btn = document.getElementById(note_id);

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[3];

  //open modal on button click
  modal.style.display = "block";
  view_note();
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

function view_note()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let nid = sessionStorage.getItem("DevNote_nid");

  let username = sessionStorage.getItem("DevNote_username");
  let space_name = sessionStorage.getItem("DevNote_space_name");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/view_note?uid=${uid}&sid=${sid}&nid=${nid}`)
  //send the Http request
  xhr.send()
  //EVENT HANDLERS
  //triggered when the response is completed
  xhr.onload = function() {
    if (xhr.status === 200) {
      //parse JSON datax`x
      data = JSON.parse(xhr.responseText)
      console.log(data);
      if (data["code"] == "Success")
      {

        document.getElementById("space_view").innerHTML = `<i class="fa fa-cube"></i> Space : ${space_name}`;
        document.getElementById("created_by_view").innerHTML = `<i class="fa fa-user"></i> Created By : ${username}`;
        document.getElementById("note_name_view").innerHTML = data[0]["name"];

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
function delete_note()
{
  let uid = sessionStorage.getItem("DevNote_uid");
  let sid = sessionStorage.getItem("DevNote_sid");
  let nid = sessionStorage.getItem("DevNote_nid");

  const xhr = new XMLHttpRequest()
  //open a get request with the remote server URL
  xhr.open("GET", `https://devnoteapiprod.azurewebsites.net/delete_note?uid=${uid}&sid=${sid}&nid=${nid}`)
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
