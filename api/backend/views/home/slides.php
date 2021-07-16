<style type="text/css">
    .container{
        height: 225px;
        margin: 20px;
        /*background: yellow;*/
    }
    .left{
        float: left;
        width: 400px;
        height: 100%;
        /*background: red;*/
    }
    .right{
        margin-left: 420px;
        /*background: green;*/
        height: 100%;
    }
    .container .right input {
        width: 400px;
        display: inline-block;
        margin-bottom: 20px;
    }
    .container .right span.btn {
        width: 400px;
        display: inline-block;
        margin-bottom: 20px;
    }
</style>
<ol id="slides">
    <?php foreach ($slides as $key => $value): ?>
        <li class="container">
            <div class="left">
                <img style="width:400px;" src="<?php echo $value['image'] ?>">
            </div>
            <div class="right">
                <label>跳转链接：
                <input type="text" name="slide[<?=$key?>][redirect_url]" value="<?php echo $value['redirect_url'] ?>">
                </label>
                <label>显示文本：
                <input type="text" name="slide[<?=$key?>][text]" value="<?php echo $value['text'] ?>">
                </label>
                <label>图片排序：
                <input type="text" name="slide[<?=$key?>][sort]" value="<?php echo $value['sort'] ?>">
                </label>
                <input type="file" id="file<?=$key?>" data-target="slide[<?=$key?>][image]" style="display: none;">
                <input type="hidden" name="slide[<?=$key?>][image]" value="<?php echo $value['image'] ?>" style="display: none;">
                <span data-target="file<?=$key?>" class="btn btn-default col fileinput-button dz-clickable">
                    <i class="fas fa-plus"></i>
                    选择图片
                </span>
            </div>
        </li>
    <?php endforeach ?>
</ol>
<div class="row" style="margin-bottom: 10px;padding: 60px 0;">
    <div class="col-sm-3"></div>
    <div class="col-sm-6">
        <span class="btn btn-success col">
            <i class="fas fa-save"></i>
            保存设置
        </span>
    </div>
    <div class="col-sm-3"></div>
</div>
<script type="text/javascript">
    $(function() {
        // jQuery
        $("ol#slides").find('.dz-clickable').click(function() {
            $('#'+$(this).attr('data-target')).trigger('click');
        });
    });
</script>


