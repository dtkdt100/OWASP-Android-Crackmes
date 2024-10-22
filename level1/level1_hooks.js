//console.log("Script loaded successfully ");
//Java.perform(function x() { //Silently fails without the sleep from the python code
//    console.log("Inside java perform function");
//
//    var c = Module.findExportByName("libc.so", "strstr");
//
//    Interceptor.attach(c, {
//        onEnter: function(args) {
//        },
//        onLeave: function(retval) {
//            retval.replace(0);
//        }
//    });
//
//    var main_activity = Java.use("sg.vantagepoint.uncrackable3.MainActivity");
//
//    main_activity.showDialog.implementation = function (str) {
//        console.log("showDialog");
//    }
//});

console.log("Script loaded successfully ");
Java.perform(function x() { //Silently fails without the sleep from the python code
    console.log("Inside java perform function");
    var main_activity = Java.use("sg.vantagepoint.uncrackable1.MainActivity");

    main_activity.a.implementation = function (str) {
        console.log("showDialog");
    }
});