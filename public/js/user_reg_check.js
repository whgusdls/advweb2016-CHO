function user_reg_check(){
  var userid = userreg.userid.value;
  var pw = userreg.inputPassword.value;
  var pwcheck=userreg.inputPasswordCheck.value;
  var name = userreg.inputName.value;
  var addr = userreg.inputAddr.value;
  var phone = userreg.inputNumber.value;

  // 입력여부 검사
    if(userid== "")
    {
     alert('아이디를 입력해주세요.')
     $('#userid').focus()
     return false;
    }
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
    if (name == "") {
        alert('이름을 입력해주세요.');
        $('#inputName').focus()
        return false;
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
