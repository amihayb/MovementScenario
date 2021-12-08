
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
        title: 'Bounce Profile',
        subplot_titles: ['aaa','asca','acsas'],
        xaxis: {
            title: 'Time [s]'
        }, 
        yaxis: {
            title: 'Acc. [rad/s<sup>2</sup>]'
        },
        title2: 'aaa',
        yaxis2: {
            title: 'Rate [rad/s]'
        },
        yaxis3: {
            title: 'Angle [deg]'
        }
    }
    Plotly.newPlot('plot', data, layout, {editable: true});
}

function addProfile(data, profileNum) {
    if (document.getElementById('profile'+ profileNum).checked){
        let xEnd = Math.PI/180.0*parseFloat( document.getElementById('txt_q' + profileNum).value );
        let vMax = parseFloat( document.getElementById('txt_w' + profileNum).value );
        let aMax = parseFloat( document.getElementById('txt_a' + profileNum).value );
        var profileData = calcLine(xEnd, vMax, aMax);
        data.push(addLine(profileNum,1,profileData.t,profileData.A));
        data.push(addLine(profileNum,2,profileData.t,profileData.V));
        data.push(addLine(profileNum,3,profileData.t,toDeg( profileData.Q ) ) );
        //data.push(calcLine(D,slope));
        //return calcLine(D,slope);
}
    return;

function calcLine(xEnd, vMax, aMax) {
    // Movement Profile
    let t1 = vMax / aMax;
    let x1 = aMax * t1 ** 2 / 2;

    let t3 = vMax / aMax;
    let x3 = -aMax * t3 ** 2 / 2 + vMax * t3;

    let x2 = xEnd - x1 - x3;
    let t2 = x2 / vMax;
    
    if (x2 < 0) {
        t1 = Math.sqrt(xEnd/aMax);
        t2 = 0;
        t3 = t1;
    }

	tv = makeArr(0,t1+t2+t3,(t1+t2+t3)*100+1);
	let Av = [];
    let Vv = [];
    let Qv = [];
    Av[0] = 0;
	Vv[0] = 0;
    Qv[0] = 0;

	tv.forEach(t => {
        let a = 0;
        if (t < t1) {
            a = aMax;
        } else if (t >= t1+t2) {
            a = -aMax;
        }
        v = Vv.at(-1) + a*0.01;
        q = Qv.at(-1) + v*0.01;
 		
		Av.push(a);
		Vv.push(v);
        Qv.push(q);
	});
	
	let res = {'t':tv, 'Q':Qv, 'V':Vv, 'A':Av};
    return res;
    }

    function addLine(vNum, ax, x,y) {

        var trace = {
          x: x,
          y: y,
          yaxis: 'y' + ax,
          name: 'Profile'+ vNum,
          legendgroup: 'Profile'+ vNum,
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

let isOdd = (num) => (num & 1) ? true : false;
let isOne = (num) => (num == 1) ? true : false;
let toDeg = (array) => array.map(x => x * 180/Math.PI);
