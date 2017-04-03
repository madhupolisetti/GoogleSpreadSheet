// This are the Apps Scripts functions of the "Helpers.gs" script file of the Spreadsheet where the source code lives.
// @ Source Sheet: https://script.google.com/macros/d/MP7J2r1pf6COdv5q-h04adXGX9fKgVtti/edit?uiv=2&mid=ACjPJvFDwhM6hb3Kp0JzLJA14t2yZ9ZmGJORrPkcyOX1w5vbsGa4Axfb0vRh6xK8sFMns_WD9S-nzwjTytFbig8Vg7bWFxrO57kARYgWJkYRF7kMl1bmTlhekVBVvDH3IkqX9tcrqYOgFDY


function checkHeaders() {
  
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  
  var arr = [];
  var columns = [];
  
  for(var i = 0; i < headerRange.length; i++) {
    var row = headerRange[i];
    
    for(var n = 0; n < row.length; n++) {
      var column = row[n];
      
      if(column == '') {
        columns.push(n+1);
        arr.push(columnToLetter(n+1));
      }
    }
  }
  
  var ui = SpreadsheetApp.getUi();
  
  if(arr == '') {

    return;
    
  } else {
    
    var response = ui.alert('SMSCountry', 'Columns ' + arr + ' does not have headers. Columns with no headers may affect SMSCountry\'s settings. Would you like to delete these columns?', ui.ButtonSet.YES_NO);
  
    if(response == ui.Button.NO) {
      
      return;
      
    } else if(response == ui.Button.YES) {
      
      columns.reverse();
      columns.map(deleteNoHeaderColumns);
      ui.alert('SMSCountry', 'Columns deleted successfully!', ui.ButtonSet.OK);
      
    }
    
  }
 
}

function deleteNoHeaderColumns(column) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  
  sheet.deleteColumn(column);
}

function deleteEmptyRows(){ 
  var sh = SpreadsheetApp.getActiveSheet();
  var data = sh.getDataRange().getValues();
  var targetData = new Array();
  var emptyRows = [];
  for(var n=0;n<data.length;++n){
    if(data[n].join().replace(/,/g,'')!=''){ targetData.push(data[n])};
   
    if(data[n].join().replace(/,/g,'') == ''){ emptyRows.push(n+1); } 
  }
  
   if(emptyRows == '' || emptyRows.length == 0) {
     return;
   } else {
     
     if(emptyRows.length > 1) {
       var response = ui.alert('SMSCountry', 'Rows ' + emptyRows + ' are blank. Would you like to delete these rows?',  ui.ButtonSet.YES_NO);
     } else {
       var response = ui.alert('SMSCountry', 'Row ' + emptyRows + ' is blank. Would you like to delete it?',  ui.ButtonSet.YES_NO);
     }
     
     if(response == ui.Button.NO) {
       return;
     } else {
       sh.getDataRange().clearContent();
       sh.getRange(1,1,targetData.length,targetData[0].length).setValues(targetData);
       
       SpreadsheetApp.flush();
       
       ui.alert('SMSCountry', 'Rows successfully deleted!', ui.ButtonSet.OK);
       
     }
     
   }
  
}

function validateMobile(numberArr) {
  var arr = [];
 
  for(var i = 0; i < numberArr.length; i++) {
   var num = numberArr[i].match(/^[1-9]{1}[0-9]{4,13}$/g);
    
    if(num == null) {
      arr.push(i+2);
    }
  }
  return(arr);
}

function getMobileColumn() {
  /*
  var column = ui.prompt('SMSCountry', 'Please enter the column where mobile numbers will be stored.', ui.ButtonSet.OK_CANCEL);
  
  var selectedBtn = column.getSelectedButton();
  var mobileCol = column.getResponseText();
  
  if(selectedBtn == ui.Button.OK) {
    checkMobileColumnValues(mobileCol);
  } else if(selectedBtn == ui.Button.CANCEL) {
    return;
  }
  */
  
  
}

function checkMobileColumnValues(startRow, endRow, mobileCol) {
  //var startRow = 3;
  //var endRow = 8;
  
  //mobileCol = 'a';
  
  mobileCol = mobileCol.toUpperCase();

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getRange(mobileCol + startRow + ':' + mobileCol + endRow);
  
  var values = range.getValues();
  
  var invalid = [];
  var patt = /^[1-9]{1}[0-9]{4,13}$/g;
  
  for(var i = 0; i < values.length; i++) {
    if(values[i].toString().match(patt) == null) {
      var h = sheet.getRange(i+parseInt(startRow), letterToColumn(mobileCol)).getRow();
      invalid.push(h);
    }
  }
  Logger.log(invalid);
  return invalid;
}

function checkMobileValuesSelectAll(mobileCol) {
  
  mobileCol = mobileCol.toUpperCase();

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getRange(1, letterToColumn(mobileCol), sheet.getLastRow(), 1);
  
  var values = range.getValues();
  
  var invalid = [];
  var patt = /^[1-9]{1}[0-9]{4,13}$/g;
  
  for(var i = 0; i < values.length; i++) {
    if(values[i].toString().match(patt) == null) {
      var h = sheet.getRange(i+1, letterToColumn(mobileCol)).getRow();
      if(h == 1) {
        continue;
      } else {
        invalid.push(h);
      }
    }
  }
  
  return invalid;
}

/*
function getInvalidMobileRows(startRow, endRow) {
  //var startRow = 3;
  //var endRow = 7;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getRange("A" + startRow + ":" + columnToLetter(sheet.getLastColumn()) + endRow);
  
  var rangeValues = range.getValues();
  
  var invalidRows = [];
  
  for(var i = 0; i < rangeValues.length; i++) {
    var row = rangeValues[i];
    for(var k = 0; k < row.length; k++) {
      var cell = row[k];

      if(cell.toString().length <= 0 || cell == '') {
        var f = sheet.getRange(i+startRow, 1).getRow();
        if(f == 1) {
          continue;
        } else {
          invalidRows.push(f);
        }
      }
    }
  }
  return(invalidRows);
}
*/

function getInvalidRows() {
  var cell;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var range = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn());
  
  var rangeValues = range.getValues();
  
  var invalidRows = [];
  
  for(var i = 0; i < rangeValues.length; i++) {
    var row = rangeValues[i];
    
    for(var k = 0; k < row.length; k++) {
      cell = row[k];  
      if(cell.toString().length <= 0 || cell == '') {
        var f = sheet.getRange(i+1, 1).getRow();
        if(f == 1) {
          continue;
        } else {
          invalidRows.push(f);
        }
      }
    }
    
  }
  
  invalidRows = eliminateDuplicates(invalidRows);
  
  var response;
  
  if(invalidRows.length > 0) {
    if(invalidRows.length == 1) {
      response = ui.alert('SMSCountry', 'Row ' + invalidRows.toString() + ' has blank cells. Please put "N/A" if these will not be used in your text message.', ui.ButtonSet.OK);
      
    } else {
      invalidRows.splice(invalidRows.length-1, 0, ' and ');
      response = ui.alert('SMSCountry', 'Rows ' + invalidRows.toString().replace(', and ,', ' and ') + ' have blank cells. Please put "N/A" if these will not be used in your text message.', ui.ButtonSet.OK);

    }
    
    return(false);

  } else {
    
    return(true);
    
  }
  
}

function eliminateDuplicates(arr) {
 
var i,
  len=arr.length,
  out=[],
  obj={};

 for (i=0;i<len;i++) {
 obj[arr[i]]=0;
 }
 
 for (i in obj) {
 out.push(i);
 }
 return out;
}











