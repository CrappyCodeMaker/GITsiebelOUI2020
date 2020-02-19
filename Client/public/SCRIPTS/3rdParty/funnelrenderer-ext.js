function myHandleMove(ev, gridpos, datapos, neighbor, plot) {
    var newGridPos = {
        x: gridpos.y,
        y: gridpos.x
    };
    gridpos.x = newGridPos.x;
    gridpos.y = newGridPos.y;
    neighbor = checkIntersection(gridpos, plot);
    if (neighbor) {
        var ins = [neighbor.seriesIndex, neighbor.pointIndex, neighbor.data];
        var evt1 = jQuery.Event('jqplotDataMouseOver');
        evt1.pageX = ev.pageX;
        evt1.pageY = ev.pageY;
        plot.target.trigger(evt1, ins);
        if (!(ins[0] == plot.plugins.funnelRenderer.highlightedSeriesIndex && ins[1] == plot.series[ins[0]]._highlightedPoint)) {
            var evt = jQuery.Event('jqplotDataHighlight');
            evt.which = ev.which;
            evt.pageX = ev.pageX;
            evt.pageY = ev.pageY;
            plot.target.trigger(evt, ins);
            //debugger;
            highlight(plot, ins[0], ins[1]);
		}
    } else if (neighbor == null) {
        unhighlight(plot);
    }
}


function highlight(plot, sidx, pidx) {
    var s = plot.series[sidx];
    var canvas = plot.plugins.funnelRenderer.highlightCanvas;
    canvas._ctx.clearRect(0, 0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
    s._highlightedPoint = pidx;
    plot.plugins.funnelRenderer.highlightedSeriesIndex = sidx;
    var ele = s.renderer.drawSection.call(s, canvas._ctx, s._vertices[pidx], s.highlightColors[pidx], false);
    //alert(s._vertices[pidx]);
}

function unhighlight(plot) {
    var canvas = plot.plugins.funnelRenderer.highlightCanvas;
    canvas._ctx.clearRect(0, 0, canvas._ctx.canvas.width, canvas._ctx.canvas.height);
    for (var i = 0; i < plot.series.length; i++) {
        plot.series[i]._highlightedPoint = null;
    }
    plot.plugins.funnelRenderer.highlightedSeriesIndex = null;
    plot.target.trigger('jqplotDataUnhighlight');
}

function checkIntersection(gridpos, plot) {
    var series = plot.series;
    var i, j, k, s, r, x, y, theta, sm, sa, minang, maxang;
    var d0, d, p, pp, points, bw, hp;
    var threshold, t;
    for (k = plot.seriesStack.length - 1; k >= 0; k--) {
        i = plot.seriesStack[k];
        s = series[i];
        hp = s._highlightThreshold;
        x = gridpos.x;
        y = gridpos.y;
        var v = s._vertices,
            vfirst = v[0],
            vlast = v[v.length - 1],
            lex,
            rex,
            cv;

        // equations of right and left sides, returns x, y values given height of section (y value and 2 points)

        function findedge(l, p1, p2) {
            var m = (p1[1] - p2[1]) / (p1[0] - p2[0]);
            var b = p1[1] - m * p1[0];
            var y = l + p1[1];

            return [(y - b) / m, y];
        }

        // check each section
        lex = findedge(y, vfirst[0], vlast[3]);
        rex = findedge(y, vfirst[1], vlast[2]);
        for (j = 0; j < v.length; j++) {
            cv = v[j];
            if (y >= cv[0][1] && y <= cv[3][1] && x >= lex[0] && x <= rex[0]) {
                return {
                    seriesIndex: s.index,
                    pointIndex: j,
                    gridData: null,
                    data: s.data[j]
                };
            }
        }

    }

    return null;
}