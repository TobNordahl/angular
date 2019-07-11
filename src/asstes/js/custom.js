
    
export function linePlot(name, xdata, ydata){
      var myChart = Highcharts.chart(name, {
        title: {
            text: 'Pension'
        },
        xAxis: {
            data: xdata
        },
        yAxis: {
            title: {
                text: 'Pension'
            }
        },
        series: [{
            data: ydata
        },]
    });
}

  export function iterateTime(dep,data,plotData,risk,expReturn,age,planedPensionAge,duration,lifeExp){
    var DT = duration;
    var j=0;
    for (j = 0; j < (planedPensionAge - age); j++){
      plotData.time[j] = age + j;
      plotData.M[j] = data.M;
      plotData.V[j] = data.V;
      plotData.hogtUtfall[j] = data.hogtUtfall;
      plotData.lagtUtfall[j] = data.lagtUtfall;
      analytic(dep,data,risk,expReturn,0,999999)
    }
    for (j = (planedPensionAge - age); j < ((planedPensionAge-age)+duration); j++){
      plotData.time[j] = age + j;
      plotData.M[j] = data.M;
      plotData.V[j] = data.V;
      plotData.hogtUtfall[j] = data.hogtUtfall;
      plotData.lagtUtfall[j] = data.lagtUtfall;
      if (DT!=0){
        var withdraw = -data.M/DT;
        analytic(withdraw
      ,data,risk,expReturn,0,DT);
      DT = DT-1;
      }
      else{
        data.M=0;
        data.hogtUtfall=0;
        data.lagtUtfall=0;
        data.V=0;
      }
    }
        
    for (j = (planedPensionAge-age)+duration; j<lifeExp-age; j++ ){
      plotData.time[j] = age + j;
      plotData.M[j] = 0;
      plotData.V[j] = 0;
      plotData.hogtUtfall[j] = 0;
      plotData.lagtUtfall[j] = 0;
    }
  }

  export function utbetalningPerManad(data,dataUtbetalning,age,planedPensionAge,lifeExp){
    var j;
    var T1 = planedPensionAge-age;
    var T2 = lifeExp-age;
    var temp_DT;
    temp_DT = data.DT;
    for (j = 0; j<lifeExp-age; j++){
      dataUtbetalning.time[j] = age+j;
      dataUtbetalning.M[j] = 0;
      dataUtbetalning.hogtUtfall[j] = 0;
      dataUtbetalning.lagtUtfall[j] = 0;
    }

    for (j = T1; j < T2; j++){
        if (temp_DT != 0){
          dataUtbetalning.M[j] = dataUtbetalning.M[j] + (data.M[j]/temp_DT)/12;

          dataUtbetalning.hogtUtfall[j] = dataUtbetalning.hogtUtfall[j] + (data.hogtUtfall[j]/temp_DT)/12;

          dataUtbetalning.lagtUtfall[j] = dataUtbetalning.lagtUtfall[j] + (data.lagtUtfall[j]/temp_DT)/12;

          temp_DT--; 
        }else{
          dataUtbetalning.M[j] = dataUtbetalning.M[j];

          dataUtbetalning.hogtUtfall[j] = dataUtbetalning.hogtUtfall[j];

          dataUtbetalning.lagtUtfall[j] = dataUtbetalning.lagtUtfall[j];
        }
    }
  }

  export function analytic(dep,data,sigma,mu,ARV,DT){
    var M = data.M;
    var V = data.V;
    data.M = expectedValue( M, mu, dep, ARV);
    data.V = variance( M, V, mu, sigma, DT, ARV);
    data.lagtUtfall = fractile( data.M, data.V, 5);
    data.hogtUtfall = fractile( data.M, data.V, 95);
  }

  export function fractile(m,v,p){
    var a;
    var b;
    var Nvec = [];
    var N;
    var x;
    var i;
    if (p==95){
        N = 1.645;
    }else if (p==5){
        N = -1.645;
    }
    a = Math.log(m);
    b = Math.sqrt(Math.log(1+v*Math.exp(-2*a)));
    //x = Math.exp(b*N+a-(1/2)*b*2);
    x = Math.exp(b*N+a-(1/2)*Math.pow(b,2));
    return x; 
  }

  export function variance(M,V,mu,sigma,DT,ARV){
    V = V*Math.pow(Math.exp(ARV + mu) - 1/DT, 2) + (V + Math.pow(M, 2))*Math.exp(2*mu + 2*ARV)*(Math.exp(Math.pow(sigma, 2)) -1); 
    return V;
  }


export function expectedValue(M, mu, I, ARV){
    M = I + M * Math.exp(mu + ARV);
    return M;
}
    
export function deposit_withdraw(M, V, hogtUtfall, lagtUtfall, mu2, sigma2, I, DT, ARV, i){
    M[i] = expectedValue(M[i-1], mu2, I, ARV);
    V[i] = variance(M[i-1], V[i-1], mu2, sigma2, DT, ARV);
    lagtUtfall[i] = fractile(M[i], V[i], 5);
    hogtUtfall[i] = fractile(M[i], V[i], 95);
}

export function fill_salary_vector(salH, salM, salL, valH, valM, valL, i){
    salH[i] = valH;
    salM[i] = valM;
    salL[i] = valL;
}

export function tjanstepension_omrakning(sal, DT, type, T0, T1, T2){
    if (type!=1){
        sum = 0;
        var TA = T2 - T0;
        var TB = T1 - T0;
        var i;
        for (i=TB; i<TA; i++){
            sum = sum + sal[i];
        }
        var omrakningPension = sum/DT;
        for  (i=TB; i<(TB+DT); i++){
            sal[i]=omrakningPension;
        }
        console.log("DELNINGSTAL TEST: "+DT)
    }
    return;
}
//Här räknas PP,TP,PS ut från året man börjar jobba tills det året all pension ska vara uttagen (25-90 är default)
//DTvec är delningstalen för PP och DT är delningstalet för TP,PS
//type==1->PP type==2->TP/PS
export function Analythic_ver2(sigma, mu, T0, T1, T2, sal, p, M, hogtUtfall, lagtUtfall, type, DT, salH, salM, salL){
    var TA = T2 - T0;
    var TB = T1 - T0;
    var helpDT = DT;
    var V = [];
    var mu2 = mu;
    var sigma2 = sigma;
    var ARV = 0.000273;
    var I;
    var IH;
    var IL;
    M[0] = sal[0]*p;
    V[0] = 0;
    lagtUtfall[0] = M[0];
    hogtUtfall[0] = M[0];
    fill_salary_vector(salH, salM, salL, sal[0]*p, sal[0]*p, sal[0]*p, 0)
    var DTvec = [23.17,	22.61,	22.03,	21.46,	20.87,	20.29,	19.69,	19.09,	18.49,	17.88,	17.26,	16.64,	16.01,	15.38,	14.75,	14.11,	13.47,	12.83,	12.18,	11.54,	10.9,	10.26,	9.62,	8.99,	8.38,	7.78,	7.19,	6.63,	6.09,	5.57,	5.09,	4.63,	4.21,	3.82,	3.47,	3.15,	2.87,	2.63,	2.43,	2.24,	2.05,	1.83,	1.55,	1.15,	0.54];
    var i; 
    for(i = 1; i < TA; i++){
        if (i < TB){     //inbetalning fram till pension räknas ut på samma sätt för de tre olika typerna
            fill_salary_vector(salH, salM, salL, sal[i]*p, sal[i]*p, sal[i]*p, i);
            deposit_withdraw(M, V, hogtUtfall, lagtUtfall, mu2, sigma2, sal[i]*p, 99999, 0, i);
        }else{
            if(type == 1){               //Det är utbetalnig för PP som ska räknas
                I = M[i-1]/DTvec[i-TB+3];
                IH = hogtUtfall[i-1]/DTvec[i-TB+3];
                IL = lagtUtfall[i-1]/DTvec[i-TB+3];
                fill_salary_vector(salH, salM, salL, IH, I, IL, i);
                deposit_withdraw(M, V, hogtUtfall, lagtUtfall, mu2, sigma2, -I, DTvec[i-TB+3], ARV, i);       
            }else{                       //Det är utbetalnig för TP,PS som ska räknas
                I = M[i-1]/DT;
                IH = hogtUtfall[i-1]/DT;
                IL = lagtUtfall[i-1]/DT;
                fill_salary_vector(salH, salM, salL, IH, I, IL, i);
                if (M[i-1] - I > 0){            //Kontroll så inte tilgångarna blir negativa 
                    deposit_withdraw(M, V, hogtUtfall, lagtUtfall, mu2, sigma2, -I, DT, ARV, i);
                    DT = DT - 1;
                }else{                      //blir tilgångarna negativa nollas allt
                    M[i] = 0;
                    V[i] = 0;
                    lagtUtfall[i] = 0;
                    hogtUtfall[i] = 0;
                }
            }
        }
    }
    //Om man vill slå ut pensionen så att den inte stiger med åren
    tjanstepension_omrakning(salM, helpDT, type, T0, T1, T2);
    tjanstepension_omrakning(salH, helpDT, type, T0, T1, T2);
    tjanstepension_omrakning(salL, helpDT, type, T0, T1, T2);
    return ;
}