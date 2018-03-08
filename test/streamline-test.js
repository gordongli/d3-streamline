const tape = require("tape");
const d3Streamline = require("../").streamline;

tape("d3-streamline interpolates area between points and their radii, generating an svg path `d`escription", function(test) {
  const streamline = d3Streamline()
      .x(function(d) {return d.x})
      .y(function(d) {return d.y})
      .r(function(d) {return d.t});
  const points = [{x: 20, y:20, t: 10},{x:200,y:20, t: 5},{x:20,y:200, t: 15},{x:200,y:200, t: 2}];
  const streamlinePathD = streamline(points);
  test.equal(streamlinePathD, "M19.999999999999996,30L186.8353040367397,25.36568599897945L186.8353040367397,25.36568599897945L9.393398282201789,189.3933982822018L19.999999999999996,215L200,202L200,198L52.132182824528996,187.3206576484382L52.132182824528996,187.3206576484382L203.53553390593274,23.535533905932738L200,15L20,10Z");
  test.end();
});
