
;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  mazeSolver.lighten = function (color1, color2, steps) {
    var diff = [];
    var logOffset = [];
    var curColor, curStep;
    var split1 = color1.match(/\w{2}/g);
    var split2 = color2.match(/\w{2}/g);
    //initialize max for each color to represent color1 > color2
    var max = [1,1,1];

    for (var i = 0; i < 3; i++) {
      var a = parseInt(split1[i], 16);
      var b = parseInt(split2[i], 16);
      if (a < b) {
        max[i] = 0;
      }
      diff.push(Math.abs(a - b));
      logOffset.push(diff[i]/Math.log2(steps));
    }

    var result = [];

    //log curve functionality
    var maxDiff = Math.max(diff[0],diff[1]);
    maxDiff = Math.max(diff[2], maxDiff);
    var totalSteps = Math.log(steps);
    console.log(logOffset);
    for (var i = 1; i <= steps; i++) {
      curStep = ['#'];
      for (var j = 0; j < 3; j++) {
        if (max[j]) {
          //color1 is maxColor
          curColor = parseInt(split2[j], 16) + Math.floor(logOffset[j] * Math.log2(i));
        } else {
          //color2 is maxColor
          curColor = parseInt(split1[j], 16) + Math.floor(logOffset[j] * Math.log2(i));
        }
        curColorHex = curColor.toString(16);
        if (curColorHex.length == 1) { curColorHex += curColorHex };
        curStep.push(curColorHex);
      }

      result.push(curStep.join(''));
    }
    return result;
  }
}());
