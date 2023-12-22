//「上記に同意して送信する」を押した際の処理
async function calendarSubmit(time){

    document.getElementById('formSubmitLoading').style.display = 'block';
    document.getElementById('formSubmit').style.display = 'none';

    let date = document.getElementById('formDate').getAttribute('name');

    if(date){

        let requiredFilled = true;
        let requiredMessage = [];

        let name = document.getElementById('formName').value;
        if(document.getElementById('formName').required == true){
            if(!name){
                requiredMessage.push('お名前');
                requiredFilled = false;
            };
        };

        let tel = document.getElementById('formTel').value;
        if(document.getElementById('formTel').required == true){
            if(!tel){
                requiredMessage.push('電話番号');
                requiredFilled = false;
            }else{
                let regTel = tel.replace(/[━.‐.―.－.-.ー.-]/gi,"");
                if (!regTel.match(/^0\d{9,10}$/)) {
                    requiredMessage.push('電話番号');
                    requiredFilled = false;
                }
            };
        };

        let email = document.getElementById('formEmail').value;
        if(document.getElementById('formEmail').required == true){
            if(!email){
                requiredMessage.push('メールアドレス');
                requiredFilled = false;
            }else{
                if (!email.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)) {
                    requiredMessage.push('メールアドレス');
                    requiredFilled = false;
                }
            };
        };

        let age = document.getElementById('formAge').value;
        if(document.getElementById('formAge').required == true){
            if(!age){
                requiredMessage.push('年齢');
                requiredFilled = false;
            };
        };

        let gender = document.getElementById('formGender').value;
        if(document.getElementById('formGender').required == true){
            if(!gender){
                requiredMessage.push('性別');
                requiredFilled = false;
            };
        };

        let address = document.getElementById('formAddress').value;
        if(document.getElementById('formAddress').required == true){
            if(!address){
                requiredMessage.push('お住まい');
                requiredFilled = false;
            };
        };

        let school = document.getElementById('formSchool').value;
        if(document.getElementById('formSchool').required == true){
            if(!school){
                requiredMessage.push('卒業学校名');
                requiredFilled = false;
            };
        };
        
        let company = document.getElementById('formCompany').value;
        if(document.getElementById('formCompany').required == true){
            if(!company){
                requiredMessage.push('会社名');
                requiredFilled = false;
            };
        };

        let job = document.getElementById('formJob').value;
        if(document.getElementById('formJob').required == true){
            if(!job){
                requiredMessage.push('職種');
                requiredFilled = false;
            };
        };

        let jobchange = document.getElementById('formJobchange').value;
        if(document.getElementById('formJobchange').required == true){
            if(!jobchange){
                requiredMessage.push('転職希望時期');
                requiredFilled = false;
            };
        };

        let comment = document.getElementById('formComment').value;
        if(document.getElementById('formComment').required == true){
            if(!comment){
                requiredMessage.push('コメント');
                requiredFilled = false;
            };
        };

        if(requiredFilled == false){
            alert(requiredMessage.join('・')  + '  が正しく入力されていません。');
            document.getElementById('formSubmitLoading').style.display = 'none';
            document.getElementById('formSubmit').style.display = 'block';
            return false;
        };

        const AppointmentResponse = await postAppointment(date,name,time,email_list,tel,customer_email,customer_entry_age,gender,address,customer_school,customer_job,jobchange,comment,customer_company,memo);

        //カレンダーの予約が問題なく行えた場合→メール送信
        if(AppointmentResponse.type == 'complete'){

            sessionStorage.setItem('date', document.getElementById('formDate').innerHTML);
            sessionStorage.setItem('phone', phone_list[AppointmentResponse.succeededEmailNumber]);

            //予約完了メールを送信

        
            //ユーザーは次のページへ遷移
            window.location.href = 'calendar-completed';

        //カレンダーの予約が重複して行われてしまった場合
        }else if(AppointmentResponse.type == 'error'){

            let errorDate = new Date(date);

            //日付を取得
            let month = errorDate.getMonth() + 1;
            let dates = errorDate.getDate();
            let dayOfWeek = errorDate.getDay();
            let day = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];

            //時刻を取得
            let hour = errorDate.getHours();
            let minute = errorDate.getMinutes();
            minute = (minute + '00').slice(-2);

            document.getElementById(date).outerHTML = `<dd class=""><del>${hour}:${minute}</del></dd>`;

            document.getElementById('errorMessage').innerHTML = `<p>申し訳ございません。ご予約いただいた<font color="red">【${month}月${dates}日(${day}) ${hour}:${minute}開始】</font>の時間帯にて、直前に別の予約が入ってしまいました。<br/>
            お手数ではございますが、別の時間帯を選択いただけますと幸いです。</p>`;

            document.getElementById('formSubmitLoading').style.display = 'none';
            document.getElementById('formSubmit').style.display = 'block';
        
        //想定外のエラーが発生した場合
        }else{
            document.getElementById('errorMessage').innerHTML = `<p>申し訳ございません。予約システムにエラーが発生いたしました。<br/>
            通信環境をご確認の上、再度ご予約いただけますと幸いです。<br/>
            再度エラーが発生する場合には、お手数ではございますが<a href="mailto:customer_service@a-ssign.com">customer_service@a-ssign.com</a>まで<br/>
            氏名、予約日時をご記載の上、ご連絡いただけますと幸いです。</p>  `;

            document.getElementById('formSubmitLoading').style.display = 'none';
            document.getElementById('formSubmit').style.display = 'block';
        };

    }else{
        alert('日程を1コマ選択してください。');
        document.getElementById('formSubmitLoading').style.display = 'none';
        document.getElementById('formSubmit').style.display = 'block';
    };
};

//カレンダー予約を行う関数
async function postAppointment(date,name,time,email_list,tel,email,age,gender,address,school,job,jobchange,comment,company,memo){

    //DBから返却されたメールアドレスをもとに、カレンダー予約を行う
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email_list=${email_list}&time=${time}&date=${date}&name=${name}&tel=${tel}&email=${email}&age=${age}&gender=${gender}&address=${address}&school=${school}&job=${job}&jobchange=${jobchange}&comment=${comment}&company=${company}&memo=${memo}`,
    };

    const promise = await fetch("https://script.google.com/macros/s/AKfycbw_PsQEdg8NlO_FKWJblpKzVd_C2g1iXHtqdEAmarnCCvlJt8Cq8f98O31pcPKMArIrRA/exec", requestOptions)
    const data = await promise.json();

    return data;
};

//カレンダーの次のページを表示する関数
async function nextCalendar(index){

    document.getElementById('calendarTimeTable').innerHTML = '';

    index = Number(index);
    
    //カレンダーの情報取得
    for(let i = 7 * index; i < 7 * (index + 1); i++){

        //カレンダー横のボタン表示の切り替え
        if(index > 0){
            document.getElementById('calendarArrowLeft').style.display = 'block';
            document.getElementById('calendarArrowBlockLeft').style.display = 'none';
            document.getElementById('calendarArrowLeftForPhone').style.display = 'block';
            if(Object.values(empty_list).length > 7 * (index + 1)){
                document.getElementById('calendarArrowRight').style.display = 'block';
                document.getElementById('calendarArrowBlockRight').style.display = 'none';
                document.getElementById('calendarArrowRightForPhone').style.display = 'block';
            }else{
                document.getElementById('calendarArrowRight').style.display = 'none';
                document.getElementById('calendarArrowBlockRight').style.display = 'block';
                document.getElementById('calendarArrowRightForPhone').style.display = 'none';
            };
        }else{
            document.getElementById('calendarArrowLeft').style.display = 'none';
            document.getElementById('calendarArrowBlockLeft').style.display = 'block';
            document.getElementById('calendarArrowLeftForPhone').style.display = 'none';
            if(Object.values(empty_list).length > 7 * (index + 1)){
                document.getElementById('calendarArrowRight').style.display = 'block';
                document.getElementById('calendarArrowBlockRight').style.display = 'none';
                document.getElementById('calendarArrowRightForPhone').style.display = 'block';
            }else{
                document.getElementById('calendarArrowRight').style.display = 'none';
                document.getElementById('calendarArrowBlockRight').style.display = 'block';
                document.getElementById('calendarArrowRightForPhone').style.display = 'none';
            };
        };

        //予定が存在している時のみ処理を実行
        if(empty_list[i]){
            let yearDate = Object.keys(empty_list[i]);
            let dateForDay = new Date(yearDate[0].replace(/-/g,"/"));
            var dayOfWeek = dateForDay.getDay();
            var day = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];
            let raw_date = yearDate[0].substring(5);
            let year = yearDate[0].replace(raw_date,'');
    
            date = raw_date.replace('-','/');
    
            let dateObject = Object.values(empty_list[i]);
    
            let calendarHTML = `<dl>
                                    <dt class="scrollElement">${date}<span>(${day})</span></dt>
                                    <dt class="fixedElement">${date}<span>(${day})</span></dt>`;
    
            let timeObject = Object.values(dateObject)[0];
            let timeArray = Object.keys(timeObject);
            let filledArray = Object.values(timeObject);

            const memo = sessionStorage.getItem('memo');

            //新卒採用の場合のみ例外処理
            //今日が日曜日の場合に月曜日の13時までをブロック
            if(memo === '新卒採用' && index === 0 && i === 1 && day === '月'){

                for(let n = 0; n < timeArray.length; n++){

                    let time = filledArray[n].time;
                    let filled = filledArray[n].empty;

                    //13時以前は全て埋める
                    if(time <= '13:00'){
                        calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                    }else{
                        //予定が空いているかどうか判定
                        if(filled == '0'){
                            calendarHTML += `<dd class="days_slot"><a href="#target" id="${year}${raw_date} ${time}" class="selectable_time">${time}</a></dd>`;
                        }else{
                            calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                        };
                    }    
                };
                
            }else{
                for(let n = 0; n < timeArray.length; n++){
    
                    let time = filledArray[n].time;
                    let filled = filledArray[n].empty;
        
                    //予定が空いているかどうか判定
                    if(filled == '0'){
                        calendarHTML += `<dd class="days_slot"><a href="#target" id="${year}${raw_date} ${time}" class="selectable_time">${time}</a></dd>`;
                    }else{
                        calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                    };
                };
            }

            calendarHTML += `</dl>`;
    
            document.getElementById('calendarTimeTable').insertAdjacentHTML('beforeend',calendarHTML);
        };
    };

    //日時を選択した際に、入力フォームまで移動させる処理
    const daysSlotList = document.querySelectorAll('.selectable_time');

    for(let i=0; i < daysSlotList.length; i++ ){
        daysSlotList[i].addEventListener('click',function(){
            let appointmentDate = this.id;
            appointmentDate = appointmentDate.replace('-','年').replace('-','月').replace(' ','日 ') + '～'
            document.getElementById('formDate').innerHTML = appointmentDate;
            document.getElementById('formDate').setAttribute('name', this.id);
            document.getElementById('errorMessage').innerHTML = '';
        });
    };

    document.getElementById('calendarArrowLeft').setAttribute('name',String(index + 1));
    document.getElementById('calendarArrowLeftForPhone').setAttribute('name',String(index + 1));
    document.getElementById('calendarArrowRight').setAttribute('name',String(index + 1));
    document.getElementById('calendarArrowRightForPhone').setAttribute('name',String(index + 1));
};

//カレンダーの前のページを表示する関数
function previousCalendar(index){

    document.getElementById('calendarTimeTable').innerHTML = '';

    index = Number(index-1);
    
    //カレンダーの情報取得
    for(let i = 7 * (index - 1); i < 7 * index; i++){

        //カレンダー横のボタン表示の切り替え
        if(index > 1){
            document.getElementById('calendarArrowLeft').style.display = 'block';
            document.getElementById('calendarArrowBlockLeft').style.display = 'none';
            document.getElementById('calendarArrowLeftForPhone').style.display = 'block';
            if(Object.values(empty_list).length > 7 * (index - 1)){
                document.getElementById('calendarArrowRight').style.display = 'block';
                document.getElementById('calendarArrowBlockRight').style.display = 'none';
                document.getElementById('calendarArrowRightForPhone').style.display = 'block';
            }else{
                document.getElementById('calendarArrowRight').style.display = 'none';
                document.getElementById('calendarArrowBlockRight').style.display = 'block';
                document.getElementById('calendarArrowRightForPhone').style.display = 'none';
            };
        }else{
            document.getElementById('calendarArrowLeft').style.display = 'none';
            document.getElementById('calendarArrowBlockLeft').style.display = 'block';
            document.getElementById('calendarArrowLeftForPhone').style.display = 'none';
            if(Object.values(empty_list).length > 7 * (index - 1)){
                document.getElementById('calendarArrowRight').style.display = 'block';
                document.getElementById('calendarArrowBlockRight').style.display = 'none';
                document.getElementById('calendarArrowRightForPhone').style.display = 'block';
            }else{
                document.getElementById('calendarArrowRight').style.display = 'none';
                document.getElementById('calendarArrowBlockRight').style.display = 'block';
                document.getElementById('calendarArrowRightForPhone').style.display = 'none';
            };
        };

        //予定が存在している時のみ処理を実行
        if(empty_list[i]){

            let yearDate = Object.keys(empty_list[i]);
            let dateForDay = new Date(yearDate[0].replace(/-/g,"/"));
            var dayOfWeek = dateForDay.getDay();
            var day = [ "日", "月", "火", "水", "木", "金", "土" ][dayOfWeek];
            let raw_date = yearDate[0].substring(5);
            let year = yearDate[0].replace(raw_date,'');

            date = raw_date.replace('-','/');

            let dateObject = Object.values(empty_list[i]);

            let calendarHTML = `<dl>
                                    <dt class="scrollElement">${date}<span>(${day})</span></dt>
                                    <dt class="fixedElement">${date}<span>(${day})</span></dt></dt>`;

            let timeObject = Object.values(dateObject)[0];
            let timeArray = Object.keys(timeObject);
            let filledArray = Object.values(timeObject);

            const memo = sessionStorage.getItem('memo');

            //新卒採用の場合のみ例外処理
            //今日が日曜日の場合に月曜日の13時までをブロック
            if(memo === '新卒採用' && index === 1 && i === 1 && day === '月'){

                for(let n = 0; n < timeArray.length; n++){

                    let time = filledArray[n].time;
                    let filled = filledArray[n].empty;

                    //13時以前は全て埋める
                    if(time <= '13:00'){
                        calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                    }else{
                        //予定が空いているかどうか判定
                        if(filled == '0'){
                            calendarHTML += `<dd class="days_slot"><a href="#target" id="${year}${raw_date} ${time}" class="selectable_time">${time}</a></dd>`;
                        }else{
                            calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                        };
                    }    
                };
                
            }else{
                for(let n = 0; n < timeArray.length; n++){
    
                    let time = filledArray[n].time;
                    let filled = filledArray[n].empty;
        
                    //予定が空いているかどうか判定
                    if(filled == '0'){
                        calendarHTML += `<dd class="days_slot"><a href="#target" id="${year}${raw_date} ${time}" class="selectable_time">${time}</a></dd>`;
                    }else{
                        calendarHTML += `<dd class=""><del>${time}</del></dd>`;
                    };
                };
            }

            calendarHTML += `</dl>`;

            document.getElementById('calendarTimeTable').insertAdjacentHTML('beforeend',calendarHTML);
        };
    };

    //日時を選択した際に、入力フォームまで移動させる処理
    const daysSlotList = document.querySelectorAll('.selectable_time');

    for(let i=0; i < daysSlotList.length; i++ ){
        daysSlotList[i].addEventListener('click',function(){
            let appointmentDate = this.id;
            appointmentDate = appointmentDate.replace('-','年').replace('-','月').replace(' ','日 ') + '～'
            document.getElementById('formDate').innerHTML = appointmentDate;
            document.getElementById('formDate').setAttribute('name', this.id);
            document.getElementById('errorMessage').innerHTML = '';
        });
    };

    document.getElementById('calendarArrowLeft').setAttribute('name',String(index));
    document.getElementById('calendarArrowLeftForPhone').setAttribute('name',String(index));
    document.getElementById('calendarArrowRight').setAttribute('name',String(index));
    document.getElementById('calendarArrowRightForPhone').setAttribute('name',String(index));
};

//年齢の選択肢作成
function generateAgeSelect(){
    const ageSelect = `
        <option></option>    
        <option value="18歳">18歳</option>
        <option value="19歳">19歳</option>
        <option value="20歳">20歳</option>
        <option value="21歳">21歳</option>
        <option value="22歳">22歳</option>
        <option value="23歳">23歳</option>
        <option value="24歳">24歳</option>
        <option value="25歳">25歳</option>
        <option value="26歳">26歳</option>
        <option value="27歳">27歳</option>
        <option value="28歳">28歳</option>
        <option value="29歳">29歳</option>
        <option value="30歳">30歳</option>
        <option value="31歳">31歳</option>
        <option value="32歳">32歳</option>
        <option value="33歳">33歳</option>
        <option value="34歳">34歳</option>
        <option value="35歳">35歳</option>
        <option value="36歳">36歳</option>
        <option value="37歳">37歳</option>
        <option value="38歳">38歳</option>
        <option value="39歳">39歳</option>
        <option value="40歳">40歳</option>
        <option value="41歳">41歳</option>
        <option value="42歳">42歳</option>
        <option value="43歳">43歳</option>
        <option value="44歳">44歳</option>
        <option value="45歳">45歳</option>
        <option value="46歳">46歳</option>
        <option value="47歳">47歳</option>
        <option value="48歳">48歳</option>
        <option value="49歳">49歳</option>
        <option value="50歳以上">50歳以上</option>
    `;

    document.getElementById('formAge').insertAdjacentHTML('beforeend',ageSelect);
};

//住所の選択肢作成
function generateAddressSelect(){
    const addressSelect = `
        <option></option>
        <option value="東京都">東京都</option>
        <option value="大阪府">大阪府</option>
        <option value="愛知県">愛知県</option>
        <option value="福岡県">福岡県</option>
        <option value="神奈川県">神奈川県</option>
        <option value="千葉県">千葉県</option>
        <option value="埼玉県">埼玉県</option>
        <option value="兵庫県">兵庫県</option>
        <option value="静岡県">静岡県</option>
        <option value="広島県">広島県</option>
        <option value="岡山県">岡山県</option>
        <option value="京都府">京都府</option>
        <option value="北海道">北海道</option>
        <option value="青森県">青森県</option>
        <option value="岩手県">岩手県</option>
        <option value="宮城県">宮城県</option>
        <option value="秋田県">秋田県</option>
        <option value="山形県">山形県</option>
        <option value="福島県">福島県</option>
        <option value="茨城県">茨城県</option>
        <option value="栃木県">栃木県</option>
        <option value="群馬県">群馬県</option>
        <option value="新潟県">新潟県</option>
        <option value="富山県">富山県</option>
        <option value="石川県">石川県</option>
        <option value="福井県">福井県</option>
        <option value="山梨県">山梨県</option>
        <option value="長野県">長野県</option>
        <option value="岐阜県">岐阜県</option>
        <option value="三重県">三重県</option>
        <option value="滋賀県">滋賀県</option>
        <option value="奈良県">奈良県</option>
        <option value="和歌山県">和歌山県</option>
        <option value="鳥取県">鳥取県</option>
        <option value="島根県">島根県</option>
        <option value="山口県">山口県</option>
        <option value="徳島県">徳島県</option>
        <option value="香川県">香川県</option>
        <option value="愛媛県">愛媛県</option>
        <option value="高知県">高知県</option>
        <option value="佐賀県">佐賀県</option>
        <option value="長崎県">長崎県</option>
        <option value="熊本県">熊本県</option>
        <option value="大分県">大分県</option>
        <option value="宮崎県">宮崎県</option>
        <option value="鹿児島県">鹿児島県</option>
        <option value="沖縄県">沖縄県</option>
        <option value="海外">海外</option>
    `;

    document.getElementById('formAddress').insertAdjacentHTML('beforeend',addressSelect);
};

//テストデータ保存
function dataSets(){
    const data = [
        {"8/31":{
            "9:00":"1",
            "10:00":"1",
            "11:00":"1",
            "12:00":"1",
            "13:00":"1",
            "14:00":"1",
            "15:00":"1",
            "16:00":"1",
            "17:00":"1",
            "18:00":"1",
            "19:00":"1",
            "20:00":"1",
            "21:00":"1"}},
        {"9/1":{
            "9:00":"1",
            "10:00":"1",
            "11:00":"1",
            "12:00":"1",
            "13:00":"1",
            "14:00":"1",
            "15:00":"1",
            "16:00":"1",
            "17:00":"1",
            "18:00":"1",
            "19:00":"1",
            "20:00":"1",
            "21:00":"1"}},
        {"9/2":{
            "9:00":"0",
            "10:00":"0",
            "11:00":"0",
            "12:00":"0",
            "13:00":"0",
            "14:00":"0",
            "15:00":"0",
            "16:00":"0",
            "17:00":"0",
            "18:00":"0",
            "19:00":"0",
            "20:00":"0",
            "21:00":"0"}},
        {"9/3":
            {"9:00":"0",
            "10:00":"0",
            "11:00":"0",
            "12:00":"0",
            "13:00":"0",
            "14:00":"0",
            "15:00":"0",
            "16:00":"0",
            "17:00":"0",
            "18:00":"0",
            "19:00":"0",
            "20:00":"0",
            "21:00":"0"}},
        {"9/4":{
            "9:00":"0",
            "10:00":"0",
            "11:00":"0",
            "12:00":"0",
            "13:00":"0",
            "14:00":"0",
            "15:00":"0",
            "16:00":"0",
            "17:00":"0",
            "18:00":"0",
            "19:00":"0",
            "20:00":"0",
            "21:00":"0"}},
        {"9/5":{
            "9:00":"0",
            "10:00":"0",
            "11:00":"0",
            "12:00":"0",
            "13:00":"0",
            "14:00":"0",
            "15:00":"0",
            "16:00":"0",
            "17:00":"0",
            "18:00":"0",
            "19:00":"0",
            "20:00":"0",
            "21:00":"0"}},
        {"9/6":{
            "9:00":"0",
            "10:00":"0",
            "11:00":"0",
            "12:00":"0",
            "13:00":"0",
            "14:00":"0",
            "15:00":"0",
            "16:00":"0",
            "17:00":"0",
            "18:00":"0",
            "19:00":"0",
            "20:00":"0",
            "21:00":"0"
        }}
    ]
};
