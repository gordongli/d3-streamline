(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-shape')) :
	typeof define === 'function' && define.amd ? define(['exports', 'd3-shape'], factory) :
	(factory((global.d3 = global.d3 || {}),global.d3));
}(this, function (exports,d3) { 'use strict';

	d3 = 'default' in d3 ? d3['default'] : d3;

	function streamline () {
		var _lineConstructor = d3.line();
		var _xAccessor = function (d) {return d.x};
		var _yAccessor = function (d) {return d.y};
		var _rAccessor = function (d) {return d.r};
		var _curve = d3.curveLinearClosed;

		function _streamline(pathData) {

			var bothPoints = buildStreamline(pathData);

			return _lineConstructor.x(function (d) {return d.x}).y(function (d) {return d.y}).curve(_curve)(bothPoints);
		}

		_streamline.x = function (_value) {
			if (!arguments.length) return _xAccessor;

			_xAccessor = _value;
			return _streamline;
		};

		_streamline.y = function (_value) {
			if (!arguments.length) return _yAccessor;

			_yAccessor = _value;
			return _streamline;
		};

		_streamline.r = function (_value) {
			if (!arguments.length) return _rAccessor;

			_rAccessor = _value;
			return _streamline;
		};

		_streamline.curve = function(_value) {
			if (!arguments.length) return _curve;

			_curve = _value;
			return _streamline;
		};

		return _streamline;

		function offsetEdge(d) {
			var diffX = _yAccessor(d.target) - _yAccessor(d.source);
			var diffY = _xAccessor(d.target) - _xAccessor(d.source);

			var angle0 = ( Math.atan2( diffY, diffX ) + ( Math.PI / 2 ) );
			var angle1 = angle0 + ( Math.PI * 0.5 );
			var angle2 = angle0 + ( Math.PI * 0.5 );

			var x1 = _xAccessor(d.source) + (_rAccessor(d.source) * Math.cos(angle1));
			var y1 = _yAccessor(d.source) - (_rAccessor(d.source) * Math.sin(angle1));
			var x2 = _xAccessor(d.target) + (_rAccessor(d.target) * Math.cos(angle2));
			var y2 = _yAccessor(d.target) - (_rAccessor(d.target) * Math.sin(angle2));

			return {x1: x1, y1: y1, x2: x2, y2: y2}
		}

		function buildStreamline(points) {
			var bothCode = [];
			var x = 0;
			var transformedPoints = {};

			while (x < points.length) {
				if (x !== points.length - 1) {
					transformedPoints = offsetEdge({source: points[x], target: points[x + 1]});
					var p1 = {x: transformedPoints.x1, y: transformedPoints.y1};
					var p2 = {x: transformedPoints.x2, y: transformedPoints.y2};
					bothCode.push(p1,p2);
					if (bothCode.length > 3) {
						var l = bothCode.length - 1;
						var lineA = {a: bothCode[l - 3], b: bothCode[l - 2]};
						var lineB = {a: bothCode[l - 1], b: bothCode[l]};
						var intersect = findIntersect(lineA.a.x, lineA.a.y, lineA.b.x, lineA.b.y, lineB.a.x, lineB.a.y, lineB.b.x, lineB.b.y);
						if (intersect.found === true) {
							lineA.b.x = intersect.x;
							lineA.b.y = intersect.y;
							lineB.a.x = intersect.x;
							lineB.a.y = intersect.y;
						}
					}
				}

				x++;
			}
			x--;
			//Back
			while (x >= 0) {
				if (x !== 0) {
					transformedPoints = offsetEdge({source: points[x], target: points[x - 1]});
					var p1 = {x: transformedPoints.x1, y: transformedPoints.y1};
					var p2 = {x: transformedPoints.x2, y: transformedPoints.y2};
					bothCode.push(p1,p2);
					if (bothCode.length > 3) {
						var l = bothCode.length - 1;
						var lineA = {a: bothCode[l - 3], b: bothCode[l - 2]};
						var lineB = {a: bothCode[l - 1], b: bothCode[l]};
						var intersect = findIntersect(lineA.a.x, lineA.a.y, lineA.b.x, lineA.b.y, lineB.a.x, lineB.a.y, lineB.b.x, lineB.b.y);
						if (intersect.found === true) {
							lineA.b.x = intersect.x;
							lineA.b.y = intersect.y;
							lineB.a.x = intersect.x;
							lineB.a.y = intersect.y;
						}
					}
				}

				x--;
			}

			return bothCode;
		}

		function findIntersect(l1x1, l1y1, l1x2, l1y2, l2x1, l2y1, l2x2, l2y2) {
			var d, a, b, n1, n2, result = {
				x: null,
				y: null,
				found: false
			};
			d = ((l2y2 - l2y1) * (l1x2 - l1x1)) - ((l2x2 - l2x1) * (l1y2 - l1y1));
			if (d === 0) {
				return result;
			}
			a = l1y1 - l2y1;
			b = l1x1 - l2x1;
			n1 = ((l2x2 - l2x1) * a) - ((l2y2 - l2y1) * b);
			n2 = ((l1x2 - l1x1) * a) - ((l1y2 - l1y1) * b);
			a = n1 / d;
			b = n2 / d;

			result.x = l1x1 + (a * (l1x2 - l1x1));
			result.y = l1y1 + (a * (l1y2 - l1y1));

			if ((a > 0 && a < 1) && (b > 0 && b < 1)) {
				result.found = true;
			}

			return result;
		}

	}

	exports.streamline = streamline;

	Object.defineProperty(exports, '__esModule', { value: true });

}));