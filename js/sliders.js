;(function() {
  var value;
  ["x","y"].forEach(function (dimension) {
    $("#" + dimension + "-slider").slider({
      range: "min",
      value: 50,
      min: 10,
      max: 100,
      step: 1,
      slide: function( e, ui ) {
        // While sliding, update the value in the #amount div element
        document.getElementById(dimension + "-dimension-value").innerHTML = ui.value;
      }
    });
    // Set the initial slider amount value in each div element
    value = $("#" + dimension + "-slider").slider("value");
    document.getElementById(dimension + "-dimension-value").innerHTML = value;
  });
}());
