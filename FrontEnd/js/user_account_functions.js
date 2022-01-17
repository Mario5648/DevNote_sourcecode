function load_user_info()
{

  var user_info_content = `
      <div class="user_info">
          <h1>User Info</h1>
          <br>
          <form>
            <label for="user_name">Username:</label><br>
            <input class="text_field" type="text" id="user_name" name="user_name" disabled><br><br>
            <label for="user_email">Email:</label><br>
            <input class="text_field" type="email" id="user_email" name="user_email" disabled><br><br>
          </form>
        </div>`;

  document.getElementById("app_body").innerHTML = user_info_content;
}

function load_user_preferences()
{
  var user_preference_content = `
      <div class="user_preference">
        <h1>User Preferences</h1>
        <br>
        <form>
          <label class="theme_title">Themes:</label><br>
          <select onchange="update_display_code.call(this, event)" id="code_theme" class="select_theme">
            <option value="light">Light</option>
            <option value="agate">Agate</option>
            <option value="atom_dark">Atom-Dark</option>
            <option value="atom_light">Atom-Light</option>
            <option value="vs_2015">Vs-2015</option>
          </select>
        </form>
        <br>
        <br>
        <button class="save_code_theme_button" onclick="update_coding_style()">Save Theme</button>
        <br>
        <br>
        <div class="example_code_display">
          <h4 class="example_code_title">Example Code</h4>
          <pre><code id="example_code_display" class="language-python hljs">
          </code></pre>
        </div>
      </div>`;

  document.getElementById("app_body").innerHTML = user_preference_content;
}

function update_display_code_onload()
{

  var selected_theme = document.getElementById("code_theme").value;

  switch(selected_theme)
  {
    case 'light':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/a11y-light.css"> `
    break;
    case 'agate':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/agate.css"> `
    break;
    case 'atom_dark':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-dark.css"> `
    break;
    case 'atom_light':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-light.css"> `
    break;
    case 'vs_2015':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/vs2015.css"> `
    break;
  }

  var example_code = `
          import os
          val1 = True
          print(val1)

          # Number to Boolean
          number = 10
          print(bool(number))

          def comp_val(val1,val2):
            print(val1 < val2)
            return [1,2,3,4]

          val1 = 6
          val2 = 3

          num_arr = comp_val(val1,val2)
            `;
  document.getElementById("example_code_display").innerHTML = hljs.highlight(example_code , {language: "python", ignoreIllegals: true }).value;
}
function update_display_code(event)
{

  var selected_theme = this.options[this.selectedIndex].value;

  switch(selected_theme)
  {
    case 'light':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/a11y-light.css"> `
    break;
    case 'agate':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/agate.css"> `
    break;
    case 'atom_dark':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-dark.css"> `
    break;
    case 'atom_light':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/atom-one-light.css"> `
    break;
    case 'vs_2015':
    document.getElementById("code_theme_stylesheet_load").innerHTML =  `<link rel="stylesheet" href="https://highlightjs.org/static/demo/styles/vs2015.css"> `
    break;
  }

  var example_code = `
          import os
          val1 = True
          print(val1)

          # Number to Boolean
          number = 10
          print(bool(number))

          def comp_val(val1,val2):
            print(val1 < val2)
            return [1,2,3,4]

          val1 = 6
          val2 = 3

          num_arr = comp_val(val1,val2)
            `;
  document.getElementById("example_code_display").innerHTML = hljs.highlight(example_code , {language: "python", ignoreIllegals: true }).value;
}


function load_user_security()
{
  var user_security_content = `
      <div class="user_info">
          <h1>Password & Security</h1>
          <br>
          <form>
            <label for="new_password">New Password:</label><br>
            <input class="text_field" type="password" id="new_password" name="new_password"><br><br>
            <label for="new_password_confirm">Confirm Password:</label><br>
            <input class="text_field" type="password" id="new_password_confirm" name="new_password_confirm"><br><br>
          </form>
          <br>
          <button class="save_changes_user_info" onclick="update_user_password()">Change Password</button>

        </div>`;

  document.getElementById("app_body").innerHTML = user_security_content;
}
