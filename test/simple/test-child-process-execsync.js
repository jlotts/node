// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var common = require('../common');
var assert = require('assert');

var execSync = require('child_process').execSync;

var TIMER = 200;
var SLEEP = 1000;

var start = Date.now();
var err;
var caught = false;
try
{
  var cmd = process.execPath + ' -e "setTimeout(function(){}, ' + SLEEP + ');"';
  console.log(cmd);
  var ret = execSync(cmd, {timeout: TIMER});
} catch (e) {
  caught = true;
  console.log(e);
  assert.strictEqual(e.errno, 'ETIMEDOUT');
  err = e;
} finally {
  assert.strictEqual(ret, undefined, 'we should not have a return value');
  assert.strictEqual(caught, true, 'execSync should throw');
  var end = Date.now() - start;
  assert(end < SLEEP);
  assert(err.status > 128);
}

assert.throws(function() {
  execSync('iamabadcommand');
}, /Command failed: iamabadcommand/);
