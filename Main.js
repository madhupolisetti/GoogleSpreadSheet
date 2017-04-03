// This are the Apps Scripts functions under the "Main.gs" script file of the Spreadsheet where the source code lives.
// @ Source Sheet: https://script.google.com/macros/d/MP7J2r1pf6COdv5q-h04adXGX9fKgVtti/edit?uiv=2&mid=ACjPJvFDwhM6hb3Kp0JzLJA14t2yZ9ZmGJORrPkcyOX1w5vbsGa4Axfb0vRh6xK8sFMns_WD9S-nzwjTytFbig8Vg7bWFxrO57kARYgWJkYRF7kMl1bmTlhekVBVvDH3IkqX9tcrqYOgFDY

var ui = SpreadsheetApp.getUi();
var userProps = PropertiesService.getUserProperties();

function onInstall(e) {
  onOpen(e);
}

function onOpen(e) {
  
  var prop = userProps.getProperty('LoginStatus');
  
  if(prop == 'void' || prop == null) {
    
    ui.createAddonMenu()
    .addItem('Login', 'login')
    .addToUi();
    
  } else if(prop == 'valid') {
    
    addSettings();
    
  }
}

function activeSheetName() {
  var ss = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();
  return ss;
}

function saveLoginStatus(status) {
  userProps.setProperty('LoginStatus', status);
}

function saveUserInfo(authKey, authToken) {
  userProps.setProperties({authKey: authKey, authToken: authToken});
}

function deleteUserInfo() {
  userProps.deleteProperty('authKey');
  userProps.deleteProperty('authToken');
}

function addSettings() {
  ui.createAddonMenu()
  .addItem('Send SMS', 'sendSms')
  .addSeparator()
  .addItem('Delivery Reports', 'getReportsTemplate')
  .addSeparator()
  .addItem('Get Credit Balance', 'getBalance')
  .addSeparator()
  .addItem('Sign out', 'logOut')
  .addToUi();
}

function login() {
  getTemplate('Login', 'User Authentication', 600, 250);
}

function include(templateName) {
  var template = HtmlService.createTemplateFromFile(templateName)
  .evaluate()
  .getContent();
  
  return template;
}

//@param templateName (string) name of the template
function getTemplate(templateName, title, width, height) {
  
  var template = HtmlService.createTemplateFromFile(templateName);
  var setTemplate;
  
  if(width == undefined || width == null) {
  
  setTemplate = template.evaluate()
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  
  return ui.showModalDialog(setTemplate, title);
  
  } else if((width != undefined || width != null) && (height == undefined || height == null)) {
  
  setTemplate = template.evaluate()
  .setWidth(width)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    
  return ui.showModalDialog(setTemplate, title);
    
  } else if((width != undefined || width != null) && (height != undefined || height != null)) {
  
  setTemplate = template.evaluate()
  .setWidth(width)
  .setHeight(height)
  .setSandboxMode(HtmlService.SandboxMode.IFRAME);
    
  return ui.showModalDialog(setTemplate, title);
  
  }
}

/**
* Validate Login Input
*/

function validateLogin(obj) {
 
  var status;
  var message;
  var response = validateSMSLogin(obj.authkey, obj.authtoken);
  
  if(response.success == true) {
    status = 'valid';
    message = response.message;
    
    var loginStat = saveLoginStatus(status);
    
    addSettings();
    saveUserInfo(obj.authkey, obj.authtoken);
    
    return({status: status, message: message});
    
  } else if(response.success == false) {
    status = 'void';
    message = response.message;
    var loginStat = saveLoginStatus(status);
    
    return({status: status, message: message});
  }

}

function getSettingsPage() {
  getTemplate('Settings', 'Settings', 900, 500);
}

function logOut() {
 
  var prompt = ui.alert('SMSCountry.com', 'You\'re about to sign out from your SMSCountry Account. Would you like to proceed?', ui.ButtonSet.OK_CANCEL);
  
  if(prompt == ui.Button.OK) {
    
    deleteUserInfo();
  
    ui.createAddonMenu()
    
    .addItem('Login', 'login')
    .addToUi();
    
    ui.alert('SMSCountry.com', 'You have successfully logged out!', ui.ButtonSet.OK);
    
  } else if(prompt == ui.Button.CANCEL) {
    return;
  }
  
}

function sendSms() {

  try {
    
    checkHeaders();
  
  } catch(err) {
    var alert = ui.alert('SMSCountry', 'Sheet is empty. There are no columns to filter. Please create your columns with your data and try again.', ui.ButtonSet.OK);
    
    if(alert == ui.Button.OK) { return; }

  }
  
  deleteEmptyRows();
  var invalidCells = getInvalidRows();
  
  if(invalidCells == false) {
    return;
  } else if(invalidCells == true) {
    getTemplate('SmsSettings', 'SMSCountry', 920, 600);
  }
  
  //getMobileColumn();
  
  //getTemplate('SmsSettings', 'SMSCountry', 920, 600);
}

function getBalance() {
 getTemplate('BalanceTemplate', 'SMSCountry', 600,280);
}


function columnToLetter(column)
{

  var temp, letter = '';
  while (column > 0)
  {
    temp = (column - 1) % 26;
    letter = String.fromCharCode(temp + 65) + letter;
    column = (column - temp - 1) / 26;
  }
  return letter;
}

function letterToColumn(letter)
{
  var column = 0, length = letter.length;
  for (var i = 0; i < length; i++)
  {
    column += (letter.charCodeAt(i) - 64) * Math.pow(26, length - i - 1);
  }
  return column;
}

function getColumns() {
  var letterArr = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var columns = sheet.getLastColumn();
  
  for(var i = 1; i < columns+1; i++) {
    var colLetter = columnToLetter(i);
    
    letterArr.push(colLetter);
  }
  return letterArr;
}

//******SEND MESSAGES*******//

function confirmMessage(obj) {

  var ignoreDups = (obj.skipDups == undefined || obj.skipDups == null || obj.skipDups == false) ? 'off' : 'on';
  
  if(ignoreDups == 'on') { removeDuplicates(); }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range;
  
  sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).setNumberFormat('@STRING@');
  
  var filter = obj.filterrows;
  var startRow = obj.startRow;
  var endRow = obj.endRow;
  var rowRanges = obj.rowRanges;
  var message = obj.textarea;
  var preview = obj.preview;
  var mobileCol = obj.mobileCol;
  var invalidMobileRows;
  
  var maxRowHeight = getRowHeightContent();
  
  if(message == '' || message == undefined || message == null) {return({status: false, range: '<strong>SMS template is blank.</strong>'});}
  
  if(filter == undefined || filter == null) {

    return({status: false, range: '<strong>Invalid Range!</strong>. <br> No Filter Chosen'});
    
  } else {
    
    if(filter == 'rowFilters') {

      invalidMobileRows = checkMobileColumnValues(startRow, endRow, mobileCol);
      
      if(((startRow == '' || endRow == '') && preview == true) || startRow == '' || endRow == '') {
        
        return({status: false, range: '<strong>Invalid Range!</strong>. <br> Start and End Fields must have a value.'});
        
      } else if(((parseInt(endRow) < parseInt(startRow)) && preview == true) || parseInt(endRow) < parseInt(startRow)) {
        
        return({status: false, range: '<strong>Invalid Range!</strong>. <br> End Row is less than Start Row.'});
        
      } else if(endRow > maxRowHeight) {
      
        return({status: false, range: '<strong>Invalid Range!</strong>. <br> Last row with data is row ' + maxRowHeight + '. The end row field is ' + endRow + '.'});
      
      } else if(invalidMobileRows.length > 0) {
      
        if(invalidMobileRows.length == 1) {
          return({status: false, range: 'Row ' + invalidMobileRows.toString() + ' of column '+ mobileCol +' does not have a valid mobile number.'});
        } else {
          invalidMobileRows.splice(invalidMobileRows.length-1,0, ' and ');
          return({status: false, range: 'Rows ' + invalidMobileRows.toString().replace(', and ,', ' and ') + ' of column '+ mobileCol +' does not have a valid mobile number.'});
        }
      
      } else {
        
        range = sheet.getRange(mobileCol + parseInt(startRow) + ':' + mobileCol + parseInt(endRow));
            
        if(preview == true) {
 
         return({status: 'preview', range: range.getValues().length});
          
        } else {
   
         return({status: true, range: range.getValues().length});
          
        }
        
      }
    } else if(filter == 'filterbyRange') {
      
      if(rowRanges == '' || rowRanges == undefined || rowRanges == null) {
        
        return({status: false, range: '<strong>Invalid Range!</strong>. <br> Please enter a range.'});
        
      } else {
        
        var mobileNum = mobileCol;
        var arrRanges = rowRanges.split(',');
        arrRanges = arrRanges.map(validateFilters);
        
        try {
          
          var ranges = arrRanges.map(function(arrRanges) {
            return getFilteredRanges(arrRanges.startrow, arrRanges.endrow, mobileNum);
          });
          
        } catch(err) {
          
          var msg = 'Range is invalid. Please see required formats below: <br><br>* Format should be Start Row - End Row. Example: 2-10.<br><br>* For multiple ranges, separate range with comma. Example: 2-3, 7-9.<br><br>* Start Row cannot be less than the End Row.';
          var outPut = {status: false, range: msg};
          return outPut;
          
        }
        
        var userEndRow = parseInt(rowRanges.match(/[\d]+$/g));
        
        if(userEndRow > maxRowHeight) {
          return({status: false, range: '<strong>Invalid Range!</strong>. <br> Last row with data is row ' + maxRowHeight + '. The end row of the selected range is ' + userEndRow + '.'});
        }
        
        invalidMobileRows = arrRanges.map(function(arrRanges) {
          return checkMobileColumnValues(arrRanges.startrow, arrRanges.endrow, mobileCol);
        });
        
        var invalidMobileArray = [].concat.apply([], invalidMobileRows);
 
        if(invalidMobileArray.length > 0) {
          
          if(invalidMobileArray.length == 1) {
            return({status: false, range: 'Row ' + invalidMobileArray.toString() + ' of column '+ mobileCol +' does not have a valid mobile number.'});
          } else {
            invalidMobileArray.splice(invalidMobileArray.length-1,0, ' and ');
            return({status: false, range: 'Rows ' + invalidMobileArray.toString().replace(', and ,', ' and ') + ' of column '+ mobileCol +' does not have a valid mobile number.'});
          }
        
        }
        
        var arrme = rowRanges.split(',');
        
        var rows = 0;
        
        var rangeInput = arrme.map(validateFilters);
       
        for(var key in rangeInput) {
           
          if((rangeInput == false && preview == true) || rangeInput == false) {
            
          return({status: false, range: '<strong>Invalid Range!</strong>. <br> Follow the required format. Example: 2-2, 27-35.'});
            
          } else if(rangeInput[key].status == true) {
            
            range = sheet.getRange(mobileCol + rangeInput[key].startrow + ':' + mobileCol + rangeInput[key].endrow);
            
            rows += range.getValues().length;

          }
          
        }
        
        if(preview == true) {
          
          return({status: 'preview', range: rows});
          
        } else {
          
          return({status: true, range: rows});
          
        }
        
      }
      
    } else if(filter == 'selectAll') {
      
      range = sheet.getRange(2, 1, sheet.getLastRow(), 1);
      
      if(preview == true) {
   
        return({status: 'preview', range: range.getNumRows()-1});
        
      } else {
        
        var invalidMobileRows = checkMobileValuesSelectAll(mobileCol);
        
        if(invalidMobileRows.length > 0) {
          
          if(invalidMobileRows.length == 1) {
            return({status: false, range: 'Row ' + invalidMobileRows.toString() + ' of column '+ mobileCol +' does not have a valid mobile number.'});
          } else {
            invalidMobileRows.splice(invalidMobileRows.length-1,0, ' and ');
            return({status: false, range: 'Rows ' + invalidMobileRows.toString().replace(', and ,', ' and ') + ' of column '+ mobileCol +' does not have a valid mobile number.'});
          }
        
        }
      
        return({status: true, range: range.getNumRows()-1});
        
      }
      
    }
  } 
  
}

function sendMessage(obj) {

  var ignoreDups = (obj.ignoreDups == undefined || obj.ignoreDups == null || obj.ignoreDups == '') ? 'off' : obj.ignoreDups;
 
  var status;
  
  var userStartRow = obj.startRow;
  var userEndRow = obj.endRow;
  var userRowRanges = obj.rowRanges;
  var filterOption = obj.filterrows;
 
  var userName = userProps.getProperty('username');
  var pw = userProps.getProperty('password');
  var sId = obj.senderId;
  
  var userMobileNumberColumn = letterToColumn(obj.mobileNumberColumn);
  var message = obj.smstextarea;
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getActiveSheet();
  var sheetName = activeSheet.getName();
  
  if(message == '') {
    return({smsCount: 'No Message'});
  } else {
    return replacePlaceholder(filterOption, message, userStartRow, userEndRow, userRowRanges, userMobileNumberColumn, sId);
  }
  
}

// Get total number of rows with content;
function getRowHeightContent() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  try {
  
  var rowRange = sheet.getRange(2, 1, sheet.getLastRow()).getHeight();
    
  return rowRange;
    
  } catch(e) {
    
    var sheetName = sheet.getName();
    var reminder = ui.alert('SMSCountry!', sheetName + ' is empty. There are no columns to filter.', ui.ButtonSet.OK);
    
    if(reminder == ui.Button.OK) {
      return;
    }
    
  }
  
  
}

function matchRange(filter) {
  var startRowPatt = /^[\d]*/gi;
  var endRowPatt = /[^-]+$/gi;
  var start = filter.match(startRowPatt);
  var end = filter.match(endRowPatt);
  return({start: start.toString(), end: end.toString()});
}

// Handles the Row Ranges Filter Submitted
function validateFilters(userFilter) {
  var arr = [];
  //var userFilter = '3-5,7-8';
  userFilter = userFilter.trim();
  var check;
  var status;
  var validateRange;
  var filter = userFilter;
// RexExp pattern to check Row Range Value
  var pattern = /^[\d]+(-\d*){1,1}$/gi;
  var pattern = /[\d]+(-\d*)/g;
  var startRowPatt = /^[\d]*/gi;
  var endRowPatt = /[^-]+$/gi;
  
  validateRange = filter.match(pattern);
  
    if(validateRange == null) {
  
      status = false;
      return(status);
      
    } else if(validateRange != null) {
      
      status = true;
      var startRow = userFilter.match(startRowPatt);
      var endRow = userFilter.match(endRowPatt);
    
      if(parseInt(endRow) < parseInt(startRow)) {
        
        status = false;
        return status;
        
      } else {
       
        status = true;
        var results = {status: status, startrow: parseInt(startRow), endrow: parseInt(endRow)};
        return results;
      }
     
    }
  
}

function getStr(string) {

	string.toString().split(/^[\.]$/g);
	return string.toString();
}

function replacePlaceholder(filterOption, string, userStartRow, userEndRow, userRowRanges, mobile, sId) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getSheetByName(activeSheetName());
  
  var rangeFilterArr = [];
  var rangeFilterArr2 = [];
  var rangeLength;
  var range;
  var rangeMobile;
  var mobileNum = mobile;
  
  activeSheet.getRange(1, 1, activeSheet.getLastRow(), activeSheet.getLastColumn()).setNumberFormat('@STRING@');
  
  var patt = /#[A-Z]#/g;
  var patt2 = /[A-Z]/g;
  var holders = (string.match(patt) == null) ? string : string.match(patt);
 
  var obj = {};
  var objArr = [];
  var mobileArr = [];
  
  if(filterOption == undefined || filterOption ==  null) { return({smsCount: 'No Filter Chosen'})}
  
  if(filterOption == 'rowFilters') {
    
    if(parseInt(userEndRow) < parseInt(userStartRow)) {
     
      return({smsCount: 'Invalid range'});
      
    } else {
      
      rangeLength = activeSheet.getRange(columnToLetter(mobile) + parseInt(userStartRow) + ':' + columnToLetter(mobile) + parseInt(userEndRow)).getValues();
      rangeMobile = activeSheet.getRange(columnToLetter(mobile) + parseInt(userStartRow) + ':' + columnToLetter(mobile) + parseInt(userEndRow)).getValues().toString();
      
      rangeMobile = rangeMobile.split(',');
      var validateNum = rangeMobile[0];
      
      var mobileArray = validateMobile(rangeMobile);
      
      if(mobileArray.length > 1) {        
        return ({smsCount: rangeLength.length, response: {Message: 'There are rows in the sheet that have invalid mobile numbers. Make sure the column selected in the "Mobile Numbers Column" contains the mobile numbers where you want to send the message.', Success: 'False'}});
      } 
      
      
      
      try {
        for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
          var column = holder.replace(/^#|#$/g,'');
          range = activeSheet.getRange(column + parseInt(userStartRow) + ':' + column + parseInt(userEndRow)).getValues();
          range = range.map(getStr);
          
          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';
          obj[holder] = range;
          
        } 
      } catch(err) {
        Logger.log(err);
          
          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';

      }
    
      var send = sendCustomizedSms(obj);
      return ({smsCount: rangeLength.length, response: send});
      
      
    }
    
  } else if(filterOption == 'filterbyRange') {
    
    var rangeFilterMobile = [];
    var rangeFilterRange = [];
    var rangeFilterInvalid = [];
    
    var msgCount = 0;
    var arrRanges = userRowRanges.split(',');
    arrRanges = arrRanges.map(validateFilters);
    
    try {
      
      var ranges = arrRanges.map(function(arrRanges) {
        return getFilteredRanges(arrRanges.startrow, arrRanges.endrow, mobileNum);  
      });
      
    } catch(err) {
  
      var msg = 'Range is invalid. Please see required formats below: <br><br>* Format should be Start Row - End Row. Example: 2-10.<br><br>* For multiple ranges, separate range with comma. Example: 2-3, 7-9.<br><br>* Start Row cannot be less than the End Row.';
      var outPut = {response: {Success: 'False', Message: msg}};
      return outPut;
      
    }
      
      for(var i = 0; i < ranges.length; i++) {
        var rowsRange = ranges[i][0];
        var mobileRange = ranges[i][1];
        var invalidRange = ranges[i][4];
        
        rangeFilterRange.push(rowsRange);
        rangeFilterMobile.push(mobileRange);
        rangeFilterInvalid.push(invalidRange);
        
      }
      
      var mergeRange = [].concat.apply([], rangeFilterRange);
      var mergeMobileRange = [].concat.apply([], rangeFilterMobile);
      var mergeInvalidRange = [].concat.apply([], rangeFilterInvalid);
    
      msgCount += mergeRange.length;
      
      for(var key in arrRanges) {
        
        var start = arrRanges[key].startrow;
        var end = arrRanges[key].endrow;
        var stat = arrRanges[key].status;
        
        if(arrRanges[key].status == 'False' || arrRanges[key].status == false || arrRanges[key].status == undefined) {
          
          return({smsCount: 'Invalid Format', response: {Message: 'End row should not be less than Start row', Success: false}});
          
        } else if(arrRanges[key].status == 'True' || arrRanges[key].status == true) {
          rangeLength = activeSheet.getRange(columnToLetter(mobile) + start + ':' + columnToLetter(mobile) + end).getValues();
          rangeMobile = activeSheet.getRange(columnToLetter(mobile) + start + ':' + columnToLetter(mobile) + end).getValues().toString();
          rangeMobile = rangeMobile.split(',');
       
          var mobileArray = validateMobile(rangeMobile);
          
          if(mobileArray.length >= 1) {
            return ({smsCount: rangeLength.length, response: {Message: 'There are rows in the sheet that have invalid mobile numbers. Make sure the column selected in the "Mobile Numbers Column" contains the mobile numbers where you want to send the message.', Success: 'False'}});
          } 
          
        }
        
        try {
          
          for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
          var column = holder.replace(/^#|#$/g,'');
          range = activeSheet.getRange(column + start + ':' + column + end).getValues();
          range = range.map(getStr);
          
          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';
          obj[holder] = range;
          
        } 
        
        } catch(err) {
          Logger.log(err);
          /*return ({smsCount: rangeLength.length, response: {Message: 'Message does not have any placeholder (ex: #A#, #B#, #C#).', Success: 'False'}});*/
          //return({smsCount: rangeLength.length, response: {Message: err, Success: 'False'}});
          
          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';
          
        }
        
        var send = sendCustomizedSms(obj);
        
      }
  
    return ({smsCount: msgCount, response: send});
    
  } else if(filterOption == 'selectAll') {
    
    rangeLength = activeSheet.getRange(2,1,activeSheet.getLastRow()-1,1).getValues();
    rangeMobile = activeSheet.getRange(2, mobileNum, activeSheet.getLastRow()-1, 1).getValues().toString();
    rangeMobile = rangeMobile.split(',');
    var validateNum = rangeMobile[0];
    
    var mobileArray = validateMobile(rangeMobile);
      
      if(mobileArray.length > 1) {
        return ({smsCount: rangeLength.length, response: {Message: 'There are rows in the sheet that have invalid mobile numbers. Make sure the column selected in the "Mobile Numbers Column" contains the mobile numbers where you want to send the message.', Success: 'False'}});
      } 
    
    try {
      for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
          var column = letterToColumn(holder.replace(/^#|#$/g,''));
          range = activeSheet.getRange(2, column, activeSheet.getLastRow()-1, 1).getValues();
          range = range.map(getStr);
          
          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';
          obj[holder] = range;
          
        } 
    } catch(err) {
      Logger.log(err);

          obj['IsCustomised'] = true;
          obj['Text'] = string;
          obj['Numbers'] = rangeMobile; 
          obj['SenderId'] = (sId == 'No Sender IDs') ? '' : sId;
          obj['Tool'] = 'GoogleSpreadSheet';
      
    }
    
      var send = sendCustomizedSms(obj);
      return ({smsCount: rangeLength.length, response: send});
  } 
}

function checkProps() {
  var msgs = userProps.getProperty('messages');
  var mobNum = userProps.getProperty('mobileNumbrs');
  
  return({messages: msgs, mobile: mobNum});
}

function deleteSmsProps() {
  
 userProps.deleteProperty('messages');
 userProps.deleteProperty('mobileNumbrs');
  
 var t = userProps.getKeys();
  
}

function getHolders(holdersArray) {
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
}

function getFilteredRanges(startRow, endRow, mobileNum) {
 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  var invalidArrayMobile = [];
  var invalidArrayRow = [];
  
  var range = sheet.getRange("A" + startRow + ":" + columnToLetter(sheet.getLastColumn()) + endRow).getValues();
  var mobile = sheet.getRange(columnToLetter(mobileNum) + startRow + ":" + columnToLetter(mobileNum) + endRow).getValues();
  
  var rangeA1Notation = sheet.getRange("A" + startRow + ":" + columnToLetter(sheet.getLastColumn()) + endRow).getA1Notation();
  var mobileA1Notation = sheet.getRange(columnToLetter(mobileNum) + startRow + ":" + columnToLetter(mobileNum) + endRow).getA1Notation();
  
  var invalidRowsArr = getInvalidRows(startRow, endRow);
  
  return([range, mobile, rangeA1Notation, mobileA1Notation, invalidRowsArr]);
}

function replacePlaceholder2(filterOption, string, userStartRow, userEndRow, userRowRanges, mobile, sId, languageOrigin, targetLang, isEnabledTranslate) {
  
  var msg;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var activeSheet = ss.getSheetByName(activeSheetName());
  
  var rangeLength;
  
  var filterRange;
  var range;
  var rangeMobile;
  var mobileNum = letterToColumn(mobile);
  
  var maxRowHeight = getRowHeightContent();
  
  activeSheet.getRange(1, 1, activeSheet.getLastRow(), activeSheet.getLastColumn()).setNumberFormat('@STRING@');
  
  var patt = /#[A-Z]#/g;
  var patt2 = /[A-Z]/g;
  var holders = (string.match(patt) == null) ? string : string.match(patt);
  
  var obj = {};
  var objArr = [];
  var mobileArr = [];
  var invalidMobileRows;
  
  var outPut;
  
  if(filterOption == undefined || filterOption ==  null) { return({smsCount: 'No Filter Chosen'})}
  
  if(filterOption == 'rowFilters') {
    
    var invalidMobileRows = checkMobileColumnValues(userStartRow, userEndRow, mobile);
    
    if(parseInt(userEndRow) < parseInt(userStartRow)) {
     
      return({smsCount: 'Invalid range'});
      
    } else if(userEndRow > maxRowHeight) {
    
      return({status: 'False', smsCount: 'Last row with data is row ' + maxRowHeight + '. The end row of the selected range is ' + userEndRow + '.'});
      
    } else if(invalidMobileRows.length > 0) {
    
      if(invalidMobileRows.length == 1) {
        return({status: 'False', messages: 'Row ' + invalidMobileRows.toString() + ' of column '+ mobile +' does not have a valid mobile number.'});
      } else {
        invalidMobileRows.splice(invalidMobileRows.length-1,0, ' and ');
        return({status: 'False', messages: 'Rows ' + invalidMobileRows.toString().replace(', and ,', ' and ') + ' of column '+ mobile +' does not have a valid mobile number.'});
      }
      
    } else {
      
      filterRange = activeSheet.getRange(mobile + parseInt(userStartRow) + ':' + mobile + parseInt(userEndRow)).getHeight();
      range = activeSheet.getRange(parseInt(userStartRow), 1, filterRange, activeSheet.getLastColumn()).getValues();
      rangeMobile = activeSheet.getRange(parseInt(userStartRow), mobileNum, filterRange, 1).getValues();
  
      for(var i = 0; i < range.length; i++) {
        var row = range[i];
        
        for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
  
          var column = letterToColumn(holder.replace(/^#|#$/g,''))-1;
          
          
          obj[holder] = row[column];
          
        } 
        
        if(isEnabledTranslate == true) {
        
          var replace = replacePlaceholders(string, obj);
          replace = translateTextPreview(replace, languageOrigin, targetLang);
          objArr.push(replace);
          mobileArr.push(rangeMobile[i].toString());
        
        } else if (isEnabledTranslate == false) {
        
          var replace = replacePlaceholders(string, obj);
          objArr.push(replace);
          mobileArr.push(rangeMobile[i].toString());

        }
      }
    }
    outPut = {status: 'True', smsCount: filterRange, messages: objArr, mobileNumbrs: mobileArr, language: targetLang};
  
    return(outPut);
     
  } else if(filterOption == 'filterbyRange') {
    
    var rangeFilterMobile = [];
    var rangeFilterRange = [];
    var rangeFilterInvalid = [];
    
    var arrRanges = userRowRanges.split(',');
    arrRanges = arrRanges.map(validateFilters);
    
    try {
      
      var ranges = arrRanges.map(function(arrRanges) {
      return getFilteredRanges(arrRanges.startrow, arrRanges.endrow, mobileNum);
    });
      
    } catch(err) {
      
      msg = 'Range is invalid. Please see required formats below: <br><br>* Format should be Start Row - End Row. Example: 2-10.<br><br>* For multiple ranges, separate range with comma. Example: 2-3, 7-9.<br><br>* Start Row cannot be less than the End Row.';
      outPut = {status: 'False', smsCount: 'N/A', messages: msg, mobileNumbrs: 'N/A', language: 'N/A'};
      return outPut;
      
    }
    
    var userLastRowRange = parseInt(userRowRanges.match(/[\d]+$/g));
    
    if(userEndRow > maxRowHeight) {
      return({status: false, smsCount: '<strong>Invalid Range!</strong>. <br> Last row with data is row ' + maxRowHeight + '. The end row of the selected range is ' + userLastRowRange + '.'});
    }
    
    invalidMobileRows = arrRanges.map(function(arrRanges) {
      return checkMobileColumnValues(arrRanges.startrow, arrRanges.endrow, mobile);
    });
        
    var invalidMobileArray = [].concat.apply([], invalidMobileRows);
    
    if(invalidMobileArray.length > 0) {
      
      if(invalidMobileArray.length == 1) {
        return({status: false, smsCount: 'Row ' + invalidMobileArray.toString() + ' of column '+ mobile +' does not have a valid mobile number.'});
      } else {
        invalidMobileArray.splice(invalidMobileArray.length-1,0, ' and ');
        return({status: false, smsCount: 'Rows ' + invalidMobileArray.toString().replace(', and ,', ' and ') + ' of column '+ mobile +' does not have a valid mobile number.'});
      }
      
    }
    
    for(var i = 0; i < ranges.length; i++) {
      var rows = ranges[i][0];
      var mobile = ranges[i][1];
      var invalidRange = ranges[i][4];
      
      rangeFilterRange.push(rows);
      rangeFilterMobile.push(mobile);
      rangeFilterInvalid.push(invalidRange);
    }
    
    var mergeRange = [].concat.apply([], rangeFilterRange);
    var mergeMobileRange = [].concat.apply([], rangeFilterMobile);
    var mergeInvalidRange = [].concat.apply([], rangeFilterInvalid);
    
    for(var i = 0; i < mergeRange.length; i++) {
        var rows = mergeRange[i];
        
        for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
          var column = letterToColumn(holder.replace(/^#|#$/g,''))-1;
          
          obj[holder] = rows[column];
          
        } 
      
      if(isEnabledTranslate == true) {
        
        var replace = replacePlaceholders(string, obj);
        replace = translateTextPreview(replace, languageOrigin, targetLang);
        objArr.push(replace);
        mobileArr.push(mergeMobileRange[i].toString());
        
      } else if(isEnabledTranslate == false) {
        
        var replace = replacePlaceholders(string, obj);
        objArr.push(replace);
        mobileArr.push(mergeMobileRange[i].toString());
      
      }
    }
      
      outPut = {status: 'True', smsCount: filterRange, messages: objArr, mobileNumbrs: mobileArr, language: targetLang};
      
      return(outPut);
    
    
    
  } else if(filterOption == 'selectAll') {
    
    range = activeSheet.getRange(2, 1, activeSheet.getLastRow(), activeSheet.getLastColumn()).getValues();
    rangeMobile = activeSheet.getRange(2, mobileNum, activeSheet.getLastRow(), 1).getValues();
    
    var invalidMobileRows = checkMobileValuesSelectAll(mobile);
    
    if(invalidMobileRows.length > 0) {
      
      if(invalidMobileRows.length == 1) {
        return({status: 'False', messages: 'Row ' + invalidMobileRows.toString() + ' of column '+ mobile +' does not have a valid mobile number.'});
      } else {
        invalidMobileRows.splice(invalidMobileRows.length-1,0, ' and ');
        return({status: 'False', messages: 'Rows ' + invalidMobileRows.toString().replace(', and ,', ' and ') + ' of column '+ mobile +' does not have a valid mobile number.'});
      }
      
    }

    for(var i = 0; i < range.length-1; i++) {
        var row = range[i];
        
        for(var k=0; k < holders.length; k++) {
          var holder = holders[k];
          var column = letterToColumn(holder.replace(/^#|#$/g,''))-1;
          
          obj[holder] = row[column];
          
        } 
      
      if(isEnabledTranslate == true) {
        var replace = replacePlaceholders(string, obj);
        replace = translateTextPreview(replace, languageOrigin, targetLang);
        objArr.push(replace);
        mobileArr.push(rangeMobile[i].toString());
      } else if(isEnabledTranslate == false) {
        var replace = replacePlaceholders(string, obj);
        objArr.push(replace);
        mobileArr.push(rangeMobile[i].toString());
      }
    }
    outPut = {status: 'True', smsCount: range.length-1, messages: objArr, mobileNumbrs: mobileArr, 'language': targetLang};

    return(outPut);
   }
  
}


function checkObject(obj) {
  var regExp = /#[A-Z]#/g;
  var key;
  var status;

  for(key in obj) {
    if(key.match(regExp)) {
      status = 'match';
    } else {
      status = null;
    }
  }
  
  return status;
}

function replacePlaceholders(string, obj) {
  
  if(checkObject(obj) == null) {
 
    return string;
    
  } else if(checkObject(obj) == 'match') {
    
  var templateObj = {};
  
  for(var key in obj) {
    
    templateObj[key] = obj[key]; 
    
  }
  
  var re = new RegExp(Object.keys(templateObj).join("|"),"gi");
    string = string.replace(re, function(matched){
      return templateObj[matched];
  });
  
  return string;
  
  }
}

//******END SEND MESSAGES*******//

function saveMessage(obj) {

  var saveMsgStatus = (obj.saveMsg == undefined || obj.saveMsg == null) ? 'off' : obj.saveMsg;
  
  if(saveMsgStatus == 'on') {
    
    var request = saveUserTemplate(obj.smsTemplate, obj.textMessage);
   
    return(request);
    
    
  } else if(saveMsgStatus == 'off') {
    
    var delRequest = deleteUserTemplate(obj.smsTemplate);
    return(delRequest);
    
  }
}

function getTemplates() {
  var templates = userProps.getProperty('SmsTemplates');
  if(templates == null || templates.length == 0) {
   
    var newTemp = userProps.setProperty('SmsTemplates', 'Select Message')
    var arr = userProps.getProperty('SmsTemplates');
    var newArr = arr.split(',');
    
    return newArr;
 
  } else {
    
    var newArr = templates.toString();
    var regExp = newArr.replace(/^,|,$/g,'');
    var arr = regExp.split(',');
    
    return arr;
  }
}

function mapTemplates(key, value) {
  var props = userProps.setProperty(key, value);
  
  var keys = userProps.getProperty(key);

}

function deleteTemplate(template) {

  var deleteName = userProps.deleteProperty(template);
  var props = userProps.getProperty(template);
  
}

function deleteProps() {
  userProps.deleteProperty('SmsTemplates');
}

function getTextMsg(templateId) {
 
  var response = getUserTemplates();
  
  var templateMsg;
  var templates = response.Templates;
  for(var i = 0; i < templates.length; i++) {
    var tempId = templates[i];
    if(tempId.TemplateId == templateId) {
     templateMsg = tempId.Template;
    } 
  }
  return templateMsg;
}

/**
* @ref https://developers.google.com/apps-script/articles/removing_duplicates
*/
function removeDuplicates() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var newData = new Array();
  for(i in data){
    var row = data[i];
    var duplicate = false;
    for(j in newData){
      if(row.join() == newData[j].join()){
        duplicate = true;
      }
    }
    if(!duplicate){
      newData.push(row);
    }
  }
  sheet.clearContents();
  sheet.getRange(1, 1, newData.length, newData[0].length).setValues(newData);
}

//REPORTS
function getReportsTemplate() {
  getTemplate('Reports', 'Delivery Reports', 900, 500);
}

function getMessg() {
  var t = userProps.getProperty('messages');
  var k = userProps.getProperty('mobileNumbrs');
}

/**
* Translate user input in the textarea of the SEND SMS UI.
* When user press the space or enter keys, this triggers the translate function.
* @param {message} (string) The text inside the textarea
* @param {dest} {string} The two-letter short form for the destination language.
*/

function translateText(message, origin, dest, isTrue) {
  
  //Logger.log(message);

  //var origin = '';
  var patt = /#[A-Z]#/g;
  
  var k = message.replace(patt, function(x) { return '<span class="notranslate">'+ x +'</span>' });
  //Logger.log(k);
  if(origin == 'auto') {
    origin = "";
  }

  var translatedMessage = LanguageApp.translate(k, origin, dest, {contentType: 'html'});
  
  var translatedMessage = translatedMessage.replace(/<span class="notranslate">|<\/span>/g, '');
  translatedMessage = translatedMessage.replace(/(#)(\s)+[\.]/g, '#.');
  translatedMessage = translatedMessage.replace(/(#)(\s)+[,]/g, '#,');
  
  return translatedMessage;
}

function translateTextPreview(message, origin, dest, isTrue) {
  
  var patt = /#[A-Z]#/g;
 
  if(origin == 'auto') {
    origin = "";
  }

  var translatedMessage = LanguageApp.translate(message, origin, dest, {contentType: 'text'});
  
  return translatedMessage;
}












































