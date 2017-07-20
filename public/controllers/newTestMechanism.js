 $(document).ready(function() {
// Kazda form ma swoj id i stworzony dla niej var.
// $(#form-id-1) -> if == 0 then var form1=0
// else var form1 = x (gdzie x to 100%/liczba forms)
// Powtarzasz takie cos dla wszystkich forms na stronie
// Na konco robisz:
// $(#ProgressBar).width = form1 + form2 + form3 etc.
// Jeśli zrobisz to w Vue.js to jeszcze dodaj opcje event modifier ".tab" zeby odpalalo caly mechanizm dopiero po wcisnieciu tabu
// var f1,f2,f3,f4,f5,f6 = 0;
var forms = [0,0,0,0];
function check (selector,index) {
  if ($(selector).val() === '') {
    forms[index] = 0;
  } else {
    forms[index] = 100/forms.length;
  }
  console.log(`Wartosc inputu ${selector} to: ${forms[index]}`);

}
function sumUp () {
  var sum =0;
  for (var i = 0; i < forms.length; i++) {
    sum += forms[i];
  }
  console.log(`suma to: ${sum}`);
    $('#ProgressBar').animate({width:`${sum}%`}, 'fast');
    // $('#ProgressBar').css('width', `${sum}%` ).fadeIn('slow');
    if (sum===100) {
    $('#submitButton').removeClass('disabled').addClass('btn-success').prop('disabled', false);
    }
    else {
      $('#submitButton').addClass('disabled').removeClass('btn-success').prop('disabled', true);
    }
}

function loadImage(selector) {
  var filePath = `${$(selector).val()}/preview`;
  if ($(selector).val() === '') {
    $('#imageLinkForm').addClass('has-danger').removeClass('has-success');
    $(selector).addClass('form-control-danger').removeClass('form-control-success');
    $('#testImage').attr('src', 'https://drive.google.com/file/d/0Bz7mEYNbcJUSNEs3WEtIbEd1QjA/preview');
  } else if ($(selector).val() != filePath){
    $('#imageLinkForm').removeClass('has-danger').addClass('has-success');
    $(selector).removeClass('form-control-danger').addClass('form-control-success');

    $('#testImage').attr('src', filePath);
    $(selector).val(filePath);
  }
}


$('#F1-NameAndSur').focusout(function(event) {
  check('#F1-NameAndSur', 0);
  sumUp();
});

$('#F2-ScoutGroup').focusout(function(event) {
  check('#F2-ScoutGroup', 1);
  sumUp();
});
$('#F3-ExaminersName').focusout(function(event) {
  check('#F3-ExaminersName', 2);
  sumUp();
});
// This field is filled already at start as radio, so count it out
// $('F4-DateOfWritingExam').focusout(function(event) {
//   check('F4-DateOfWritingExam', 3);
//   sumUp();
// });
// With radio buttons ('zdal' or 'nie zdal' we just set it on 'zdal' by default coz there's no option to uncheck it so why bother anyway .. :) )
$('#F6-ImageURL').focusout(function(event) {
  check('#F6-ImageURL', 3);
  loadImage('#F6-ImageURL');
  sumUp();
});


});


// //www.youtube.com/embed/zpOULjyy-n8?rel=0
