"use strict";

// todo change parser: skip contents of escaped content using str.indexOf
var util = require('util');
var fs = require('fs');
var path = require('path');

function regToString(r) {
  var s = r.toString();
  return s.substring(1, s.length - 2);
}

function Parsecape(s, config) {
  this.s = s;
  if (typeof config === 'string') { //language
    try {
      var language = config;
      this.escapers = require(util.format("../lang/%s.json", language.toLowerCase()))
    } catch (err) {
      var err_msg_array = [];
      err_msg_array.push('Language ' + config + ' is not supported.');
      err_msg_array.push('The list of supported languages:');

      var sup_langs = fs.readdirSync(path.resolve('lang'));
      sup_langs.forEach(function (sup_lang) {
        err_msg_array.push(sup_lang.substring(0, sup_lang.length - 5))
      });
      err_msg_array.push('Create an issue on Github to include this language.');
      throw Error(err_msg_array.join('\n'));
    }

  } else {
    this.escapers = config;
  }


}

Parsecape.prototype.find = function (to_match, start) {
  start = start || 0;
  var s = this.s;
  if (start >= s.length) {
    return false
  }
  if (to_match instanceof RegExp) {
    var is_reg = true;
    to_match = new RegExp('^' + regToString(to_match));
  }

  var escapers = this.escapers;
  var prev_c, c, escape_char, cur_s;

  for (var i = start; i < s.length; i++) {
    // initialization
    cur_s = s.substring(i);
    c = s[i];

    // check if we've matched
    if (is_reg ? cur_s.match(to_match) : startsWith(cur_s, to_match)) {
      var demands_met = true;
      if (demands_met) {
        return i;
      }
    }

    // escape character
    if (escape_char) {
      escape_char = false;
    }
    /*else if (current_escaper) {
     if (cur_s.indexOf(current_escaper[1]) === 0) {
     current_escaper = false;
     i += (current_escaper[1].length - 1);
     }
     }*/ else {
      for (var j = 0; j < escapers.length; j++) {
        var escaper = escapers[j];
        if (startsWith(cur_s, escaper[0])) {
          var end_of_escaper;
          var cur_cur_pos = 1;
          while (true) {
            end_of_escaper = cur_s.indexOf(escaper[1], cur_cur_pos);
            if (end_of_escaper === -1) {
              i = s.length;
              break;
            } else if (cur_s[end_of_escaper - 1] === '\\') { //escape char
              cur_cur_pos = end_of_escaper + escaper[1].length;
            } else {
              i += end_of_escaper + escaper[1].length - 1;
              break;
            }
          }
          break;
        }
      }
    }

    prev_c = c;
  }
  return -1;
};

function startsWith(s, starter) {
  for (var i = 0, cur_c; i < starter.length; i++) {
    cur_c = starter[i];
    if (s[i] !== starter[i]) {
      return false;
    }
  }
  return true;
}


/*Parsecape.prototype.rfind = function (to_match, start) {
 start = start || 0;
 if (!this.reverse_initialized) {
 this.reverse_initialized = true;
 var reversed_s = reverseStr(this.s);
 if (reversed_s[0] !== '\n') {
 reversed_s = '\n' + reversed_s;
 this.line_break_added = true;
 } else {
 this.line_break_added = false;
 }
 this.reversed_parser = new Parsecape(reversed_s, reverseEscapers(this.escapers))
 }
 var ret =  this.reversed_parser.find(reverseStr(to_match), this.s.length - start - Number(this.line_break_added));
 return ret === -1 ? -1 : this.s.length - ret - Number(this.line_break_added);

 };
Parsecape.prototype.rfind = function (to_match, start) {
  if (!this.reverse_initialized) {
    this.reverse_initialized = true;
    this.reversed_escapers = reverseEscapers(this.escapers);
  }
  start = start || 0;
  var s = this.s;
  if (start >= s.length) {
    return false
  }
  if (to_match instanceof RegExp) {
    var is_reg = true;
    to_match = new RegExp('^' + regToString(to_match));
  }

  var escapers = this.reversed_escapers;
  var prev_c, c, escape_char, tail_s,head_s,rev_s;
  rev_s = reverseStr(s);
  for (var i = s.length-1; i >= 0; i--) {
    // initialization
    head_s = s.substring(0,i);
    tail_s = s.substring(i);
    rev_s = rev_s.substring();
    c = s[i];

    // check if we've matched
    if (is_reg ? cur_s.match(to_match) : startsWith(cur_s, to_match)) {
      var demands_met = true;
      if (demands_met) {
        return i;
      }
    }

    // escape character
    if (escape_char) {
      escape_char = false;
    }
    else {
      for (var j = 0; j < escapers.length; j++) {
        var escaper = escapers[j];
        if (startsWith(cur_s, escaper[0])) {
          var end_of_escaper;
          var cur_cur_pos = 1;
          while (true) {
            end_of_escaper = cur_s.indexOf(escaper[1], cur_cur_pos);
            if (end_of_escaper === -1) {
              i = s.length;
              break;
            } else if (cur_s[end_of_escaper - 1] === '\\') { //escape char
              cur_cur_pos = end_of_escaper + escaper[1].length;
            } else {
              i += end_of_escaper + escaper[1].length - 1;
              break;
            }
          }
          break;
        }
      }
    }

    prev_c = c;
  }
  return -1;


};*/


module.exports = Parsecape;
if (process.env.NODE_ENV === 'test') {
  var assert = require('assert');
  describe('startsWith', function(){
    it("matches",function(){
      assert(startsWith('cotton', 'co'));
    });
    it("shouldn't matched",function(){
      assert(!startsWith('co', 'cotton'));
    })

  })
}