$.getJSON("./exams.json", function (data) {
  const exams = data.exams
    .map(({ date, name }) => ({ date: moment(date), name })) // transfer all dates to moment-dates
    .sort((a, b) => a.date.diff(b.date));

  const lastExamTime = getLastExamTime(exams);

  if (areExamsOver(lastExamTime)) return showExamsAreOver();

  showExams(exams);
  highlightNextExam();

  const countDownDate = lastExamTime;
  function setCountDown() {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    $("#countdown").text(`${days} d ${hours} h ${minutes} m ${seconds} s`);

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(countDownInterval);
      showExamsAreOver();
    }
  }
  setCountDown(); // show count down, if removed you have to wait 1 sec to see the count down
  // Update the count down every 1 second
  const countDownInterval = setInterval(setCountDown, 1000);
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
    const exam_html = formatExam(exam);
    $("tbody#exams").append(exam_html);
  }
}

function areExamsOver(lastExamTime) {
  return lastExamTime - Date.now() < 0;
}

function showExamsAreOver() {
  $("#counter").html(
    "<p> YOU <em> SURVIVED </em> IT! <br>Enjoy your holiday! </p>"
  );
  $("#exams-table").html("");
}

function switchColorMode() {
  $("#switcher").toggleClass("black");
  $(".ui.table").toggleClass("inverted");
  $(".done").toggleClass("positive disabled");
  $("#switcher i").toggleClass("sun");
  $("#switcher i").toggleClass("moon");
}

function formatExam({ date, name }) {
  const _date = date.format("ddd DD MMM YYYY");
  let _state = date.from();
  let _class = "";
  if (date.isBefore(Date.now())) {
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
