document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events:JSON.parse(sessionStorage.getItem("DevNote_calendar_tasks"))
  });
  calendar.render();
});
