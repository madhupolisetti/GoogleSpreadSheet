// This are the JS functions under the "JS.html" HTML file of the Spreadsheet where the source code lives.
// @ Source Sheet: https://script.google.com/macros/d/MP7J2r1pf6COdv5q-h04adXGX9fKgVtti/edit?uiv=2&mid=ACjPJvFDwhM6hb3Kp0JzLJA14t2yZ9ZmGJORrPkcyOX1w5vbsGa4Axfb0vRh6xK8sFMns_WD9S-nzwjTytFbig8Vg7bWFxrO57kARYgWJkYRF7kMl1bmTlhekVBVvDH3IkqX9tcrqYOgFDY

<script>

$(function() {

closePrompt();
getHeight();
buySms();
contactUs();
checkFilteredRows();
checkFilteredRows2();
saveTemplates();
getSelectedColumn();
getSelectedDblClick();
checkIfSave();
setTextMsg();
handleSmsConfirmation();

deleteMsgTemplate();
closeModal();

countChars();
updateLangCharLimit();

enableReportTimeFormat();

$('#ok').click(function(){ $('.message').css({'z-index': 3, 'width': '300px'}); go(500); $('#mask').fadeOut();});
google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(templatesSuccess).getUserTemplates();
$('[data-toggle="tooltip"]').tooltip();
$('#smsModal').tooltip({title: 'The total charged messages for each row. 160 characters is equivalent to 1 SMS for English. 70 characters is equivalent to 1 SMS for other languages.', selector: '.totalCharged'});


selectMessage();
});

//@ref https://developers.google.com/apps-script/guides/html/communication#forms
// Prevent forms from submitting.

function preventFormSubmit() {
 var forms = document.querySelectorAll('form');
 for (var i = 0; i < forms.length; i++) {
 forms[i].addEventListener('submit', function(event) {
  event.preventDefault();
  });
 }
}

window.addEventListener('load', preventFormSubmit);

function handleLoginInput(obj) {
 google.script.run.withSuccessHandler(loginSuccess).validateLogin(obj);
}

function handleReports(obj) {
 var sheetName = $('#reportSheetName').val();
 var fromDate = $('#reportFromDate').val();
 var toDate = $('#reportToDate').val();
 var modeOfSubmission = $('#modeOfSubmission').val();
 
 if(sheetName == '' || sheetName == undefined == sheetName == null){
   
   $('.check').html('X')
   $('.success-title').text('Ooops!');
   $('.message-success').html('Enter a sheet name!');
   $('.loading-wrapper').fadeOut(500);
   
   $('.message').css('width', '300px'); 
   
 go(50);
 
 } else if(fromDate == '' || fromDate == undefined == fromDate == null) {
 
  $('.check').html('X')
  $('.success-title').text('Ooops!');
  $('.message-success').html('Enter a "From" date');
  $('.loading-wrapper').fadeOut(500);
  
  $('.message').css('width', '300px'); 
  
  go(50);
 
 } else if(toDate == '' || toDate == undefined == toDate == null) {
 
  $('.check').html('X')
  $('.success-title').text('Ooops!');
  $('.message-success').html('Enter a "To" date');
  $('.loading-wrapper').fadeOut(500);
  
  $('.message').css('width', '300px'); 
  
  go(50);
 
 } else {
 
 $('.loading-wrapper').fadeIn(500);
 
 $('#reportFromDateTime').removeAttr('disabled');
 $('#reportToDateTime').removeAttr('disabled');
 
 google.script.run.withSuccessHandler(getReports).getSMSReports(obj);
 
 }

}

function getReports(response) {
 if(response.status == 'no dup') {
   google.script.host.close();
 } else if(response.status == 'No Sheet Name') {
   
   $('.loading-wrapper').fadeOut(500);
   
   $('.check').html('X')
   $('.success-title').text('Ooops!');
   $('.message-success').html('Sheet Name cannot be empty!');
   $('.loading-wrapper').fadeOut(500);
   
   $('.message').css('width', '300px'); 
   
   go(50);
   
 } else if(response.status == 'dup') {
 
   $('.loading-wrapper').fadeOut(500);
   
   $('.check').html('X')
   $('.success-title').text('Ooops!');
   $('.message-success').html('Sheet Name <strong>' + response.sheet + '</strong> already exist!');
   $('.loading-wrapper').fadeOut(500);
   
   $('.message').css('width', '300px');  
   
   go(50);
   
 } else if(response.status == 'No Records') {
 
   $('.loading-wrapper').fadeOut(500);
 
   $('.check').html('X')
   $('.success-title').text('Ooops!');
   $('.message-success').html('No Records from <strong>' + response.fromDate + '</strong> to <strong>' + response.toDate + '</strong>.');
   $('.loading-wrapper').fadeOut(500);
   
   $('.message').css('width', '300px'); 
   
   go(50);
 } else if(response.status == 'Invalid Date') {
 
 $('.loading-wrapper').fadeOut(500);
 
 $('.check').html('X')
 $('.success-title').text('Ooops!');
 $('.message-success').text(response.status);
 $('.loading-wrapper').fadeOut(500);
 
 $('.message').css('width', '300px'); 
   
  go(50);
 
 }
}

function loginSuccess(result) {
 var content = "";

 if(result.status == 'valid') {
 
  content += '<div id="result-wrapper">'
  content += '<header>'
  content += '<img src="https://dl.dropboxusercontent.com/s/qpuwb5jdztb7op9/SMSCountry-logo-white.png?dl=0" alt="SMS Login Header Logo">'
  content += '</header>'
  content += '<h4 id="login-success" class="check"><span class="fa fa-check-circle-o"></span> '+ result.message +'</h4>'
  content += '</div>'
  content += '<div class="loading-wrapper">'
  content += '<div class="loading"><img src="https://dl.dropboxusercontent.com/s/ycd5sx5x4xh8xvj/loading_gif.gif?dl=0"></div>'
  content += '</div>'
  
 
  $('#content-wrapper').empty().html(content);
  $('#container-wrapper').addClass('login-success');
  $('#login-success').delay(500).animate({fontSize: '+=23px', opacity: '+=1'}, 100);
  $('.fa-check-circle-o').animate({fontSize: '+=42px', opacity: '+=1'}, 100);
  
  setTimeout(function() {
   google.script.host.close();
  }, 2000);
  
 } else if(result.status == 'void') {
  
  content += '<div id="result-failed-wrapper">'
  content += '<header>'
  content += '<img src="https://dl.dropboxusercontent.com/s/qpuwb5jdztb7op9/SMSCountry-logo-white.png?dl=0" alt="SMS Login Header Logo">'
  content += '</header>'
  content += '<h4 id="login-failed"><span class="fa fa-exclamation-circle"></span> '+ result.message +'</h4>'
  content += '<div class="loading-wrapper">'
  content += '<div class="loading"><img src="https://dl.dropboxusercontent.com/s/ycd5sx5x4xh8xvj/loading_gif.gif?dl=0"></div>'
  content += '</div>'
  content += '</div>'
  content += '<div class="btn-wrapper result-failed"><button id="settings" class="action retry" onclick="google.script.run.login()">Retry</button><button class="cancel">Close</button></div>'
 
  $('#content-wrapper').empty().html(content);
  $('#login-failed').delay(500).animate({fontSize: '+=21px', opacity: '+=1'}, 100);
  $('.fa-exclamation-circle').animate({fontSize: '+=36px', opacity: '+=1'}, 100);
 }
}

function closePrompt() {
 $(document).on('click', '.cancel', function() {
  google.script.host.close();
 });
}

function getHeight() {
var h = $('.content').height();
$('.side-panel div').height(h-21);

}

function contactUs() {
 $('#contactUs').click(function() {
  window.open('https://www.smscountry.com/contact-us.aspx');
  google.script.host.close();
 });
}

function buySms() {
 $(document).on('click', '#buysms', function() {
  window.open('http://www.smscountry.com/Purchase_History.aspx');
  google.script.host.close();
 });
}

function checkFilteredRows() {
 $('input[name="filterrows"]').click(function() {
  var id = $(this).attr('id');
  
  switch(id) {
   case 'filterrows': 
    $('#range-row').attr('disabled', true).val('');
     $('#start-row').attr('disabled', false);
    $('#end-row').attr('disabled', false);
   break;
   case 'filterbyRange': 
    $('#range-row').attr('disabled', false);
    $('#start-row').attr('disabled', true).val('');
    $('#end-row').attr('disabled', true).val('');
   break;
   case 'selectAll': 
    $('#start-row').attr('disabled', true).val('');
    $('#end-row').attr('disabled', true).val('');
    $('#range-row').attr('disabled', true).val('');
   break;
  }
  
 });
 
}

function checkFilteredRows2() {
  var radio = $('input[name="filterrows"]');
  var id = $(radio).attr('id');
  
  
  if(radio.is(':checked')) {
  switch(id) {
   case 'filterrows': 
    $('#range-row').attr('disabled', true).val('');
     $('#start-row').attr('disabled', false);
    $('#end-row').attr('disabled', false);
   break;
   case 'filterbyRange': 
    $('#range-row').attr('disabled', false);
    $('#start-row').attr('disabled', true).val('');
    $('#end-row').attr('disabled', true).val('');
   break;
   case 'selectAll': 
    $('#start-row').attr('disabled', true).val('');
    $('#end-row').attr('disabled', true).val('');
    $('#range-row').attr('disabled', true).val('');
   break;
  }
  
  } 
}

function getSlected() {
 var select = $('select[name=addToColumn]');
 var txtArea = $('textarea[id=textbox]');
 
 $(document).on('click', '.add-to-column', function() {
   var selectVal = $.trim(select.val());
   txtArea.val(txtArea.val() + '#' + selectVal + '#');
  
 });
}

// HANDLE SEND SMS CONFIRMATION
function handleSmsConfirmation() { 
  
  $('#send-sms').on('click', function() {
  
  var filter = $('input[name=filterrows]:checked', '#sms-form1').val();
  var startRow = $('input[name=startRow]', '#sms-form1').val();
  var endRow = $('input[name=endRow]', '#sms-form1').val();
  var rowRange = $('input[name=rowRanges]', '#sms-form1').val();
  var textarea = $('textarea[name=smstextarea]', '#sms-form1').val();
  var previewOption = $('input[name=preview]').is(':checked');
  var mobileCol = $('#select', '#sms-form1').val();
  var skipDups = $('input[name=ignoreDups]').is(':checked');
  
  var obj = {preview: previewOption, textarea: textarea, filterrows: filter, startRow: startRow, endRow: endRow, rowRanges: rowRange, mobileCol: mobileCol, skipDups: skipDups};
  
   $('.loading-wrapper').fadeIn(500);
   google.script.run.withSuccessHandler(smsConfrimResponse).confirmMessage(obj);
   
  });
  
}

function smsConfrimResponse(response) {
 
 if(response.status == false) {
 
 $('.check').html('X')
 $('.success-title').text('Ooops!');
 $('.message-success').html(response.range);
 $('.loading-wrapper').fadeOut(500);
 
 $('.message').css('width', '500px');
 
 go(50);
 
 /*
  $('.modal-body').html('<p class="error-filter">'+ response.range +'</p>');
  $('#model-btn-wrapper').html('<button id="close-modal" type="button">Close</button>');
  $('#model-btn-wrapper').css('text-align', 'center');
  $('.loading-wrapper').fadeOut(500);
  $('#smsModal').modal({backdrop: 'static', keyboard: false});
 */
 } else if(response.status == true) {
  if(response.range == 1) {
  
   $('.modal-body').html('<p class="success-filter"><i class="fa fa-share-square" aria-hidden="true"></i> Send '+ response.range +' message?</p>');
   $('.loading-wrapper').fadeOut(500);
   $('#smsModal').modal();
   
  } else {
   
   if(response.range > 100) {
   
   /*
   $('.modal-body').html('<h4 id="warning-overLimit">There are more than 100 rows to be processed. You can send SMS by batches of 100.</h4><p class="success-filter"><i class="fa fa-share-square" aria-hidden="true"></i> Send '+ response.range +' messages?</p>');
   $('.loading-wrapper').fadeOut(500);
   $('#smsModal').modal();
   */
   
   } else {
   
   $('.modal-body').html('<p class="success-filter"><i class="fa fa-share-square" aria-hidden="true"></i> Send '+ response.range +' messages?</p>');
   $('.loading-wrapper').fadeOut(500);
   $('#smsModal').modal();
   
   }
   
  }
 } else if(response.status == 'preview') {
 
   sendPreviewedSms();
 }
 
}

//********END OF SEND SMS CONFIRMATION**********//

//SEND SMS FORM TO SERVER WITH PREVIEW

function sendPreviewedSms() {
  
  var filter = $('input[name=filterrows]:checked', '#sms-form1').val();
  var startRow = $('input[name=startRow]', '#sms-form1').val();
  var endRow = $('input[name=endRow]', '#sms-form1').val();
  var rowRange = $('input[name=rowRanges]', '#sms-form1').val();
  var textarea = $('textarea[name=smstextarea]', '#sms-form1').val();
  var previewOption = $('input[name=preview]').is(':checked');
  var mobileCol = $('select[name=mobileNumberColumn]').val();
  var senderId = $('select[name=senderId]').val();
  var sourceLang = $('#language-origin').val();
  var destLang = $('#languages').val();
  var skipDups = $('input[name=ignoreDups]').is(':checked');
  
  var enableTranslate = $('input[name=translateChckBx]').is(':checked');
  
   //LoadMyJs('https://dl.dropboxusercontent.com/s/5tqn4i0sowl4y1t/pagination.js?dl=0');
   $('.loading-wrapper').fadeIn(500);
   
   if(skipDups == true) {
    google.script.run.withFailureHandler(errorTemplates).removeDuplicates();
   }

   google.script.run.withSuccessHandler(preview).replacePlaceholder2(filter, textarea, startRow, endRow, rowRange, mobileCol, senderId, sourceLang, destLang, enableTranslate);

}

// Preview Pagination
// Store index of to give default value of 0.

counter = 0;

function getTotalMsgs(a, b) {
 return a + b;
}

function getTotalMsgLenEng(message) {
 
 var total;
 
 if(message.length <= 160) {
  total = Math.ceil(message.length/160);
 } else if(message.length > 160) {
  total = Math.ceil(message.length/153);
 }
 
 return total;
 
}

function getTotalMsgLenNonEng(message) {

 var total;
 
 if(message.length <= 70) {
  total = Math.ceil(message.length/70);
 } else if(message.length > 70) {
  total = Math.ceil(message.length/67);
 }
 
 return total;
 
}

function preview(response) {

 var messages = response.messages;
 var totalMsgs;
 
 var mobileNumbers = response.mobileNumbrs;
 var firstItem = messages.indexOf(messages[0]);
 var lang = response.language;
 var chargedSms;
 var totalSms;
 var totalChargedMsgsDesc = 'The total charged messages for each row. 160 characters is equivalent to 1 SMS for English. 70 characters is equivalent to 1 SMS for other languages.';
 
 if(response.status == 'True') {
 
 if(lang == 'en') {
  if(messages[0].length <= 160) {
   totalSms = Math.ceil(messages[0].length/160);
  } else if(messages[0].length > 160) {
   totalSms = Math.ceil(messages[0].length/153);
  }
  
  chargedSms = messages.map(getTotalMsgLenEng).reduce(getTotalMsgs);
  
 } else {
  if(messages[0].length <= 70) {
   totalSms = Math.ceil(messages[0].length/70);
  } else if(messages[0].length > 70) {
   totalSms = Math.ceil(messages[0].length/67);
  }
  
  chargedSms = messages.map(getTotalMsgLenNonEng).reduce(getTotalMsgs);
 }
 
 var content = '';
  
  if(messages.length > 100) {
  
  content += '<div id="preview-wrapper container-fluid">'
  
  content += '<h4 id="warning-overLimit">There are more than 100 rows to be processed. You can send SMS by batches of 100.</h4>'
  
  content += '<div class="row pagination-wrapper">'
  
  content += '<div class="col-sm-2">'
  content += '<h1 class="text-center prev-msg"><i id="previous-sms" class="fa fa-chevron-circle-left" aria-hidden="true" title="previous message"></i></h1>'
  content += '</div>'

  content += '<div class="col-sm-8 pagination-col bg-danger">'
  content += '<h5 class="text-center">MESSAGE <span id="sms-count">'+ (firstItem + 1) +'</span>/'+ messages.length +'</h5>'
  content += '</div>'
  
  content += '<div class="col-sm-2">'
  content += '<h1 class="text-center next-msg"><i id="next-sms" class="fa fa-chevron-circle-right" aria-hidden="true" title="next message"></i></h1>'
  content += '</div>'
  
  content += '</div><!--END OF pagination-wrapper-->'
  
  content += '<div class="row mobile-input-wrapper">'
  content += '<div class="col-sm-7">'
  content += '<div class="input-group">'
  content += '<label for="preview-num" class="sr-only">Mobile Number</label>'
  content += '<span class="input-group-addon" id="basic-addon1">Mobile Number</span>'
  content += '<input type="text" name="previewnum" id="preview-num" class="form-control" aria-describedby="basic-addon1" value="'+ mobileNumbers[0] +'" disabled>'
  content += '</div><!--END OF Mobile Input-->'
  content += '</div>'
  content += '<div class="col-sm-5">'
  content += '<p id="num-charged-msgs"><span class="glyphicon glyphicon-question-sign totalCharged" aria-hidden="true" data-toggle="tooltip" title="'+ totalChargedMsgsDesc +'"></span>  <i class="fa fa-tasks" aria-hidden="true"></i>  Total Charged Messages = '+  chargedSms +'</p>'
  content += '</div>'
  content += '</div><!--END OF mobile-input-wrapper-->'
  content += '<div class="row msg-body">'
  content += '<div class="col-sm-8">'
  content += '<textarea id="preview-txtarea" class="form-control" disabled>'+ messages[0] +'</textarea>'
  content += '</div>'
  content += '<div class="col-sm-4">'
  content += '<div id="preview-details">'
  content += '<div id="group-wrapper">'
  
  content += '<div class="form-group">'
  content += '<label for="preview-num">Number of Characters</label>'
  content += '<input type="text" name="numCharacters" id="numCharacters" class="input-sm form-control" value="" disabled>'
  content += '</div>'
  
  content += '<div class="form-group">'
  content += '<label for="preview-num">Number of SMS</label>'
  content += '<input type="text" name="numSms" id="numSms" class="input-sm form-control" value="'+ totalSms +'" disabled>'
  content += '</div>'
  
  content += '<div class="form-group">'
  content += '<p>160 Chars = 1 SMS (in English)</p>'
  content += '<p>70 Chars = 1 SMS (other)</p>'
  content += '</div>'
  
  content += '</div><!--END OF GROUP-WRAPPER-->'
  content += '</div>'
  content += '</div>'
  content += '</div><!--END OF msg-body-->'
  content += '</div>'
  
  } else {
   
   content += '<div id="preview-wrapper container-fluid">'
  
  content += '<div class="row pagination-wrapper">'
  
  content += '<div class="col-sm-2">'
  content += '<h1 class="text-center prev-msg"><i id="previous-sms" class="fa fa-chevron-circle-left" aria-hidden="true" title="previous message"></i></h1>'
  content += '</div>'
  
  content += '<div class="col-sm-8 pagination-col bg-danger">'
  content += '<h5 class="text-center">MESSAGE <span id="sms-count">'+ (firstItem + 1) +'</span>/'+ messages.length +'</h5>'
  content += '</div>'
  
  content += '<div class="col-sm-2">'
  content += '<h1 class="text-center next-msg"><i id="next-sms" class="fa fa-chevron-circle-right" aria-hidden="true" title="next message"></i></h1>'
  content += '</div>'
  
  content += '</div><!--END OF pagination-wrapper-->'
  
  content += '<div class="row mobile-input-wrapper">'
  content += '<div class="col-sm-7">'
  content += '<div class="input-group">'
  content += '<label for="preview-num" class="sr-only">Mobile Number</label>'
  content += '<span class="input-group-addon" id="basic-addon1">Mobile Number</span>'
  content += '<input type="text" name="previewnum" id="preview-num" class="form-control" aria-describedby="basic-addon1" value="'+ mobileNumbers[0] +'" disabled>'
  content += '</div><!--END OF Mobile Input-->'
  content += '</div>'
  content += '<div class="col-sm-5">'
  content += '<p id="num-charged-msgs"><span class="glyphicon glyphicon-question-sign totalCharged" aria-hidden="true" data-toggle="tooltip" title="'+ totalChargedMsgsDesc +'"></span>  <i class="fa fa-tasks" aria-hidden="true"></i>  Total Charged Messages = '+  chargedSms +'</p>'
  content += '</div>'
  content += '</div><!--END OF mobile-input-wrapper-->'
  content += '<div class="row msg-body">'
  content += '<div class="col-sm-8">'
  content += '<textarea id="preview-txtarea" class="form-control" disabled>'+ messages[0] +'</textarea>'
  content += '</div>'
  content += '<div class="col-sm-4">'
  content += '<div id="preview-details">'
  content += '<div id="group-wrapper">'
  
  content += '<div class="form-group">'
  content += '<label for="preview-num">Number of Characters</label>'
  content += '<input type="text" name="numCharacters" id="numCharacters" class="input-sm form-control" value="" disabled>'
  content += '</div><!--END OF Mobile Input-->'
  
  content += '<div class="form-group">'
  content += '<label for="preview-num">Number of SMS</label>'
  content += '<input type="text" name="numSms" id="numSms" class="input-sm form-control" value="'+ totalSms +'" disabled>'
  content += '</div><!--END OF Mobile Input-->'
  
  content += '<div class="form-group add-info">'
  content += '<p>160 Chars = 1 SMS (in English)</p>'
  content += '<p>70 Chars = 1 SMS (other)</p>'
  content += '</div>'
  
  content += '</div><!--END OF GROUP-WRAPPER-->'
  content += '</div>'
  content += '</div>'
  content += '</div><!--END OF msg-body-->'
  content += '</div>'
   
  }
  $('#model-btn-wrapper').html('<button id="send-sms-form" form="sms-form1" type="submit" class="action">Send SMS</button><button id="close-modal" type="button">Cancel</button>');
  $('.loading-wrapper').fadeOut(500);
  $('.modal-body').html(content);
  $('#dialog-modal').addClass('preview-modal');
  $('#smsModal').modal({backdrop: 'static', keyboard: false});
  
  var strLengthInit = $('#preview-txtarea').val().length;
  
  $('#numCharacters').val(strLengthInit);
  
  paginate(messages, mobileNumbers, lang, chargedSms);
 
 } else if(response.status == 'False') {
  
  $('.message-success').empty();
  $('.message').css('width', '500px');
  
  $('.check').html('X')
  $('.success-title').text('Ooops!');
  $('.message-success').html(response.messages);
  $('.loading-wrapper').fadeOut(500);
  
 go(50);
 
 }
 
}

function paginate(messages, mobileNumbers, lang, chargedSms) {

getPaginateValues(0 ,messages, mobileNumbers, 'preview-txtarea', 'preview-num', 'sms-count', 'next-sms', 'previous-sms');

var totalChargedMsgsDesc = 'The total charged messages for each row. 160 characters is equivalent to 1 SMS for English. 70 characters is equivalent to 1 SMS for other languages.';

$(document).on('click', '#next-sms', function() {
   
   var strLen = $('#preview-txtarea').val().length;
   var longSmsCount;
   
   if(lang == 'en') {
    if(strLen <= 160) {
     longSmsCount = strLen/160;
    } else if(strLen > 160) {
     longSmsCount = strLen/153;
    }
   } else {
    if(strLen <= 70) {
     longSmsCount = strLen/70;
    } else if(strLen > 70) {
     longSmsCount = strLen/67;
    }
   }
   
   $('#num-charged-msgs').html('<span class="glyphicon glyphicon-question-sign totalCharged" aria-hidden="true" data-toggle="tooltip" title="'+ totalChargedMsgsDesc +'"></span> <i class="fa fa-tasks" aria-hidden="true"></i>  Total Charged Messages = '+  chargedSms +'');
   $('#numCharacters').val(strLen);
   $('#numSms').val(Math.ceil(longSmsCount));
   
  });
  
  $(document).on('click', '#previous-sms', function() {

   var strLen = $('#preview-txtarea').val().length;
   var longSmsCount = strLen/160;
   
   if(lang == 'en') {
    if(strLen <= 160) {
     longSmsCount = strLen/160;
    } else if(strLen > 160) {
     longSmsCount = strLen/153;
    }
   } else {
    if(strLen <= 70) {
     longSmsCount = strLen/70;
    } else if(strLen > 70) {
     longSmsCount = strLen/67;
    }
   }
   
   $('#num-charged-msgs').html('<span class="glyphicon glyphicon-question-sign totalCharged" aria-hidden="true" data-toggle="tooltip" title="'+ totalChargedMsgsDesc +'"></span> <i class="fa fa-tasks" aria-hidden="true"></i>  Total Charged Messages = '+  chargedSms +'');
   $('#numCharacters').val(strLen);
   $('#numSms').val(Math.ceil(longSmsCount));
  });
  
}



//SEND SMS FORM TO SERVER WITHOUT PREVIEW
function handleSmsForm(obj) {
 $('#smsModal').modal('hide');
 $('.loading-wrapper').fadeIn(500);
 google.script.run.withSuccessHandler(smsResponse).withFailureHandler(errorResponse).sendMessage(obj);
}

function errorResponse(error) {
 $('.check').html('X')
 $('.success-title').text('Ooops!');
 $('.message-success').text(error.message);
 $('.loading-wrapper').fadeOut(500);
 
 $('.message').css('width', '500px');
  
 go(50);
}

function smsResponse(response) {

var message = response.response['Message'];
var status = response.response['Success'];

if(status == 'False' || status == false) {

 $('.message').css('width', '500px');

 $('.check').html('X')
 $('.success-title').text('Ooops!');
 $('.message-success').html(message);
 $('.loading-wrapper').fadeOut(500);
 
 $('.message').css('width', '500px');
  
 go(50);
 
} else if(status == 'True' || status == true) {
 
 if(response.smsCount == 1) {
 
 $('.check').html('&#10004')
 $('.success-title').text('Success');
 $('.message-success').text(response.smsCount + ' Message Sent!');
 $('.loading-wrapper').fadeOut(500);
 $('.message').css('width', '500px');
 go(50);
 } else {
 
 $('.check').html('&#10004')
 $('.success-title').text('Success');
 $('.message-success').text(response.smsCount + ' Messages Sent!');
 $('.loading-wrapper').fadeOut(500);
 $('.message').css('width', '500px');
 go(50);
 }

}

}

function selectMessage() {

 $(document).ready(function() {

  var option = $('#select-saved option:selected').text();
  
  if(option == 'Select Message') {
  
   $('#save-msg-btn').hide();
  } else {
   $('#save-msg-btn').show();
  }
 })

 $(document).on('change', '#select-saved', function() {
  
  var option = $('#select-saved option:selected').text();
  
  if(option == 'Select Message') {
  
   $('#save-msg-btn').hide();
  } else {
   //$('#save-msg-btn').text('Delete');
   $('#save-msg-btn').show();
  }
 })
 
}

//HANDLE SAVE MESSAGE TEMPLATE
function saveTemplates() {
 $('#save-msg-btn').click(function() {
  var btn = $('#save-msg-btn').text();
  
  if(btn == 'Delete') {
   confirmDeleteTemplate();
  } else {
   handleSaveMsg();
  }
  
 });
}

function confirmDeleteTemplate() {
 var btn = $('#save-msg-btn').text();
 var smsTemp = $('#select-saved option:selected').text();
 
 if(btn == 'Delete') {
  
  if(smsTemp == 'Select Message') {
   return;
  } else {
   $('.modal-body').html('<p class="confirmDelete">Do you really want to delete "'+ smsTemp +'"?</p>');
   $('#model-btn-wrapper').html('<button id="send-sms-form" form="sms-form1" type="button" class="action deleteMessageTemplate">Yes</button><button id="close-modal" type="button">No</button>');
   $('#smsModal').modal('show');
  }
  
 }

}

function handleSaveMsg() {
 var btn = $('#save-msg-btn').text();
 var saveChckbx = $('input[name="saveMsg"]').val();
 var smsTemp = $('#select-saved').val();
 var saveInput = $('input[name="smsTemplate"]').val();
 var textarea = $('textarea[name="smstextarea"]').val();
 
 $('#smsModal').modal('hide');
 
 var obj = {};
 
 if(btn == 'Delete') {
   obj = {smsTemplate: smsTemp};
   
   if(smsTemp == 'Select Message') {
    return false;
   } else {
   
     $('.loading-wrapper h4').text('Processing...');
     $('.loading-wrapper').fadeIn(500);
     google.script.run.withSuccessHandler(saveMsgResponse).saveMessage(obj);
   }
   
 } else if(btn == 'Save') {
   obj = {saveMsg: saveChckbx, smsTemplate: smsTemp, textMessage: textarea};
   
   if(textarea == '') {
   $('.check').text('X')
   $('.success-title').text('Ooops!');
   $('.message-success').text('There is no message to be saved. Please enter a message on the text field.');
   $('.message').css('width', '300px');
   go(50);
    
   } else if(saveInput == '') { 
   
   $('.check').text('X')
   $('.success-title').text('Ooops!');
   $('.message-success').text('Enter a message name.');
   $('.message').css('width', '300px');
   go(50);
   
   } else {
   
   $('.check').html('&#10004')
   $('.success-title').text('Success');
   
   $('.loading-wrapper h4').text('Processing...');
   $('.loading-wrapper').fadeIn(500);
 
   google.script.run.withSuccessHandler(saveMsgResponse).saveMessage(obj);
   
   }
 }
 
}

function deleteMsgTemplate() {

 $(document).on('click', '.deleteMessageTemplate', function() {
  handleSaveMsg();
 });
 
}

function saveMsgResponse(templates) {

 var select = $('select[name="smsTemplate"]');
 var input = $('input[name="smsTemplate"]');
 var btn = $('#save-msg-btn').text();
 var selectVal = select.val();
 var selectText = $('#select-saved option:selected').text();
 var inputVal = input.val();
 var options = '';

 if(btn == 'Delete') {
    if(templates.Success == 'True' || templates.Success == true) {
   
     $('#model-btn-wrapper').html('<button id="send-sms-form" form="sms-form1" type="submit" class="action">Yes</button><button id="close-modal" type="button">No</button>');
    
     $('textarea[name="smstextarea"]').val('');
     $('.check').html('&#10004')
     $('.success-title').text('Success');
     $('.message-success').text('Template ' + selectText + ' has been deleted!');
    
     google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(templatesSuccess).getUserTemplates();
     
     $('.loading-wrapper').fadeOut(500);
     $('.message').css('width', '300px');
     go(50);
     
    } else {
    
     $('textarea[name="smstextarea"]').val('');
     $('.check').html('X')
     $('.success-title').text('Ooops!');
     $('.message-success').text(templates.Message);
     
     google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(templatesSuccess).getUserTemplates();
     
     $('.loading-wrapper').fadeOut(500);
     $('.message').css('width', '500px');
     go(50);
     
    }
  } else if(btn == 'Save') {
  
    if(templates.Success == 'True' || templates.Success == true) {
     $('textarea[name="smstextarea"]').val('');
     $('#saveMsg').prop('checked', false);
     $('.check').html('&#10004')
     $('.success-title').text('Success');
     $('.message-success').text('Template ' + inputVal + ' has been saved!');
     
     google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(templatesSuccess).getUserTemplates();
     
     $('.loading-wrapper').fadeOut(500);
     $('.message').css('width', '300px');
     go(50);
     
    } else {
    
     $('textarea[name="smstextarea"]').val('');
     $('#saveMsg').prop('checked', false);
     $('.check').html('X')
     $('.success-title').text('Ooops!');
     $('.message-success').text(templates.Message);
     
     google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(templatesSuccess).getUserTemplates();
     
     $('.loading-wrapper').fadeOut(500);
     $('.message').css('width', '300px');
     go(50);
     
    }
  }
 
}

function checkIfSave() {

var saveMsgHtml = $('.select-msg-temp').html();
var saveChckBx = $('#saveMsg');
  
 $(saveChckBx).click(function() {
  
  var content = '';
  
  if(saveChckBx.is(':checked') == true) {
  $('.select-msg-temp').empty();
  
  content += '<label for="select-saved" class="sr-only">Save Message</label>'
  content += '<input id="select-saved" type="text" name="smsTemplate">'
  
  $('.select-msg-temp').html(content);
  $('#save-msg-btn').text('Save');
  $('#save-msg-btn').show();
  } else if(saveChckBx.is(':checked') == false) {
  
   var charCount = $('#charCountNum').text();
   var baseCharCount = $('#charCountBase').text();
   
   $('#save-msg-btn').hide();
   $('#save-msg-btn').text('Delete');
   var templates = google.script.run.withFailureHandler(errorTemplates).withSuccessHandler(checkIfSaveSuccess).getUserTemplates();
  }
  
 });
}

function checkIfSaveSuccess(response) {
 var charCount = $('#charCountNum').text();
 var baseCharCount = $('#charCountBase').text();

 var select = $('.select-msg-temp');
 var option = '';
 option += '<option value="Select Message">Select Message</option>'
 var templates = response.Templates;
 
 for(var i = 0; i < templates.length; i++) {
  var object = templates[i];
  var templateName = object.Name;
  var templateId = object.TemplateId;
  var template = object.Template;
  option += '<option value="'+ templateId +'">'+ templateName +'</option>'
 }
 
 select.empty();
 select.html('<label for="select-saved" class="sr-only">Select Message</label><select id="select-saved" name="smsTemplate">'+ option +'</select>');
 $('#save-msg-btn').text('Delete');
 $('#save-msg-btn').css('display', 'none');
 
 $('#charCount').html('<span id="charCountNum">'+ charCount +'</span>/<span id="charCountBase">' + baseCharCount + '</span>');
}

function userTemplates(templates) {
 var content = '';
 var select = $('.select-msg-temp');
 
 for(var i = 0; i < templates.length; i++) {
  
  content += '<option value="'+ templates[i] +'">'+ templates[i] +'</option>'
  
 }
 
 select.empty();
 select.html('<label for="select-saved" class="sr-only">Select Message</label><select id="select-saved" name="smsTemplate">'+ content +'</select>');
 $('#save-msg-btn').text('Delete');
}


function go(nr) {

  $('.loading-wrapper').hide();
  $('#mask').fadeToggle(nr);

  $('.message').css('display', 'block');
  $('.bb').fadeToggle(200);
  $('.message').toggleClass('comein');
  $('.check').toggleClass('scaledown');
  $('#go').fadeToggle(nr);
  
}

function setTextMsg() {
 $(document).on('change', 'select[name="smsTemplate"]', function() {
  var selected = $(this).val();
  google.script.run.withSuccessHandler(returnedMsg).getTextMsg(selected);
 });
}

function returnedMsg(message) {
 var textarea = $('textarea[name="smstextarea"]').val();
 
 message = (message == undefined || message == null)? '' : message;
 
 $('textarea[name="smstextarea"]').val(textarea + message);
 updateCharLimit();
}

function getSelectedColumn() {
 $( '.add-to-column' ).on('click', function(){
  var select = $('select[name=addToColumn]').val();
  var cursorPos = $('#textbox').prop('selectionStart');
  var v = $('#textbox').val();
  
  var textBefore = v.substring(0,  cursorPos );
  var textAfter  = v.substring( cursorPos, v.length );
 
  if(select == '' || select.length > 1 || select == 0) {
   return;
  } else {
   $('#textbox').val( textBefore+ '#'+ select +'#' +textAfter );
   updateCharLimit();
  }
 
 });
}

function getSelectedDblClick() {
  $( '#add-to-column-text' ).on('dblclick', function(){
  var select = $('select[name=addToColumn]').val();
  var cursorPos = $('#textbox').prop('selectionStart');
  var v = $('#textbox').val();
  var textBefore = v.substring(0,  cursorPos );
  var textAfter  = v.substring( cursorPos, v.length );
  
  if(cursorPos == 0) {
 
   if(select == '' || select.length > 1 || select == 0) {
    return;
   } else {
   $('#textbox').val( textBefore+ '#'+ select +'#' +textAfter );
    updateCharLimit();
   }
   
  } else {
  
   if(select == '' || select.length > 1 || select == 0) {
    return;
   } else {
   $('#textbox').val( textBefore+ '#'+ select +'#' +textAfter );
    updateCharLimit();
   }
   
  }
  
 });
 
}


// For testing: Get last cursor position in textarea
function getLastSelection() {
 
 $('#textbox').click(function() {
  var cursorPos = $('#textbox').prop('selectionEnd');
 });
 
}

function setCaretPosition(ctrl, pos){
	if(ctrl.setSelectionRange)
	{
		ctrl.focus();
		ctrl.setSelectionRange(pos,pos);
	}
	else if (ctrl.createTextRange) {
		var range = ctrl.createTextRange();
		range.collapse(true);
		range.moveEnd('character', pos);
		range.moveStart('character', pos);
		range.select();
	}
}

function doGetCaretPosition (ctrl) {
	var CaretPos = 0;	// IE Support
	if (document.selection) {
	ctrl.focus ();
		var Sel = document.selection.createRange ();
		Sel.moveStart ('character', -ctrl.value.length);
		CaretPos = Sel.text.length;
	}
	// Firefox support
	else if (ctrl.selectionStart || ctrl.selectionStart == '0')
		CaretPos = ctrl.selectionStart;
	return (CaretPos);
}

function closeModal() {

 $(document).on('click', '#close-modal, .close', function() {
 
  
  $('#smsModal').modal('hide');
   
   //$('.loading-wrapper h4').text('Reloading...');
   //$('.loading-wrapper').fadeIn(500);
  //google.script.run.sendSms();
  counter++;
  //removejscssfile('pagination.js', 'js');

 });

 $('#smsModal').on('hide.bs.modal', function() {
 
  var previewModal = $('#dialog-modal').hasClass('preview-modal');
  
  if(previewModal == true) {

   $('#dialog-modal').removeClass('preview-modal');
   $('.loading-wrapper').fadeOut(500);

  } else {
   
   $('.loading-wrapper').fadeOut(500);
   
  }
  
 });

}

function getDuplicates() {
 $(document).on('change', '#skipDups', function() {
  var dups = $(this).is(':checked');
  
  if(dups == true) {
   $('.modal-body').html('<div><p>Remove Duplicate rows in the sheet?</p></div>');
   $('#send-sms-form').text('OK').removeProp('form');
   $('#smsModal').modal('show');
  } 
  
 });
}

function countChars() {

$('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');

$('#textbox').keyup(updateChars);
$('#textbox').keydown(updateChars);
  
}

function updateChars() {

var chars = $(this).val().length;
var lang = $('#languages').val();

 $('#charCountNum').text(chars);

 if(lang == 'en') {
  if(chars > 160) {
  $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/153) + ' (sms)</span>');
  } else if(chars <= 160) {
  $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
  } else if(chars == 0) {
  $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
  }
 } else {
  if(chars > 70) {
  $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/67) + ' (sms)</span>');
  } else if(chars <= 70) {
  $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
  } else if(chars == 0) {
  $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
  }
 }

}

function updateLangCharLimit() {

 $(document).on('change', '#languages', function() {
 var chars = $('#textbox').val().length;
  if($(this).val() == 'en') {
    if(chars == 0 || chars == '') {
     $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
    } else {
     $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/160) + ' (sms)</span>');
    }
  } else {
   if(chars == 0 || chars == '') {
    $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
   } else {
    $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/67) + ' (sms)</span>');
   }
  }
 });
 
}

function updateCharLimit() {

 var chars = $('#textbox').val().length;
  if($('#languages').val() == 'en') {
    if(chars == 0 || chars == '') {
     $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
    } else {
     $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/160) + ' (sms)</span>');
    }
  } else {
   if(chars == 0 || chars == '') {
    $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
   } else {
    $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/67) + ' (sms)</span>');
   }
  }
}

function errorTemplates(error) {

 $('.check').html('X')
 $('.success-title').text('Ooops!');
 $('.message-success').text(error.message);
 $('.loading-wrapper').fadeOut(500);
 
 $('.message').css('width', '300px');
 go(50);

}

function templatesSuccess(response) {

 var charCount = $('#charCountNum').text();
 var baseCharCount = $('#charCountBase').text();

 var select = $('.select-msg-temp');
 var option = '';
 option += '<option value="Select Message">Select Message</option>'
 var templates = response.Templates;
 
 for(var i = 0; i < templates.length; i++) {
  var object = templates[i];
  var templateName = object.Name;
  var templateId = object.TemplateId;
  var template = object.Template;
  option += '<option value="'+ templateId +'">'+ templateName +'</option>'
 }
 
 select.empty();
 select.html('<label for="select-saved" class="sr-only">Select Message</label><select id="select-saved" name="smsTemplate">'+ option +'</select>');
 $('#save-msg-btn').text('Delete');
 $('#save-msg-btn').css('display', 'none');//$('#save-msg-btn').text('Delete');
 
 $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
 
}

function getPaginateValues(itemCount, arr, arr2, elId1, elId2, elId3, nextId, prevId) {

	var item = itemCount;
    
    //if(item > 0) { item = 0; }
	
	$(document).on('click', '#'+ nextId +'', function() {

		item++;
		item = item % arr.length;
		var itemCount = item;

		$('#'+ elId1 +'').val(arr[item]);
		$('#'+ elId2 +'').val(arr2[item]);
		$('#'+ elId3 +'').text(itemCount+1);
		
		
	})

	$(document).on('click', '#'+ prevId +'', function() {

		if(item === 0) {
			item = arr.length;
		}

		item--;
		var itemCount = item;

		$('#'+ elId1 +'').val(arr[item]);
		$('#'+ elId2 +'').val(arr2[item]);
		$('#'+ elId3 +'').text(itemCount+1);
	
	})
    
    item = 0;

}

function enableReportTimeFormat() {
 $('#reportFromDateTime-wrapper').on('click', function() {
  $('#reportFromDateTime').removeAttr('disabled').css({'background': '#fff', 'color': '#000'});
 });
 
 $('#reportToDateTime-wrapper').on('click', function() {
  $('#reportToDateTime').removeAttr('disabled').css({'background': '#fff', 'color': '#000'});
 });
}

</script>
