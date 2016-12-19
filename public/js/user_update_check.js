function user_update_check(){
  var pw = userupd.inputPassword.value;
  var pwcheck=userupd.inputPasswordCheck.value;
  var addr = userupd.inputAddr.value;
  var phone = userupd.inputNumber.value;

  // 입력여부 검사

    if(pw.length < 8)
    {
     alert('비밀번호를 8문자 이상 입력해주세요.')
     $('#inputPassword').focus()
     return false;
    }else{
      if (pwcheck != pw) {
          alert('입력하신 비밀번호가 일치하지 않습니다.');
          $('#inputPasswordCheck').focus()
          return false;
      }
    }

    if (addr == "") {
        alert('주소를 입력해주세요.');
        $('#inputAddr').focus()
        return false;
    }
    if (phone == "") {
        alert('전화번호를 입력해주세요.');
        $('#inputNumber').focus()
        return false;
    }
    else return true;
}
