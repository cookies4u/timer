var myApp = {

    initializeVars: function() {
        this.sessionTime = 10; // initial session time
        this.breakTime = 5; // initial break time
        this.countDownTime = myApp.sessionTime; // set countdown timer to initial session
        this.value = ''; // based on html value of current break or session
        this.userInput = ['', '']; // based on html button type and arithmatic type
        this.pause = true; // timer is paused by default
        this.timerType = 'session'; // will use to switch between session and break timers
        this.lock = false; // can't adjust time when locked
        this.fillPercentVar = '0%'; // when timer runs fill timer circle div
    },

    initializeTimer: function() {
        myApp.initializeVars();

        console.log('#1');
        $(document).on('click', '.clickableButton', function() { // listening to click type
            console.log('###### On click button working ######');
            var type = $(this).attr('type'); // html type
            var arithm = $(this).attr('arithm'); // html arithmatic type
            
            myApp.userInput[0] = type; // saving to an array
            myApp.userInput[1] = arithm; // saving to an array

            if ( myApp.userInput[0] === 'startStop') { // button clicked start/stop
                console.log('#2');
                myApp.pause = !myApp.pause; // everytime clicked will toggle between true and false for pause
                myApp.logic.startStop(); // start/stop timer countdown
            }
            else if ( myApp.userInput[0] === 'reset') { // starting app over
                console.log('#2.2');
                myApp.logic.clockReset(); // re-initialize app
            }
            else { // adjusting the session or break time
                console.log('#3');
                myApp.logic.adjustLength(myApp.userInput[0], myApp.userInput[1]); // passing in type and arithmatic
            }
        });

    },

};


myApp.logic = {
    adjustLength: function(clickType, clickArithm) { // buttons to increase or decrease
        console.log('#5');
        // when the program initialy starts can adjust breaker length or session length
        if ( myApp.lock === false ) { // can only adjust time when program first starts or at reset
            // get current value of selected div
            var timerId = $('#' + clickType); // get dom element id
            var value = timerId.attr('value'); // get dom element value
            // update current value of slected div
            value = value + clickArithm + '1';
            if ( eval(value) > 0) { // timer cannot go below zero
                value = eval(value); // caculating
                timerId.attr('value', value); // updating the attribute value
                timerId.text(value); // updating 'visible' dom value
                console.log('#5.1')
                if ( clickType === 'sessionTime' ) { // updating timer view before timer starts
                    console.log('#5.2');
                    document.getElementById("currentTime").innerHTML = value;
                }   
            }
        }
        
    },

    startStop: function() {
        console.log("#6");

        myApp.lock = true; // can't adjust timer

        var x = setInterval(function() {
            if (myApp.pause) { // stopping timer
                clearInterval(x);
            }

            myApp.countDownTime--;
 
            if ( myApp.countDownTime > -1 ) {
                document.getElementById("currentTime").innerHTML = myApp.countDownTime; // update timer countdown in dom
                myApp.logic.fillPercent(myApp.countDownTime); // calculating percentage
                document.getElementById("timerBackgroundColor").style.height = myApp.fillPercentVar + '%';   
            }           
            
            if (myApp.countDownTime < 0) { // If the count down is over, will set timer to time type
                document.getElementById("timerBackgroundColor").style.height = '0%';
                if ( myApp.timerType === 'session' ) { // switching to break
                    myApp.countDownTime = myApp.breakTime;
                    myApp.timerType = 'break';
                    document.getElementById("timerHeader").innerHTML = 'Break!';
                    $('#timerBackgroundColor').removeClass('sessionBackgroundColor').addClass('breakBackgroundColor');

                } 
                else { // switching to session
                    myApp.countDownTime = myApp.sessionTime;
                    myApp.timerType = 'session';
                    document.getElementById("timerHeader").innerHTML = 'Session';
                    $('#timerBackgroundColor').removeClass('breakBackgroundColor').addClass('sessionBackgroundColor');
                }
            }
        }, 1000);
    },

    fillPercent: function(countDown) { // calculating percentage
        console.log('#7');
        if ( myApp.timerType === 'session') { // percentage for session
            myApp.fillPercentVar = (( myApp.sessionTime - countDown ) / myApp.sessionTime) * 100;

        }
        else { // percentage for break
            myApp.fillPercentVar = (( myApp.breakTime - countDown ) / myApp.breakTime) * 100;
        }
    },

    clockReset: function() { // starting app over
        myApp.initializeVars();
        document.getElementById("timerHeader").innerHTML = 'Session';
        $('#timerBackgroundColor').removeClass('breakBackgroundColor').addClass('sessionBackgroundColor');
        document.getElementById("timerBackgroundColor").style.height = '0%';
        document.getElementById("currentTime").innerHTML = myApp.countDownTime;
    }

};


$(document).ready(function() {  
  myApp.initializeTimer();
});
