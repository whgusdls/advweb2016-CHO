window.onload = function () {
       // 이벤트를 연결합니다.
       document.getElementById('forcomment').onsubmit = function () {
           // 변수를 선언합니다.
           var cmttarea =document.getElementById('cmttarea').value;
           // 코멘트 체크
           if (cmttarea.length < 10) {
               alert('10글자 이상 적으세요.');
               return false;
           };


       };
     };
