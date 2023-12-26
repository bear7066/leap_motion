// canvas.js
// This javascript is used to manage the tracer canvas 

    $(document).ready(function() {
        // 設定兩個圓的位置
        var startPoint = { x: 100, y: 200 };
        var endPoint = { x: 700, y: startPoint.y };
        // 圓半徑
        var hoverTargetsRadius = 20;
        // 用於儲存用戶的路徑
        var pathPoints = [];
        var isTracking = false;
    
        addUserPathLayer();
    
        // 灰色線段
        $('canvas').drawLine({
            x1: startPoint.x + hoverTargetsRadius,
            y1: startPoint.y,
            x2: endPoint.x - hoverTargetsRadius,
            y2: endPoint.y,
            layer: true,
            strokeWidth: 3,
            strokeStyle: '#aaa',
            visible: false,
            name: 'guideline'
        });
    
        $('canvas').drawArc({
            fillStyle: '#0a0',
            x: startPoint.x,
            y: startPoint.y,
            radius: hoverTargetsRadius,
            layer: true,
            name: 'startCircle',
            mouseover: function() {
                $(this).animateLayer('startCircle', {
                    fillStyle: '#0c0'
                }, 250);
                resetPath();
                isTracking = true;
                showGuideline(false);
            },
            mouseout: function() {
                $(this).animateLayer('startCircle', {
                    fillStyle: '#0a0'
                }, 250);
            }
        });
    
        $('canvas').drawArc({
            fillStyle: '#00d',
            x: endPoint.x,
            y: endPoint.y,
            radius: hoverTargetsRadius,
            layer: true,
            name: 'targetCircle',
            mouseover: function() {
                $(this).animateLayer('targetCircle', {
                    fillStyle: '#55f'
                }, 250);
                if (isTracking) {
                    isTracking = false;
                    showGuideline(true);
                    analyzePerformance();
                }
            },
            mouseout: function() {
                $(this).animateLayer('targetCircle', {
                    fillStyle: '#00d'
                }, 250);
            }
        });
    
        $('canvas').drawText({
            fillStyle: '#000',
            x: 400, y: 20,
            fontSize: 16,
            text: 'Mouseover the green circle and draw a straight line to the blue circle.',
            layer: true,
            name: 'resetText'
        });
    
        $('canvas').mousemove(function(event) {
            if (isTracking) {
                var rect = $('canvas').offset();
                var cursor_x = event.pageX - rect.left;
                var cursor_y = event.pageY - rect.top;
                pathPoints.push([cursor_x, cursor_y]);
    
                var i = pathPoints.length;
                var pathLayer = $('canvas').getLayer('userPath');
                pathLayer['x' + i] = pathPoints[i - 1][0];
                pathLayer['y' + i] = pathPoints[i - 1][1];
            }
        });
    
        function addUserPathLayer() {
            $('canvas').addLayer({
                name: 'userPath',
                type: 'line',
                strokeStyle: '#f00',
                strokeWidth: 3
            });
        }
    
        function resetPath() {
            pathPoints = [];
            isTracking = false;
            $('canvas').removeLayer('userPath');
            addUserPathLayer();
        }
    
        function showGuideline(show) {
            $('canvas').setLayer('guideline', { visible: show }).drawLayers();
        }
    
        function analyzePerformance() {
            var sumOfDeviations = 0;
            for (var i = 0; i < pathPoints.length; i++) {
                var deviationY = pathPoints[i][1] - startPoint.y;
                sumOfDeviations += Math.abs(deviationY);
            }
            $('#results').html('Average Deviation: ' + Math.round(sumOfDeviations / pathPoints.length) + ' pixels');
        }
    });
    