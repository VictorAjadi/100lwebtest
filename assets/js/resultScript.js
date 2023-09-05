var question_container=$('.question_container');
var checkbox=$('#checkbox');
var confirm_button=$('.instruction_button');
var seconds=$('.seconds');
var minutes=$('.minutes');
var seconds_time;
var minute_time;
var countdown;
var time=14;
var T_time=1000;
var N_question=30;

const isButtonPhyEDisabled = localStorage.getItem('buttonPhyEDisabled') === 'true';

if (isButtonPhyEDisabled) {
    $('.phy-button').addClass('disabled');
}
//when subit button is clicked run this
$('.phy-button').on('click',()=>{
  // Disable the button
     $('.phy-button').addClass('disabled');
  // Store the disabled state in local storage
       localStorage.setItem('buttonPhyEDisabled', 'true');
});


const isButtonChmEDisabled = localStorage.getItem('buttonChmEDisabled') === 'true';

if (isButtonChmEDisabled) {
    $('.chm-button').addClass('disabled');
}
//when subit button is clicked run this
$('.chm-button').on('click',()=>{
  // Disable the button
     $('.chm-button').addClass('disabled');
  // Store the disabled state in local storage
       localStorage.setItem('buttonChmEDisabled', 'true');
});


const isButtonGnsEDisabled = localStorage.getItem('buttonGnsEDisabled') === 'true';

if (isButtonGnsEDisabled) {
    $('.gns-button').addClass('disabled');
}
//when subit button is clicked run this
$('.gns-button').on('click',()=>{
  // Disable the button
     $('.gns-button').addClass('disabled');
  // Store the disabled state in local storage
       localStorage.setItem('buttonGnsEDisabled', 'true');
});

const isButtonBioEDisabled = localStorage.getItem('buttonBioEDisabled') === 'true';

if (isButtonBioEDisabled) {
    $('.bio-button').addClass('disabled');
}
//when subit button is clicked run this
$('.bio-button').on('click',()=>{
  // Disable the button
     $('.bio-button').addClass('disabled');
  // Store the disabled state in local storage
       localStorage.setItem('buttonBioEDisabled', 'true');
});


const isButtonMthEDisabled = localStorage.getItem('buttonMthEDisabled') === 'true';

if (isButtonMthEDisabled) {
    $('.mth-button').addClass('disabled');
}
//when subit button is clicked run this
$('.mth-button').on('click',()=>{
  // Disable the button
     $('.mth-button').addClass('disabled');
  // Store the disabled state in local storage
       localStorage.setItem('buttonMthEDisabled', 'true');
});


$('.on-logout').click(async ()=>{
  clearInterval(countdown);
  seconds_time = 0;
  minute_time = 0;
  seconds.text("00");
  minutes.text("00");
  $('.cancel').remove();
  $('input[type="radio"]').attr('disabled','disabled');
  
  localStorage.setItem('seconds_time',0);
  localStorage.setItem('minute_time',0);
  localStorage.setItem('bio_seconds_time',0);
  localStorage.setItem('bio_minute_time',0);
  localStorage.setItem('phy_seconds_time',0);
  localStorage.setItem('phy_minute_time',0);
  localStorage.setItem('mth_seconds_time',0);
  localStorage.setItem('mth_minute_time',0);
  localStorage.setItem('chm_seconds_time',0);
  localStorage.setItem('chm_minute_time',0);
  localStorage.setItem('gns_seconds_time',0);
  localStorage.setItem('gns_minute_time',0);

  localStorage.removeItem('buttonDisabled');
  localStorage.removeItem('buttonPhyDisabled');
  localStorage.removeItem('buttonMthDisabled');
  localStorage.removeItem('buttonGnsDisabled');
  localStorage.removeItem('buttonChmDisabled');
  localStorage.removeItem('buttonBioDisabled');

  localStorage.removeItem('buttonBioEDisabled');
  localStorage.removeItem('buttonPhyEDisabled');
  localStorage.removeItem('buttonMthEDisabled');
  localStorage.removeItem('buttonGnsEDisabled');
  localStorage.removeItem('buttonChmEDisabled');

  $('.chm_submit_exam').prop("disabled", false);
  $('.mth_submit_exam').prop("disabled", false);
  $('.phy_submit_exam').prop("disabled", false);
  $('.bio_submit_exam').prop("disabled", false);
  $('.gns_submit_exam').prop("disabled", false);
});

function timer(){
  seconds_time = parseInt(localStorage.getItem('seconds_time')) || 0;
  minute_time = parseInt(localStorage.getItem('minute_time')) || 0;
   countdown=setInterval(() => {
      ++seconds_time;
      if(seconds_time < 10){
        seconds.text("0" + seconds_time);
      }
      else{
        seconds.text(seconds_time);
      };
      
      //when seconds count to 60 we want seconds to go back to 0 and as well increment minute
        if (seconds_time>=60){
             minute_time++;
             seconds_time=0;
            //here we want to make sure minute prints in two digit
               if(minute_time < 10){
                  minutes.text("0" + minute_time);
                 }
                else{
                  minutes.text(minute_time);
                  };
  
             };
             localStorage.setItem('seconds_time', seconds_time);
             localStorage.setItem('minute_time', minute_time);
  if(minute_time>14){
   seconds.text("00");
  clearInterval(countdown);
              };
    }, 0);
};



