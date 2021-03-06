/*jshint node: true */
/*
Safe async function, should always cal back through callback, if one is supplied
*/


var safe = require('./safe.js');
var is = require('./is.js');

module.exports = function(functionToWrap, name){
  is.function(functionToWrap);

  var functionName = functionToWrap.toString();
  functionName = functionName.substring(9, functionName.indexOf('('));
  if(functionName ==='')
  {
    functionName = "(anonymous function)";
  }

  if(typeof name === 'string')
  {
      functionName = name;
  }
  var j = function(){
    var newArgs = [];
    var oldArgs = arguments;
    for(var i = 0; i < arguments.length; i ++)
    {
      newArgs.push(arguments[i]);
    }
    var cbk = newArgs.pop();

    var newCbk = function(error){
      if(error)
      {
        error.args = oldArgs;
        error.trace = error.trace || [];
        error.trace.push(functionName);
        cbk(error);
      }
      else
      {
        cbk.apply(this, arguments);
      }
    };
    newArgs.push(newCbk);

    return safe(newCbk, functionToWrap).apply(this, newArgs);
  };
  return j;
};