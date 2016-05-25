shamanicWebApp.directive('grid', function() {
    return {
        replace: true,
        restrict: 'E',
        template: "<canvas id='xyCanvas'></canvas>",
        scope: {
            width:'@',
            height:'@'
        },
        link: function(scope, element, attributes) {

            d3.selectAll("canvas").attr("width", 600).attr("height", 800);
            var canvas = document.getElementById('xyCanvas');
            var ctx = canvas.getContext("2d");
            var cty = canvas.getContext("2d");

            element.bind('mousemove', function(event) {
                drawBackground();
                draw(event.x, event.y);
            });

            function draw(mouseX, mouseY) {

                // fixes offset caused by event.clientX and the canvas element
                // having different origins for their coordinate systems:
                var xCoord = mouseX - canvas.getBoundingClientRect().left;
                var yCoord = mouseY - canvas.getBoundingClientRect().top;

                ctx.beginPath();
                ctx.strokeStyle = "black";
                ctx.lineWidth = 0.1;
                ctx.moveTo(xCoord, 0);
                ctx.lineTo(xCoord, canvas.height);
                ctx.stroke();
                ctx.closePath();

                cty.beginPath();
                cty.strokeStyle = "black";
                cty.lineWidth = 0.1;
                cty.moveTo(0, yCoord);
                cty.lineTo(canvas.width, yCoord);
                cty.stroke();
                cty.closePath();
            }

            function drawBackground() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }

            function detectIntersections() {
                // TODO: This is enormously complicated.. or at least, requires a lot of code.
            }
        }
    }
});