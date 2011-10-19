/**
 * Created by JetBrains PhpStorm.
 * User: seanmcgary
 * Date: 10/19/11
 * Time: 3:13 PM
 * To change this template use File | Settings | File Templates.
 */

var oscar = require('./libs/node-oscar');

var aim = new oscar.OscarConnection({
    connection: {
        username: 'mcg1sean',
        password: 'humpty1dumpty'
    }
});

aim.on('im', function(text, sender, flags, when){
    //console.log(text);
    //console.log(sender);
    //console.log(when);

    aim.sendIM(sender.name, "IM Received");
});

aim.on('typing', function(who, type){
    //console.log('typing');
    //console.log(who);
    //console.log(type);
});

aim.on('contactupdate', function(user){
    //console.log(user);
});

aim.on('contactoffline', function(user){
    //console.log(user);
});

aim.on('icon', function(who, icon, size){
    //console.log(who);
    //console.log(icon);
    //console.log(size);
});


aim.connect(function(err){
    if(err){
        console.log("Unable to connect");
    } else {
        console.log("Connected");
        var list = aim.contacts.list;
        for(var i in list){
            console.log(list[i]);
        }
        aim.getOfflineMsgs();
    }
});
