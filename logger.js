var logr = function(){
    var i = -1, l = arguments.length, args = [], fn = 'console.log(args)';
    while(++i<l){
        args.push('args['+i+']');
    };
    fn = new Function('args',fn.replace(/args/,args.join(',')));
    fn(arguments);
};

loggerFactory = function(name){
    if(Meteor.isClient){
        return bows(name);
    }else{
        var logfn;
        var logArgs   = [];
        var logLevels = ['log', 'debug', 'warn', 'error', 'info'];
        var padLength = 20;
        var bind      = Function.prototype.bind;
        var noop      = function() {}
        var chalk     = Meteor.npmRequire('chalk');
        chalk.enabled = true;

        var colors    = [chalk.green.bold, chalk.gray, chalk.magenta, chalk.red, chalk.blue];
        var makeMsg = function(name, padLength, coloring){
            var msg;
            msg = name.slice(0, padLength);
            msg += new Array(padLength + 3 - msg.length).join(' ') + " | ";
            return coloring(msg)
        }

        if (!bind) return noop;

        logfn = bind.apply(console.log, logArgs);
        logLevels.forEach(function (f, index, array) {
            logfn[f] = _.wrap(console[f], function(func) {
                var args = Array.prototype.slice.call(arguments, 1);

                args.splice(0,0, makeMsg(name, padLength, colors[index]) );
                return logr.apply(console,args);
            });
        });
        return logfn;
    }
}
