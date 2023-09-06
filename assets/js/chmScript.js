var question_container=$('.question_container');
var checkbox=$('#checkbox');
var confirm_button=$('.instruction_button');
var seconds=$('.seconds');
var minutes=$('.minutes');
var chm_seconds_time;
var chm_minute_time;
var countdown;
var time=14;
var T_time=900;
var N_question=30;
$('.review').hide();

$('.btnToDiv').click(function() {
  // Get the target div ID from the 'data-target' attribute of the button
  var targetDivId = $(this).data('target');
  // Calculate the target position of the div
  var targetPosition = $('#' + targetDivId).offset().top;
  var previous=0;
  var control;
  if(targetPosition>0){
    control=targetPosition-previous+120;
  }else{
    control=targetPosition+previous-120;
  }
  // Animate the scroll to the target position
  $('html, body, .move').animate({
      scrollTop: control
  }, 800); // Adjust the animation duration as needed
  previous=targetPosition;
});
//=========================
//calculate
//=========================
var score = 0;
var grade='F';
// Loop through each question
for (var i = 0; i < N_question; i++) {
  // Get the selected answer for the current question
  const selectedAnswer = $('input[name="q' + i + '"]:checked');
  selectedAnswer.attr('checked','checked'); 
  const question= $('input[name="q' + i + '"]').attr('class');
  // If an answer is selected and its value is "1", increment the score
  if (selectedAnswer && selectedAnswer.val()==question) {
    score++;
  };
  if(score<6){
    grade='F';     
  }else if(score>5 && score<11){
    grade='E';  
  }
  else if(score>10 && score<16){
    grade='D';       
  }
  else if(score>15 && score<21){
    grade='C';     
  }
  else if(score>20 && score<25){
    grade='B';     
  }
  else{
    grade='A';     
  };
}



// Get a reference to your button
// Check if the button is already disabled in local storage
var isButtonChmDisabled = localStorage.getItem('buttonChmDisabled');

if (isButtonChmDisabled==="disabled") {
    $('.chm_submit_exam').prop("disabled", true);// Disable the button if it was previously disabled
}
//when subit button is clicked run this
$('.chm_submit_exam').on('click',()=>{
  // Disable the button
  $('.chm_submit_exam').prop("disabled", true);
  // Store the disabled state in local storage
       localStorage.setItem('buttonChmDisabled', "disabled");
       doThis();
});

$('.on-logout').click(()=>{
  clearInterval(countdown);
  chm_seconds_time = 0;
  chm_minute_time = 0;
  seconds.text("00");
  minutes.text("00");
  $('.cancel').remove();
  $('input[type="radio"]').attr('disabled','disabled');
  
  localStorage.setItem('chm_seconds_time',0);
  localStorage.setItem('chm_minute_time',0);

  $('.chm_submit_exam').prop("disabled", false);
  localStorage.removeItem('buttonChmDisabled');
});

slide_instruction();
reviewCancel();

function slide_instruction(){
  var checked=0;
  var confirm=0;
  $(document).ready(()=>{
    $('.review').hide();
      $('input[type="radio"]').attr('disabled', 'disabled');
      $('.blur-this').addClass('scroll_blur');
      question_container.slideDown('slow');
      checkbox.click(()=>{
        if(checkbox.is(':checked')){
          checked=1;
        }else{
          $('.blur-this').addClass('scroll_blur');
        }
      });
      confirm_button.click(()=>{
       confirm=1;
       if(confirm==1 && checked==1){
          $('input[type="radio"]').removeAttr('disabled');
          question_container.remove();
          $('.blur-this').removeClass('scroll_blur');
          timer();
        };
      });

          // Save selected radio button to localStorage
  $('input[type="radio"]').on('change', function () {
    const name = $(this).attr('name');
    const value = $(this).val();
    localStorage.setItem(name, value);
  });

  // Restore selected radio button from localStorage
  $('input[type="radio"]').each(function () {
    const name = $(this).attr('name');
    const storedValue = localStorage.getItem(name);
    if (storedValue === $(this).val()) {
      $(this).prop('checked', true);
    }
  });
  })
};
function calculate_score() {
  doThis();
  };
  function timer(){
    chm_seconds_time = parseInt(localStorage.getItem('chm_seconds_time')) || 0;
    chm_minute_time = parseInt(localStorage.getItem('chm_minute_time')) || 0;
     countdown=setInterval(() => {
        ++chm_seconds_time;
        if(chm_seconds_time < 10){
          seconds.text("0" + chm_seconds_time);
        }
        else{
          seconds.text(chm_seconds_time);
        };
        
        //when seconds count to 60 we want seconds to go back to 0 and as well increment minute
          if (chm_seconds_time>=59){
               chm_minute_time++;
               chm_seconds_time=0;
              //here we want to make sure minute prints in two digit
                 if(chm_minute_time < 10){
                    minutes.text("0" + chm_minute_time);
                   }
                  else{
                    minutes.text(chm_minute_time);
                    };
    
               };
               localStorage.setItem('chm_seconds_time', chm_seconds_time);
               localStorage.setItem('chm_minute_time', chm_minute_time);
    if(chm_minute_time>time){
     seconds.text("00");
    //here run finish attempt
    reviewAftermath();
    //load();
    clearInterval(countdown);
                };
      }, T_time);
  };
function reviewCancel(){
  $('.cancel').on('click', ()=>{
    $('.review').slideToggle();
    $('.blur-this').toggleClass('scroll_blur');
    $('input[type="radio"]').removeAttr('disabled', 'disabled');
    $('.reput_question').append('<ol class="blur-this question_dump">' + $('.append-here').html() + '</ol>');
  });
}
function reviewAftermath(){
  for(var i=0;i<N_question;i++){
    $('input[name="q' + i + '"]:checked').attr('checked','checked'); 
  }  
  //append question into review
  $('.append-here').append($('.question_dump').html());

  $('.review').addClass('index');
  $('.blur-this').addClass('scroll_blur');
  $('.review').slideDown('slow');
  $('input[type="radio"]').attr('disabled','disabled');
  $('.cancel').remove();
  if(minutes.text() >= 15){
    $('.cancel').remove();
  };
}
function doThis(){
  // Reset timer values and clear localStorag
  run();
  clearInterval(countdown);
  chm_seconds_time = 0;
  chm_minute_time = 15;
  seconds.text("00");
  minutes.text("15");
  $('.cancel').remove();
  $('input[type="radio"]').attr('disabled','disabled');
  localStorage.setItem('chm_seconds_time',0);
  localStorage.setItem('chm_minute_time',15);

  $('input[type="radio"]').on('change', function () {
    const name = $(this).attr('name');
    const value = $(this).val();
    localStorage.removeItem(name, value);
  });

  // Restore selected radio button from localStorage
  $('input[type="radio"]').each(function () {
    const name = $(this).attr('name');
    const storedValue = localStorage.removeItem(name);
    if (storedValue === $(this).val()) {
      $(this).prop('checked', true);
    }
  });
  load();
};
async function run(){
  const baseUrl='http://192.168.0.173:3000/exam/chm/data/result'
  var score = 0;
  var grade='F';
  // Loop through each question
  for (var i = 0; i < N_question; i++) {
    // Get the selected answer for the current question
    const selectedAnswer = $('input[name="q' + i + '"]:checked');
    selectedAnswer.attr('checked','checked'); 
    const question= $('input[name="q' + i + '"]').attr('class');
    // If an answer is selected and its value is "1", increment the score
    if (selectedAnswer && selectedAnswer.val()==question) {
      score++;
    };
    if(score<6){
      grade='F';     
    }else if(score>5 && score<11){
      grade='E';  
    }
    else if(score>10 && score<16){
      grade='D';       
    }
    else if(score>15 && score<21){
      grade='C';     
    }
    else if(score>20 && score<25){
      grade='B';     
    }
    else{
      grade='A';     
    };
  }


try{
  const res=await fetch(baseUrl,{
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({
    chmscore: score,
    chmgrade: grade
  })
  })
}
catch(error){
console.log(error);
}

}
function load(){
  window.location.href='http://192.168.0.173:3000/exam/instruction';
}