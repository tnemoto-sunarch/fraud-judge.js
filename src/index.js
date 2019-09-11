import $ from 'jquery'

$(function(){
  function fjRequest(data, always){
    // =================================
    // 共通項目設定
    // =================================
    data = data || {};
    data.user_id = 'uid-xxxxx';
    data.request_id = 'rid-xxxxx';
    data.card_info = data.card_info || {};
    // =================================
    // 不正判定ロジック(別ドメイン)の呼出し
    // =================================
    $.ajax({
      url: 'http://localhost:8080/fj/api/v1/sample',
      type: 'POST',
      contentType: 'application/json',
      dataType: "json",
      data: JSON.stringify(data)
    })
    .done(function(data){
      // =================================
      // 成功した場合(仕様次第)
      // =================================
    })
    .fail(function(data){
      // =================================
      // 失敗時した場合(仕様次第)
      // =================================
    })
    .always(function(data){
      always(data);
    });
  };
  window.fraudjudge = fjRequest;
  
  // =================================
  // formの特定
  // ID指定(変更可能)
  // =================================
  var form = $('#fj_frm');
  if(form.length){
    // =================================
    // 項目の特定
    // name指定(変更可能)
    // =================================
    var card_no = form.find('input[name=card_no]');
    var exp_date = form.find('input[name=exp_date]');
    var sec_code = form.find('input[name=sec_code]');
  
    var orgEvents = [];
    //JQueryイベントの検知
    var events = $._data(form.get(0), 'events');
    if(events){
      var originalHandler = events.submit;
      $.each(originalHandler, function(i, obj){
        orgEvents.push(obj.handler);
      });
      $.each(originalHandler, function(i, obj){
        if(obj){
          form.off('submit', obj.handler);
        }
      });
    }
    //通常のHTMLイベントの検知
    var originalEvent = form.get(0).onsubmit;
    if(originalEvent){
      form.get(0).onsubmit = ''
      orgEvents.push(originalEvent);
    }
    //submitイベントの書き換え
    form.one('submit', function(event) {
      var data = {
        'user_id': 'uid-xxxxx',
        'request_id': 'rid-xxxxx',
        'card_info': {
          'card_no': card_no.val(),
          'exp_date': exp_date.val(),
          'sec_code': sec_code.val()
        }
      };
      fjRequest(data, function(data){
        if(data && data.result_code == 0){
            $('<input>"').attr({
              type : 'hidden',
              name : 'fj_token',
              value : data.fj_token
            }).appendTo(form);
            $('<input>"').attr({
              type : 'hidden',
              name : 'fj_level',
              value : data.fj_level
            }).appendTo(form);
        }
       // =================================
        // 成功・失敗に関わらず、イベントを復元し
        // 再度、submitイベントをコール
        // =================================
        if(orgEvents){
          $.each(orgEvents, function(i, handler){
            if(handler){
              form.on('submit', handler);
            }
          });
        }
        form.submit();
      });
      // =================================
      // submitイベントなので、イベントキャンセル
      // =================================
      if(event.preventDefault) {
        event.preventDefault();
      } else {
        // IE対応
        event.returnValue = false;
      }
      return false;
    });
  }
});

  