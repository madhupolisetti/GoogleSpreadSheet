// This are the functions under the "ExternalAPI_Functions.gs" script file of the Spreadsheet where the source code lives.
// This is where the functions that connects to SMSCoutries API.
// @ Source Sheet: https://script.google.com/macros/d/MP7J2r1pf6COdv5q-h04adXGX9fKgVtti/edit?uiv=2&mid=ACjPJvFDwhM6hb3Kp0JzLJA14t2yZ9ZmGJORrPkcyOX1w5vbsGa4Axfb0vRh6xK8sFMns_WD9S-nzwjTytFbig8Vg7bWFxrO57kARYgWJkYRF7kMl1bmTlhekVBVvDH3IkqX9tcrqYOgFDY


function validateSMSLogin(authKey, authToken) {
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  };
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/' + authKey + '/';
  var params = {
    method: 'post',
    contentType: 'application/json',
    headers: headers,
    validateHttpsCertificates: false,
    muteHttpExceptions: true
  };
  
  var request = UrlFetchApp.fetch(url, params);
  var response = JSON.parse(request);
 
  if(response.Success == false) {
    return({success: false, message: response.Message});
  } else {
    var authkey = response.Table1[0].AuthKey;
    var authtoken = response.Table1[0].AuthToken;
    
    if(authkey != authKey) {
      return({success: false, message: 'Invalid Auth Key'});
    } else if(authtoken != authToken) {
      return({success: false, message: 'Invalid Auth Token'});
    } else {
      return({success: true, message: 'Auth Credentials Verified!'});
    }
    
  }
  
}

function checkBalance() {
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  };
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/' + authKey + '/';
  var params = {
    method: 'post',
    contentType: 'application/json',
    headers: headers,
    validateHttpsCertificates: false,
    muteHttpExceptions: true
  };
  
  var request = UrlFetchApp.fetch(url, params);
  var response = JSON.parse(request);
 
  return(parseFloat(response.Accounts[0].Amount).toFixed(2) + ' ' + response.Accounts[0].Currency);
}

function getSenderId() {
  
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  //var authKey = 'dHKhtViZFuZl6mK2Zuyy';
  //var authToken = 'pgVXdg4vReMWNfdhMX66IhJQUPKhrxItxFxxoJfa';
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  };
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/' + authKey + '/SenderIDs/';
  var params = {
    method: 'get',
    contentType: 'application/json',
    headers: headers,
    validateHttpsCertificates: false,
    muteHttpExceptions: true
  };
  
  var request = UrlFetchApp.fetch(url, params);
  var response = JSON.parse(request);
  
  var senderIds = response.SenderIds;
  var senderIdArr = [];
 
  if(response.Success == 'True') {
    
    if(senderIds.length == 0 || senderIds == undefined || senderIds == null) {
  
      return({Message: 'No Senders IDs', Success: 'True'});
      
    } else {
      
      for(var i = 0; i < senderIds.length; i++) {
        var senderID = senderIds[i].SenderId;
        senderIdArr.push(senderID);
      }
      
      return({Message: 'Has Senders IDs', Success: 'True', SenderIds: senderIdArr});
    }
   
  } else if(response.Success == 'False') {
    return({Message: response.Message, Success: 'False'});
  }
  
}

function sendUserSms(mobile, message, sid) {
  var url = 'http://api.smscountry.com/SMSCwebservice_bulk.aspx';
  var mtype = 'N'; 
  var dr = 'Y';
  var user = 'smsc_sheets';
  var pw = '32084413';
 
  var params = {
    method:'post',
    payload:
    'User=' + user +
    '&passwd=' + pw +
    '&mobilenumber=' + mobile +
    '&message=' + encodeURIComponent(message) +
    '&sid=' + sid + 
    '&mtype=' + mtype +
    '&DR=' + dr
  }
  
  var response = UrlFetchApp.fetch(url, params);

  return(response.getContentText());
  
}

// SEND SMS USING NEW REST API with BASIC AUTH
function sendSMSes(mobile, message, sid) {
  
  var payload;
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);
  
  var payload = {
    'Text': message,
    'Number': mobile,
    'SenderId': (sid == 'No Sender IDs') ? '' : sid
  }
  
  var load = JSON.stringify(payload);
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  }
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/SMSes';
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,
    'payload': load,
    'validateHttpsCertificates': false,
    'muteHttpExceptions': true,
  }
  
  var request = UrlFetchApp.fetch(url, options);
  
  var resp = JSON.parse(request.getContentText());

  return(resp);
  
}

function getModeSubmissions() {
  
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  };
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/Tools/';
  var params = {
    method: 'get',
    contentType: 'application/json',
    headers: headers,
    validateHttpsCertificates: false,
    muteHttpExceptions: true
  };
  
  var request = UrlFetchApp.fetch(url, params);
  var response = JSON.parse(request);
  
  var tools = response.Tools;
  var toolsArray = [];
  
  if(response.Success == 'True' || response.Success == true) {
    for(var i in tools) {
      var tool = tools[i];
      toolsArray.push(tool.Name);
    }
  }
  Logger.log(toolsArray);
  return toolsArray;
}

function getSMSReports(obj) {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var name = obj.reportSheetName;
  var duplicate = checkSheets(name);
  var submission = (obj.modeOfSubmission == 'All') ? '' : obj.modeOfSubmission;

  if(duplicate.status == true) {
 
    return({status: 'dup', sheet: name});
    
  } else {
      
      var authKey = userProps.getProperty('authKey');
      var authToken = userProps.getProperty('authToken');
      
      var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);
      
      var headers = {
        'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
      }
      
      var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/SMSes/?'
      + 'FromDate=' + obj. reportFromDate + ' ' + obj. reportFromDateTime
      + '&ToDate=' + obj. reportToDate + ' ' + obj. reportToDateTime
      + '&Tool=' + submission
      + '&Offset=1'
      + '&Limit=10000';
      
      var params = {
        method: 'get',
        contentType: 'application/json',
        headers: headers,
        validateHttpsCertificates: false,
        muteHttpExceptions: true
      }
      
      var request = UrlFetchApp.fetch(url, params);
      var response = JSON.parse(request.getContentText());
    
      Logger.log(response);
      
      if(response.Success == false || response.Success == 'False') {
        
        if(response.Message == 'No Records') {
        
        return({status: response.Message, fromDate: obj. reportFromDate + ' ' + obj. reportFromDateTime, toDate: obj. reportToDate + ' ' + obj. reportToDateTime});
        
        } else { 
          
          return({status: response.Message});
          
        }
    
      } else if(response.Success == 'True'|| response.Success == true) {
        
        try {
        
          ss.insertSheet(name, duplicate.sheetslength+1);
    
          var sheet = ss.getSheetByName(name);
        
          sheet.appendRow(['MessageUUID', 'Mobile Number', 'Tool', 'Sender ID', 'Message', 'Delivery Status', 'Status Time', 'Cost']);
      
          for(var i=0; i < response.SMSes.length; i++) {
            var sms = response.SMSes[i];
            var msgUuId = sms.MessageUUID;
            var number = sms.Number;
            var tool = sms.ToolName;
            var sId = sms.SenderId;
            var msg = sms.Text;
            var status = sms.Status;
            var statusTime = sms.StatusTime;
            var cost = sms.Cost;
        
            sheet.appendRow([msgUuId, number, tool, sId, msg, status, statusTime, cost]);
        
          }
      
          sheet.getDataRange().setFontFamily('Open Sans').setHorizontalAlignment('left');
          sheet.getRange(1, 1, 1, sheet.getLastColumn()).setFontWeight('bold').setHorizontalAlignment('center').setBackground('#999').setFontColor('#fff');
      
          return({status: 'no dup'});
        
        } catch(err) {
        
          return({status: 'No Sheet Name'});
        
        }
    }
  }
}

function checkSheets(name) {
  
  var sheetName = name;
  var arr = [];
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var sheetLen = sheets.length;
  
  for(var i = 0; i < sheets.length; i++) {
    var sheet = sheets[i];
    arr.push(sheet.getName());
  }
  
  if(arr.indexOf(sheetName) < 0) {

    return({status: false, sheetslength: sheetLen});
  } else {
 
    return({status: true});
  }
}

function sendCustomizedSms(obj) {

  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);
  
  var payload = obj;
  
  var load = JSON.stringify(payload);

  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  }
 
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/SMSes/';
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,
    'payload': load,
    'validateHttpsCertificates': false,
    'muteHttpExceptions': true,
  }
  
  var request = UrlFetchApp.fetch(url, options);
 
  var resp = JSON.parse(request.getContentText());
  Logger.log(resp);
  return(resp);
}


/*
* Get save user template to SMSCountry DB.
* @param (name) {string} Name of the template.
* @param (template) {string} SMS template.
*/
function saveUserTemplate(name, template) {
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);

  var payload = {
    'Template': template,
    'Name': name
  }
  
  var load = JSON.stringify(payload);
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  }
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/Templates/';
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'headers': headers,
    'payload': load,
    'validateHttpsCertificates': false,
    'muteHttpExceptions': true,
  }
  
  var request = UrlFetchApp.fetch(url, options);
  var parseReq = JSON.parse(request);
  
  return(parseReq);
}

/*
* Get user templates from SMS DB
* return JSON
*/

function getUserTemplates() {
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  }
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/Templates/';
  
  var options = {
    'method': 'get',
    'contentType': 'application/json',
    'headers': headers,
    'validateHttpsCertificates': false,
    'muteHttpExceptions': true,
  }
  
  var request = UrlFetchApp.fetch(url, options);
  
  var response = JSON.parse(request);
  
  var templates = response.Templates;
 
  return response;
  
}

function deleteUserTemplate(id) {
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  var encodedUser = Utilities.base64Encode(authKey + ':' + authToken);
  
  var headers = {
    'Authorization': 'Basic ' + Utilities.base64Encode(authKey + ':' + authToken)
  }
  
  var url = 'https://restapi.smscountry.com/v0.1/Accounts/'+ authKey +'/Templates/'+ id +'';
  
  var options = {
    'method': 'delete',
    'contentType': 'application/json',
    'headers': headers,
    'validateHttpsCertificates': false,
    'muteHttpExceptions': true,
  }
  
  var request = UrlFetchApp.fetch(url, options);
  var response = request.getContentText();
  
  if(response == '' || response == null || response == undefined) {
    return({Success: 'True'});
  } else {
    response = JSON.parse(request);
    return(response);
  }
}

function getAuths() {
  var authKey = userProps.getProperty('authKey');
  var authToken = userProps.getProperty('authToken');
  
  Logger.log(authKey);
  Logger.log(authToken);
}




















