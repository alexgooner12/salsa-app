(function () {
   const testingData = {
        "dance-list": ["combo", "relo", "enchufla", "setenta"],
        "group-list": ["beginner", "intermediate", "advanced"],
        "list-of-people": [
            {"name": "aleksandar", "foundOutFrom": "petar", "startDate": "2019-04-01", "group": "beginner", "danceList": ["combo", "relo", "enchufla", "setenta"], "id": 0, "isDisabled": false}, 
            {"name": "marija", "foundOutFrom": "petar", "startDate": "2019-01-01", "group": "intermediate", "danceList": ["combo", "relo", "enchufla", "setenta"], "id": 1, "isDisabled": false}, 
            {"name": "marko", "foundOutFrom": "petar", "startDate": "2018-09-01", "group": "advanced", "danceList": ["combo", "relo", "enchufla", "setenta"], "id": 2, "isDisabled": false}
        ],
        "payment-list": [
            {"name": "aleksandar", "paymentList": [{"month": "May", "isPaid": false}]},
            {"name": "marija", "paymentList": [{"month": "May", "isPaid": true}]},
            {"name": "marko", "paymentList": [{"month": "May", "isPaid": false}]}
        ],
        "list-of-dance-schedules": [{"group": "beginner", "date": "5/4/2019", "danceMoves": ["relo", "combo"], "id": 0}], 
        "attendance-list": [{"date": "5/4/2019", "peopleList": [{"name": "aleksandar", "group": "beginner"}, {"name":             "marija", "group": "intermediate"}]}]
   } 
   
   if (!window.localStorage.length) {
       for (let prop in testingData) {
           localStorage.setItem(prop, JSON.stringify(testingData[prop]));
       }
   }
      
})();