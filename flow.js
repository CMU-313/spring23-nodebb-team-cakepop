// @flow
// Test file that ensures flow correctly type checks

function foo(x: ?number): string {
    if (x) {
      return x;           
    }
    return "default string";
  }