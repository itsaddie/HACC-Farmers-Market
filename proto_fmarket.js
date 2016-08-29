/**  Congratulations! You've found my secret hidden message inside the JavaScript code.
                 VISIT http://www.secretsitehere.com FOR A PRIZE               */

// Constant variables
var appName = "F-MARKET"; // TODO: Think of a creative app title
var appData = null;

// Implementing jQuery hack
var script = document.createElement('script');
script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Implementing Socrata API
$.ajax({
    url: "https://data.hawaii.gov/resource/b2y9-ab7v.json",
    type: "GET",
    data: {
      "$limit" : 5000,
      "$$app_token" : "3AYPHeWtyVK5iXciD6x4BrqIq"
    },
    success: function(data) {
      // Called when API is loaded
      appData = data;
      console.log(appData);
      log('Success! Loaded ' + appData.length + ' objects from Socrata dataset');

      enable();
    },
    error: function(e) {
      // Called if anything goes wrong
      log('Something went wrong! ' + e.message);
    }
});

// Runs when the page body loads. Debugging purposes.
function enable() {
  scan();
}

function log(message) {
  console.log(appName + ': Debugger> ' + message);
}

// Check to see if a market is currently open in real-time
function isCurrentlyOpen(times) {
  var date = new Date();
  var advMinutes = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
  var currentTime = date.getHours() + '' + (advMinutes);

  // 9:00 AM to 4:00 PM  -->  [900, (400 + 1200)]
  // Add 12 hours for PM times; if current time is in between MIN & MAX then market is OPEN
  var timesArray;

  if (times.indexOf(' to ') > -1)
  timesArray = times.replace(':', '').replace(':', '').replace(' NOON', '').replace(' NOON', '').replace(' AM', '').replace(' AM', '').split(' to ');
  if (times.indexOf(' - ') > -1)
  timesArray = times.replace(':', '').replace(':', '').replace(' NOON', '').replace(' NOON', '').replace(' AM', '').replace(' AM', '').split(' - ');
  if (times.indexOf(' - ') == -1 && times.indexOf(' to ') == -1)
  return false;

  if (timesArray[0].indexOf(' PM') > -1 || timesArray[0].indexOf('PM') > -1) { timesArray[0] = timesArray[0].replace('PM', '').replace(' PM', ''); timesArray[0] = parseInt(timesArray[0]) + 1200; }
  if (timesArray[1].indexOf(' PM') > -1 || timesArray[0].indexOf('PM') > -1) { timesArray[1] = timesArray[1].replace('PM', '').replace(' PM', ''); timesArray[1] = parseInt(timesArray[1]) + 1200; }

  var timeMinimum = timesArray[0];
  var timeMaximum = timesArray[1];

  if (parseInt(timesArray[0]) >= parseInt(timesArray[1])) {
    // First time is greater; maximum
    timeMaximum = timesArray[0];
    timeMinumum = timesArray[1];
  } else {
    // Second time is greater; maximum
    timeMaximum = timesArray[1];
    timeMinumum = timesArray[0];
  }

  // Checking to see if current time is within bounds of hours
  if (parseInt(currentTime) >= timeMinimum && parseInt(currentTime) < timeMaximum) {
    return true;
  } else {
    return false;
  }
}

// TEMPORARY ------------------------
function test(marketId) {
  console.log('}----------< SHOWING #' + marketId + ' >----------{');
  if (appData[marketId].farmer_s_market != null)
  console.log('' + appData[marketId].farmer_s_market);
  console.log('');
  if (appData[marketId].time != null)
  console.log('Open: ' + isCurrentlyOpen(appData[marketId].time));
  if (appData[marketId].location_1_location != null)
  console.log('Location: ' + appData[marketId].location_1_location);
  if (appData[marketId].contact != null && appData[marketId].phone != null)
  console.log('Contact: ' + appData[marketId].contact + ' at ' + appData[marketId].phone);
  console.log('------------------------------------');
}

function scan() {
  var openMarkets;

  for (var i = 0; i < appData.length; i++) {
    if (appData[i].time != null) {
      if (isCurrentlyOpen(appData[i].time)) {
        log('Found open farmers market! #' + i);

        if (openMarkets != null)
        openMarkets = openMarkets + ', ' + i;

        if (openMarkets == null) {
          openMarkets = i;
        }
      }
    }
  }

  if (openMarkets == null) {
    log('Could not find any open farmers markets!');
    return null;
  } else if (openMarkets != null) {
    log(openMarkets);
    return openMarkets.split(', ');
  } return null;
}
// TEMPORARY ------------------------
