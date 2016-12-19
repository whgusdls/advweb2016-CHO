function reg_check(){
  var p_name = prreg.p_name.value;
  var goal_date = prreg.goal_date.value;
  var goal_fund = prreg.goal_fund.value;
  var p_intro = prreg.p_intro.value;
  var p_content = prreg.p_content.value;

  // 입력여부 검사
    if(p_name== "")
    {
     alert('제목을 입력해주세요.')
     $('#p_name').focus()
     return false;
    }
    if(goal_date== "")
    {
     alert('목표일을 입력해주세요.')
     $('#goal_date').focus()
     return false;
    }
    if (goal_fund == "") {
        alert('목표금액을 입력해주세요.');
        $('#goal_fund').focus()
        return false;
    }
    if (p_intro == "") {
        alert('소개글을 입력해주세요.');
        $('#p_intro').focus()
        return false;
    }
    if (p_content == "") {
        alert('내용을 입력해주세요.');
        $('#p_content').focus()
        return false;
    }
    else return true;
}
