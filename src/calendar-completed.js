window.onload = function(){

    //前ページからのデータ引継ぎ
    let title = sessionStorage.getItem('title');
    let img = sessionStorage.getItem('img');
    let phone = sessionStorage.getItem('phone');
    let date = sessionStorage.getItem('date');
    let memo = sessionStorage.getItem('memo');

    //タイトル・サブタイトル入力
    document.getElementById('calendarTitle').innerHTML = title;

    //メッセージ表示
    document.getElementById('completeMessageDate').innerHTML = date;
    document.getElementById('completeMessage1').innerHTML = `面談の予約ありがとうございます。`;
    document.getElementById('completeMessagePhone').innerHTML = `当日は、担当エージェントよりお電話差し上げます。`;

    if(memo == null){
        ""
    }
    else if(memo.indexOf('新卒採用') != -1){
        document.getElementById('completeMessage2').innerHTML = `会社の紹介や業務内容などお話しさせていただき、視野を広く持つ良い機会になれば幸いです。`;
        document.getElementById('completeMessage3').innerHTML = `当日お話をできるのを楽しみにしております。引き続きどうぞ、よろしくお願い致します。`;

    }else{
        document.getElementById('completeMessage2').innerHTML = `現職の活動や転職意向をお伺いしながらお話し、視野を広く持つ良い機会になれば幸いです。`;
        document.getElementById('completeMessage3').innerHTML = `当日お話をできるのを楽しみにしております。引き続きどうぞ、よろしくお願い致します。`;
    }

    //タイトル画像設定
    if(img == 'ASSIGN'){
        document.getElementById('calendarTitle').insertAdjacentHTML('beforebegin','<img class="title-image-assign" src="./img/ASSIGN.png">');
    }else if(img == 'VIEW'){
        document.getElementById('calendarTitle').insertAdjacentHTML('beforebegin','<img class="title-image-view" src="./img/VIEW.png">');
    }else{
        document.getElementById('calendarTitle').insertAdjacentHTML('beforebegin','<img class="title-image-assign" src="./img/ASSIGN.png">');
    };

    //ASSIGN導線表示
    if(memo.indexOf('メディア') !== -1){
        document.getElementById('assignImg').style.display = 'block';
        document.getElementById('assignImgPhone').style.display = 'block';
    }

    sessionStorage.removeItem('title');
    sessionStorage.removeItem('img');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('memo');
    sessionStorage.removeItem('cc_data');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('lastName');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('entry_age');
    sessionStorage.removeItem('school');
    sessionStorage.removeItem('job');
    sessionStorage.removeItem('company');
    sessionStorage.removeItem('date');
    sessionStorage.removeItem('id');
};