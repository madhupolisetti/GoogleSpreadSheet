// This are the JS functions under the "Language.html" HTML file of the Spreadsheet where the source code lives.
// @ Source Sheet: https://script.google.com/macros/d/MP7J2r1pf6COdv5q-h04adXGX9fKgVtti/edit?uiv=2&mid=ACjPJvFDwhM6hb3Kp0JzLJA14t2yZ9ZmGJORrPkcyOX1w5vbsGa4Axfb0vRh6xK8sFMns_WD9S-nzwjTytFbig8Vg7bWFxrO57kARYgWJkYRF7kMl1bmTlhekVBVvDH3IkqX9tcrqYOgFDY


<script>

$(function() {
languages();
translate();
showTranslationBox();
enableTranslation();


if($('.translated-text').text() == 'waiting...') {
 $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
}

// Set default selected options to English.
$('#languages option[value=en]').attr('selected', 'selected');

});

function languages() {

 var langCode = [
  "af",
  "sq",
  "ar",
  "hy",
  "az",
  "eu",
  "be",
  "bn",
  "bs",
  "bg",
  "ca",
  "ceb",
  "ny",
  "zh-CN",
  "zh-TW",
  "hr",
  "cs",
  "da",
  "nl",
  "en",
  "eo",
  "et",
  "tl",
  "fi",
  "fr",
  "gl",
  "ka",
  "de",
  "el",
  "gu",
  "ht",
  "ha",
  "iw",
  "hi",
  "hmn",
  "hu",
  "is",
  "ig",
  "id",
  "ga",
  "it",
  "ja",
  "jw",
  "kn",
  "kk",
  "km",
  "ko",
  "lo",
  "la",
  "lv",
  "lt",
  "mk",
  "mg",
  "ms",
  "ml",
  "mt",
  "mi",
  "mr",
  "mn",
  "my",
  "ne",
  "no",
  "fa",
  "pl",
  "pt",
  "pa",
  "ro",
  "ru",
  "sr",
  "sn",
  "si",
  "sk",
  "sl",
  "so",
  "es",
  "su",
  "sw",
  "sv",
  "tg",
  "ta",
  "te",
  "th",
  "tr",
  "uk",
  "ur",
  "uz",
  "vi",
  "cy",
  "yi",
  "yo",
  "zu"
 ];
 var lang = [
  "Afrikaans",
  "Albanian",
  "Arabic",
  "Armenian",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bosnian",
  "Bulgarian",
  "Catalan",
  "Cebuano",
  "Chichewa",
  "Chinese Simplified",
  "Chinese Traditional",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Filipino",
  "Finnish",
  "French",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Korean",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Myanmar (Burmese)",
  "Nepali",
  "Norwegian",
  "Persian",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Serbian",
  "Shona",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sudanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Telugu",
  "Thai",
  "Turkish",
  "Ukrainian",
  "Urdu",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Yiddish",
  "Yoruba",
  "Zulu"
 ];
 
 var language
 var languageCode
 var option = '';
 var select;
 
 var auto = '<option value="auto">Auto</option>';
 
 for(var i = 0; i < lang.length; i++) {
  language = lang[i];
  option += '<option value="'+ langCode[i] +'">'+ language +'</option>'
 }
 
 $('#language-origin').html(auto + option);
 $('#languages').html(option);
}

function translate() {
 
 var textarea = $('#textbox');
 
 $(document).on('keyup focus', '#textbox', function(event) {//$(document).on('keyup', '#textbox', function(event)
  var origin = $('#language-origin').val();
  var dest = $('#languages').val();
  var text = textarea.val();
  var enableTranslate = $('input[name=translateChckBx]').is(':checked');
  
  if(enableTranslate == true) {
   text = text.replace(/\n/g, '<br>');
   google.script.run.withSuccessHandler(insertTranslatedText).translateText(text, origin, dest);
  } else {
   return;
  }

 });
 
 $(document).on('change', '#languages', function(event) {//$(document).on('keyup', '#textbox', function(event)
  var origin = ( $('#language-origin').val() == undefined || $('#language-origin').val() == null )? '' : $('#language-origin').val();//$('#language-origin').val();
  var dest = $('#languages').val();
  var text = textarea.val();
  var enableTranslate = $('input[name=translateChckBx]').is(':checked');
  
  if(enableTranslate == true) {
  
   text = text.replace(/\n/g, '<br>');
  
   google.script.run.withSuccessHandler(insertChangedLangTranslatedText).translateText(text, origin, dest);
  } else {
   return;
  }

 });
 
}

function insertTranslatedText(translatedText) {
 
 //var span = translatedText.replace(/<span class="notranslate">|<\/span>/g, '');
 //span = span.replace(/(#)(\s)+[\.]/g, '#.');
 //span = span.replace(/(#)(\s)+[,]/g, '#,');
 
 var languages = $('#languages');

 if($('#textbox').val().length == '') {
  $('.translated-text').html('<span style="color: #999;">waiting...</span>');
 } else {
  $('#translation div.translated-text').html(translatedText);
 }

 var chars = ($('#translation .translated-text').text() == 'waiting...') ? 0 : $('#textbox').val().length;//$('#translation .translated-text').text().length;
 
 if($(languages).val() == 'en') {
    if(chars == 0 || chars == '') {
        $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
      } else if(chars == 'waiting...') {
        $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
      } else {
        $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/160) + ' (sms)</span>'); //Math.ceil(chars/160)
      }
     } else {
     if(chars == 0 || chars == '') {
       $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
       } else if(chars == 'waiting...') {
         $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
       } else {
       $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/67) + ' (sms)</span>');
     }
  }
}

function insertChangedLangTranslatedText(translatedText) {

 //var span = translatedText.replace(/<span class="notranslate">|<\/span>/g, '');
 //span = span.replace(/(#)(\s)+[\.]/g, '#.');
 //span = span.replace(/(#)(\s)+[,]/g, '#,');
 
 var languages = $('#languages');

 if($('#textbox').val().length == '') {
  $('.translated-text').html('<span style="color: #999;">waiting...</span>');
 } else {
  $('#translation div.translated-text').html(translatedText);
  var translated = $('#translation div.translated-text').html();
  
  translated = translated.replace(/<br>/g, '\n');
  
  translated = translated.replace(/^ +/gm,'')//(/^\s+|\s+$/gm,'');

  $('#textbox').val(translated);
 }

 var chars = ($('#translation .translated-text').text() == 'waiting...') ? 0 : $('#translation .translated-text').text().length;
 
 if($(languages).val() == 'en') {
    if(chars == 0 || chars == '') {
        $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
      } else if(chars == 'waiting...') {
        $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
      } else {
        $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/160) + ' (sms)</span>');
      }
     } else {
       if(chars == 0 || chars == '') {
       $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
       } else if(chars == 'waiting...') {
         $('#charCount').html('<span id="charCountNum">'+ 0 +'</span>/<span id="charCountBase">' + 1 + ' (sms)</span>');
       } else {
       $('#charCount').html('<span id="charCountNum">'+ chars +'</span>/<span id="charCountBase">' + Math.ceil(chars/67) + ' (sms)</span>');
     }
  }
}

function showTranslationBox() {
 
 $("#textbox, .translated-text").focus(function(){
 
   if($('input[name=translateChckBx]').is(':checked') == true) {
    $('.translated-text').text('Loading...');
    $("#translation").fadeIn(100);
   } else {
    return;
   }
    
  });
    
    $('#add-to-column-text').dblclick(function() {
      if($('input[name=translateChckBx]').is(':checked') == true) {
      
      $("#translation").show();
      } else {
      return;
   }
    });
    
    
    $("#textbox, .translated-text").blur(function(){
        if($('input[name=translateChckBx]').is(':checked') == true) {
        
        $("#translation").fadeOut(100);
        
         var trans = $("#translation .translated-text").text();
         var translated = $("#translation .translated-text").html();
         
         translated = translated.replace(/<br>/g, '\n');
         
         translated = translated.replace(/^ +/gm,'')//(/^\s+|\s+$/gm,'');
         
         if(trans == 'Loading...' || trans == 'waiting...') {
          $('#textbox').val($('#textbox').val());
         } else if($('#textbox').val() == '' && trans.length > 0) {
          $('#textbox').val($('#textbox').val());
         } else {
          $('#charCountNum').text(translated.length);
          $('#textbox').val(translated);
         }
         
        } else {
        
        $('.translated-text').text('');
        return;
        
        }
    });
 
}

function enableTranslation() {
 
 $(document).on('click', 'input[name=translateChckBx]', function() {
  if($(this).is(':checked') ==  true) {
   $('#language-origin').removeAttr('disabled');
   $('#languages').removeAttr('disabled');
  
  } else {
   
   $('#language-origin').attr('disabled', true);
   $('#languages').attr('disabled', true);
  
  }
 })
}

</script>