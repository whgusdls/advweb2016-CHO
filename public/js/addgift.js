 $(document).ready(function() {
var counter=0;
$('#gftbtn').on('click', function(){
  //counter++;
  $('#here').append(`
    <div class="form-group">
      <label for="inputFund" class="col-sm-3 control-label">후원금액</label>
        <div class="col-sm-6">
          <input id="inputFund" name="price_g" type="number" class="form-control">
        </div>
      </div>
      <div class="form-group">
        <label for="inputGift" class="col-sm-3 control-label">선물</label>
          <div class="col-sm-6">
            <input id="inputGift" name="gift_p" type="text" class="form-control">
          </div>
        </div>
    `);
});
});
