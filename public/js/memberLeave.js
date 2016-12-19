function button_event(isExist){
  var check =confirm('정말 탈퇴하시겠습니까?')
  if(check){ //확인

  if(!isExist){
      $('#userdelete').submit();
  }else{
    alert('프로젝트가 진행중인 회원은 탈퇴할 수 없습니다.');
    return;
  }
}else{   //취소
    return ;
}};
