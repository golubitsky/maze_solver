
;(function() {
  if (typeof mazeSolver === "undefined") {
    window.mazeSolver = {};
  }

  mazeSolver.lighten = function (color1, color2, steps) {
    var diff = [];
    var curColor, curStep;
    var split1 = color1.match(/\w{2}/g);
    var split2 = color2.match(/\w{2}/g);
    //initialize max for each color to represent color1 > color2
    var max = [1,1,1];

    for (var i = 0; i < 3; i++) {
      var a = parseInt(split1[i], 16);
      var b = parseInt(split2[i], 16);
      diff.push(Math.abs(a - b));
      if (a < b) {
        max[i] = 0;
      }
    }

    var result = [];
    for (var i = steps; i >= 1; i--) {
      curStep = ['#'];
      for (var j = 0; j < 3; j++) {
        if (max[j]) {
          //color1 is maxColor
          curColor = parseInt(split2[j], 16) + Math.floor(diff[j]/i);
        } else {
          //color2 is maxColor
          curColor = parseInt(split1[j], 16) + Math.floor(diff[j]/i);
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
