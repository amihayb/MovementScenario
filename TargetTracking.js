
function plotMe() {

    var myPlot = document.getElementById('plot');

    var data = [];
    for (var i = 1; i < 4; i++)
        addProfile(data, i.toString());

    var layout = {
        grid: {
            rows: 3,
            columns: 1,
            pattern: 'coupled',
            roworder: 'top to bottom'
          },
        title: 'Target Tracking Profile',
        xaxis: {
            title: 'Time [s]'
        }, 
        yaxis: {
            title: 'Acc. <br>[rad/s<sup>2]'
        },
        yaxis2: {
            title: 'Rate <br>[rad/s]'
        },
        yaxis3: {
            title: 'Angle <br>[deg]'
        }
    }
    Plotly.newPlot('plot', data, layout, {editable: true});
}

function addProfile(data, profileNum) {
    if (document.getElementById('profile'+ profileNum).checked){
        let v = parseFloat( document.getElementById('txt_v' + profileNum).value );
        let r = parseFloat( document.getElementById('txt_r' + profileNum).value );
        let q = Math.PI/180.0*parseFloat( document.getElementById('txt_q' + profileNum).value );
        var profileData = calcLine(v, r, q);
        data.push(addLine(profileNum,1,profileData.t,profileData.A));
        data.push(addLine(profileNum,2,profileData.t,profileData.V));
        data.push(addLine(profileNum,3,profileData.t,toDeg( profileData.Q ) ) );
        //data.push(calcLine(D,slope));
        //return calcLine(D,slope);
}
    return;

function calcLine(target_v, target_r, q0) {
    // Movement Profile
    const x0 = target_r*Math.tan(q0);
    const tEnd = 2*x0 / target_v;

	tv = makeArr(0,tEnd,tEnd*100+1);
	let Av = [];
    let Vv = [];
    let Qv = [];
    Av[0] = 0;
	Vv[0] = 0;
    Qv[0] = 0;

	tv.forEach(t => {
        let x = -x0+target_v*t;
        let q = Math.atan2(x,target_r);

        v = ( q - Qv.at(-1) ) / 0.01;
        a = ( v - Vv.at(-1) ) / 0.01;
 		
		Av.push(a);
		Vv.push(v);
        Qv.push(q);
	});
    Qv[0] = Qv[1];
    Vv[1] = Vv[2];
    Vv[0] = Vv[2];
    Av[2] = Av[3];
    Av[1] = Av[3];
	Av[0] = Av[3];

	let res = {'t':tv, 'Q':Qv, 'V':Vv, 'A':Av};
    return res;
    }

    function addLine(vNum, ax, x,y) {

        var trace = {
          x: x,
          y: y,
          yaxis: 'y' + ax,
          name: 'Target'+ vNum,
          legendgroup: 'Target'+ vNum,
          line: {
              color: getColor(vNum-1)
          },
          showlegend: isOne(ax),
          type: 'scatter',
        };
        return trace;
      } 
}


function makeArr(startValue, stopValue, cardinality) {
    var arr = [];
    var step = (stopValue - startValue) / (cardinality - 1);
    for (var i = 0; i < cardinality; i++) {
        arr.push(startValue + (step * i));
    }
    return arr;
}

function getColor(n) {

    let colorVec = [
    '#1f77b4',  // muted blue
    '#ff7f0e',  // safety orange
    '#2ca02c',  // cooked asparagus green
    '#d62728',  // brick red
    '#9467bd',  // muted purple
    '#8c564b',  // chestnut brown
    '#e377c2',  // raspberry yogurt pink
    '#7f7f7f',  // middle gray
    '#bcbd22',  // curry yellow-green
    '#17becf'];   // blue-teal

    return colorVec[n];
}

function diff(y) {
    let Ts = 0.01;
    let d = [];
    for (i = 1; i < y.length; i++) {
      d[i] = (Number(y[i]) - Number(y[i - 1])) / Ts;
    }
    d[0] = d[1];
    return d;
  }

let isOdd = (num) => (num & 1) ? true : false;
let isOne = (num) => (num == 1) ? true : false;
let toDeg = (array) => array.map(x => x * 180/Math.PI);
