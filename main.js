
const firebaseConfig = {
    apiKey: "AIzaSyA0Pxdsx9l2bh9TTWGIatGYBBfo4nh5rOM",
    authDomain: "giamsatdiennang-f395a.firebaseapp.com",
    projectId: "giamsatdiennang-f395a",
    storageBucket: "giamsatdiennang-f395a.appspot.com",
    messagingSenderId: "264457281278",
    appId: "1:264457281278:web:8e6d2e85b0bf478ab58faf",
    measurementId: "G-PGS38WNGMS"
  };
    

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
var Amperage;
var Voltage;
var Power;
var Energy;
var Energy_Old;
var Energy_Month;
var Energy_Month_Old;
var money;
var OnOf;
var Mode;
var state = false;
var j = false;
var valueMode;
var Data_Warning;

//======================Bật tắt============================================================
$(document).ready(function() {
    var database = firebase.database().ref('DataMode');
    database.on('value', snap =>{
        valueMode = Object.values(snap.val());
        Mode = parseInt(valueMode[0]);
        if(Mode == 1) {
            document.querySelector(".btn_On_Off").style.backgroundColor = "#33FF66";
        } else if(Mode == 0) {
            document.querySelector(".btn_On_Off").style.backgroundColor = "#E54646";
        }
    });
    $(".btn_On_Off").click(function(){
        var firebaseRef = firebase.database().ref('DataMode').child("Mode")
        state =!state;
        if(state == true) {
            Mode = '1'
        } else {
            Mode = '0'
        }
        if(Mode == '1') {
            firebaseRef.set('1');
        } else {
            firebaseRef.set('0');
        }
    }) 

});

//========================================================================================

//==================Lấy data trên firebase================================================
var userData = firebase.database().ref('UsersData');
userData.on('value', snap => {
    var objectValue = snap.val();
    var arrayValue = Object.entries(objectValue);
    var arrayValue2 = arrayValue[arrayValue.length - 1];
    var finalValue = arrayValue2[arrayValue2.length - 1];
    Amperage = finalValue["Amperage"];
    Voltage = finalValue["Voltage"];
    Power = finalValue["Power"];
    Energy = finalValue["Energy"];
    Energy_Old = finalValue["Energy_Old"];
    Energy_Month = finalValue["Energy_Month"];
    Energy_Month_Old = finalValue["Energy_Month_Old"];
    //====================Biểu đồ tròn hiển thị Ampe và Voltage=============================
    let options1 = {
        startAngle: -1.55,
        size: 250,
        value: Amperage / 100,
        fill:{gradient: ['#1071cc', '#13a3cf']}
    }
    
    $(".wrapper__bar_ampe").circleProgress(options1).on('circle-animation-progress',
        function(event, progress, stepValue){
            $(this).parent().find("span").text(String(100*stepValue).substr(0,5) + " A");
    });
    
    let options2 = {
        startAngle: -1.55,
        size: 250,
        value: Voltage / 250,
        fill:{gradient: ['#1071cc', '#13a3cf']}
    
    }

    $(".wrapper__bar_volt").circleProgress(options2).on('circle-animation-progress',
        function(event, progress, stepValue){
            $(this).parent().find("span").text(String(250*stepValue).substr(0,5) + " V");
    });
    //====================================================================================

    //==============================Hiển thị các thông số==================================
    if(Energy_Month_Old > 0 && Energy_Month_Old <= 50) {
        money = Energy_Month_Old * 1678;
    }
    else if(Energy_Month_Old > 50 && Energy_Month_Old <= 100) {
        money = Energy_Month_Old * 1734;
    } 
    else if(Energy_Month_Old > 101 && Energy_Month_Old <= 200) {
        money = Energy_Month_Old * 2014;
    } 
    else {
        money = Energy_Month_Old * 2536;
    }

    document.querySelector('.wrapper__power_value').innerHTML = String(Power).substr(0,10) + "W";
    document.querySelector('.wrapper__Engery_day').innerHTML = String(Energy).substr(0,6) + " KWH";
    document.querySelector('.wrapper__Engery_Old').innerHTML = String(Energy_Old).substr(0,6) + " KWH";
    document.querySelector('.wrapper__Energy_Month').innerHTML = String(Energy_Month).substr(0,6) + " KWH";
    document.querySelector('.wrapper__Energy_Month-Old').innerHTML = String(Energy_Month_Old).substr(0,6) + " KWH";
    document.querySelector('.wrapper__Engery_money').innerHTML = String(money).substr(0,6) + " đ";

    //===========================================================================================


    //=================================Vẽ đồ thị công suất=======================================
    var today = new Date();
    var hh = today.getHours();
    var mm = today.getMinutes();
    mm = checkTime(mm);
    var label_time = hh + ":" + mm;

    var DD = today.getDate();
    var MM = today.getMonth() + 1;
    var YY = today.getFullYear();
    DD = checkTime(DD);
    MM = checkTime(MM);

    var label_date = DD + "/" + MM + "/" + YY;
    

    var data = {
        labels: [label_time],
        datasets: [{
            label: 'Đường công suất',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [parseFloat(Power)],
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            animations: {
                tension: {
                    duration: 1500,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    color: 'var(--black-color)',
                    text: 'Biểu đồ công suất',
                    font:{
                        size:25,
                        weight:500,
                    }
                }
            },
            scales: {
                y: { 
                    min: 0,
                    max: 3000,
                    grid: {
                        borderColor: 'var(--black-color)',
                    },
                    title: {
                        color: 'var(--black-color)',
                        display: true,
                        text: 'Giá trị công suất',
                        font:{
                            size:18,
                            weight:500,
                        }
                    }
                },
                x: {
                    grid: {
                        borderColor: 'var(--black-color)',
                        
                    },
                    title: {
                        color: 'var(--black-color)',
                        display: true,
                        text: 'Thời gian',
                        font:{
                            size:18,
                            weight:500,
                        }
                    },   
                }
            },
        }
    };

    var myChart = new Chart(
        document.getElementById('myChart'),
        config
    );

    function addData() {
        var today = new Date();
        var hh = today.getHours();
        var mm = today.getMinutes();
        mm = checkTime(mm);
        var label_time = hh + ":" + mm;
        
        myChart.data.labels.push(label_time);
        myChart.data.datasets.forEach((dataset) => {
            dataset.data.push(parseFloat(Power));
            console.log(dataset.data);
        });
        myChart.update();
    };
    setInterval(addData,40000);

    //==============================================================================================

    Data_Warning = [
        {
            id: 1,
            name: 'Cảnh báo: Công suất quá tải',
            note: 'Lưu ý: Ngắt Aptomat tránh cháy nổ ',
            date: label_date,
            time: label_time,

        },
        {   
            id: 2,
            name: 'Cảnh báo: Điện năng sử dụng ngày hôm nay nhiều hơn ngày hôm qua',
            note: 'Lưu ý: Ngắt thiết bị điện không dùng đến',
            date: label_date,
            time: label_time,
        },
        {
            id: 3,
            name: 'Thông báo: Tiền điện tháng này là: '+ money + 'đ',
            note: 'Lưu ý: Nộp tiền đúng hạn ',
            date: label_date,
            time: label_time,
        },
        {
            id: 4,
            name: 'Cảnh báo: Điện áp giảm ',
            note: 'Lưu ý: Ngắt thiêt bị điện công suất lớn',
            date: label_date,
            time: label_time,
        },
        {
            id: 5,
            name: 'Cảnh báo: Tiêu thụ điện vượt mức 50 số ',
            note: 'Lưu ý: Hãy tiết kiệm điện nào',
            date: label_date,
            time: label_time,
        },
        {
            id: 6,
            name: 'Cảnh báo: Tiêu thụ điện vượt mức 100 số ',
            note: 'Lưu ý: Hãy tiết kiệm điện nào',
            date: label_date,
            time: label_time,
        },
        {
            id: 7,
            name: 'Cảnh báo: Tiêu thụ điện vượt mức 200 số ',
            note: 'Lưu ý: Hãy tiết kiệm điện nào',
            date: label_date,
            time: label_time,
        },
    ];
    var data_add = [];
    $('.header__notify-item--has-notify').mouseenter(function() {
        Data_Warning.forEach((data) => {
            if( (Voltage < 110 && data.id === 4) || 
                (Power > 8000 && data.id === 1) ||
                (Energy > Energy_Old && data.id === 2) ||
                (DD === "01" && data.id === 3) ||
                ((Energy > 50 && Energy < 100) && data.id === 5) ||
                ((Energy >= 100 && Energy < 200) && data.id === 6) ||
                (Energy >= 200 && data.id === 7)) {
                data_add.push(data);
                render(data_add);   
            } 
        });
    });
    $('.header__notify-item--has-notify').mouseleave(function() {
        $('.header__notify-item').remove();
    })

    function render(datas) {
        const listWarning = document.querySelector('.header__notify-list') ;
        if(listWarning) {
            const itemWarning = document.createElement('li');
            itemWarning.classList.add('header__notify-item','header__notify-item--viewed');
            datas.forEach((data) => {
                itemWarning.innerHTML = `
                 <div class="header__notify-date">
                     <div class="header__notify-day">${data.date}</div>
                     <div class="header__notify-time">${data.time}</div>
                 </div>
                <div class="header__notify-info">
                     <div class="header__notify-name">${data.name} </div>
                     <div class="header__notify-note">${data.note}</div>
                 </div>
             `;
                listWarning.appendChild(itemWarning);
            });

        }
    }
    var count = 0;
    if(Voltage < 238 || Power > 8000 || Energy > Energy_Old || DD === "01" || Energy > 50 && Energy < 100 || Energy >= 100 && Energy < 200 || Energy >= 200) {
        count ++ ;
        document.querySelector('.fa-bell').style.color = 'red';
        document.querySelector('.header__navar-notice').innerHTML = count;
    } else {
        document.querySelector('.fa-bell').style.color = '#333';
        document.querySelector('.header__navar-notice').innerHTML = count;
    }
});


//==========================Hàm tính thời gian=====================================================
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}
// Hàm khởi tạo đồng hồ
function startTime() {
    // Lấy Object ngày hiện tại
    var today = new Date();
 
    // Giờ, phút, giây hiện tại
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
 
    // Chuyển đổi sang dạng 01, 02, 03
    m = checkTime(m);
    s = checkTime(s);
 
    // Ghi ra trình duyệt
    document.querySelector('.displays__header-time--text').innerHTML = h + ":" + m + ":" + s;
 
    // Dùng hàm setTimeout để thiết lập gọi lại 0.5 giây / lần
    var t = setTimeout(function() {
        startTime();
    }, 100);
}
//Hàm khởi tạo ngày
function startDay() {

    var d = new Date();
    var Day = d.getDate();
    var Month = d.getMonth() + 1;
    var Year = d.getFullYear();
    Day = checkTime(Day);
    Month = checkTime(Month);

    document.querySelector('.displays__header-date--text').innerHTML = Day + "/" + Month + "/" + Year;
 
    // Dùng hàm setTimeout để thiết lập gọi lại 0.5 giây / lần
    var t = setTimeout(function() {
        startDay();
    }, 200);
}
//==========================================================================================================
//=============================LOGIN LOGOUT==============================================
const btnlogin = document.querySelector('.btn__signin');
const btnsignup = document.querySelector('.btn__signup');
const modal_signUp = document.querySelector('.js-modal_signup');
const modal_signIn = document.querySelector('.js-modal_signin')
const modal_container_signup = document.querySelector('.js_container-signup');
const modal_container_signin = document.querySelector('.js_container-signin');

function showLogin() {
    modal_signIn.classList.add('open');
}
function showSignUp() {
    modal_signUp.classList.add('open');
}
function hideSignUp() {
    modal_signUp.classList.remove('open');
}
function hideSignIn() {
    modal_signIn.classList.remove('open');
}
btnlogin.addEventListener('click',showLogin);
btnsignup.addEventListener('click',showSignUp);
modal_signUp.addEventListener('click',hideSignUp);
modal_signIn.addEventListener('click',hideSignIn);
modal_container_signup.addEventListener('click',function(event) {
    event.stopPropagation()
})
modal_container_signin.addEventListener('click',function(event) {
    event.stopPropagation()
})
