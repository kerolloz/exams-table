$.getJSON("./exams.json", function(data) {
  const exams = data.exams;

  const lastExamTime = getLastExamTime(exams);

  if (exams_are_over(lastExamTime)) return show_exams_are_over();

  showExams(exams);
  highlightNextExam();

  let countDownDate = lastExamTime;
  function setCountDown() {
    // Get today's date and time
    let now = new Date().getTime();

    // Find the distance between now and the count down date
    let distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    $("#countdown").text(
      days + "d " + hours + "h " + minutes + "m " + seconds + "s "
    );

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(countDownInterval);
      show_exams_are_over();
    }
  }
  // Update the count down every 1 second
  var countDownInterval = setInterval(setCountDown, 1000);
});

function getLastExamTime(exams) {
  return new Date(exams[exams.length - 1].date).getTime();
}

function highlightNextExam() {
  const followingExam = $("tbody tr:not(.done)")[0]; // first exam not marked done
  followingExam.className = "active";
}

function showExams(exams) {
  for (const exam of exams) {
    const exam_html = format_exam(exam);
    $("tbody.exams").append(exam_html);
  }
}

function exams_are_over(lastExamTime) {
  return lastExamTime - Date.now() < 0;
}

function show_exams_are_over() {
  $("#counter").html(
    "<p> YOU <em> SURVIVED </em> IT! <br>Enjoy your holiday! </p>"
  );
  $("#exams-table").html("");
}

function switch_color_mode() {
  $("#switcher").toggleClass("black");
  $(".ui.table").toggleClass("inverted");
  $(".done").toggleClass("positive disabled");
}

function format_exam({ date, name }) {
  const _date = moment(date).format("ddd DD MMM YYYY");
  let _state = moment(date).from();
  let _class = "";
  if (moment(date).isBefore(Date.now())) {
    // done with that exam
    _state = `<i class="icon checkmark"></i> ${_state}`;
    _class = "done ";
    _class += "disabled";
  }
  return `<tr class="${_class}">
  <td > ${_date}</td>
  <td class="center aligned">${name}</td>
  <td class="center aligned"> ${_state}</td>
  </tr>`;
}
