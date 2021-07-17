function loading_show(){
    $('.load_box').remove();
    var loading_html='<div class="load_box"><span><img src="/static/imgs/loading.gif"></span></div>';
    $('body').append(loading_html);
}

function loading_hide(){
    $('.load_box').remove()
}

function tipShow(title, body, type, cfg){
    var tipTitle = '操作成功', tipBody = '', tipType = 'success';
    if (title) {
        tipTitle = title;
    }
    if (body) {
        tipBody = body;
    }
    if (type) {
        tipType = type;
    }
    var options = {
        class: 'bg-' + tipType,
        title: tipTitle,
        subtitle: '',
        autohide: true,
        delay: 2000,
        body: tipBody
    };
    if (cfg) {
        options = $.extend({}, options, cfg);
    }
    $(document).Toasts('create', options)
}

function tipSuccess(title, body, type){
    tipShow(title, body, 'success');
}

function tipWarning(title, body, type){
    tipShow(title, body, 'warning', {
        delay: 3000
    });
}

function tipError(title, body, type){
    tipShow(title, body, 'danger', {
        delay: 5000
    });
}

function asyncProcess(url, data, cb) {
    loading_show();
    $.ajax({
        url: url,
        data: data,
        cache: false,
        contentType: false,
        processData: false,
        method: 'POST',
        dataType: 'json',
        type: 'POST', // For jQuery < 1.9
        success: function(json){
            loading_hide();
            if (json.code == '200') {
                if (typeof cb == 'function') {
                    cb(json.data);
                }
            } else if (json.message) {
                tipError('异常提示', json.message);
            }
        }
    });
}











