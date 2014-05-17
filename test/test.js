//TODO: add test where escape character is included
var assert = require('assert');
var Parsescape = require('../');

var c_lang = ' hello // world\n /*world*/ void world(){ if(true) {printf("}") console.log("good \\"job")}}\n';
var custom_lang = 'star <wars>wars</wars>';
var py_lang = ' def hello:\n"""docstring""" print "done"\nreturn 1';

var c_parser = new Parsescape(c_lang, 'c');
var custom_parser = new Parsescape(custom_lang, [['<','>']]);
var py_parser = new Parsescape(py_lang, 'python');
describe('find', function(){
  it('not found', function(){
   assert(c_parser.find('>') === -1);
  });
  it('basic', function(){
    assert(c_parser.find('hello') === 1);
  });
  it('1', function(){
    assert(c_parser.find('world') === 32);
  });
  it('2', function(){
    assert(c_parser.find('}') === c_lang.length-3);
  });
  it('escape char', function(){
    assert(c_parser.find('job') === -1);
  });
  it('custom parser', function(){
    assert(custom_parser.find('wars') === 11);
  });
  it ('python parser', function(){
    assert(py_parser.find('return') === py_lang.length - 8)
  });
});

