<?php

use kartik\grid\SerialColumn;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\dynagrid\DynaGrid;

?>

<div class="card card-default collapsed-card">
          <div class="card-header">
            <h3 class="card-title">搜索图片</h3>

            <div class="card-tools">
              <button type="button" class="btn btn-tool" data-card-widget="collapse">
                <i class="fas fa-minus"></i>
              </button>
              <button type="button" class="btn btn-tool" data-card-widget="remove">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <!-- /.card-header -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <div class="form-group">
                  <label>Minimal</label>
                  <select class="form-control select2 select2-hidden-accessible" style="width: 100%;" data-select2-id="1" tabindex="-1" aria-hidden="true">
                    <option selected="selected" data-select2-id="3">Alabama</option>
                    <option data-select2-id="29">Alaska</option>
                    <option data-select2-id="30">California</option>
                    <option data-select2-id="31">Delaware</option>
                    <option data-select2-id="32">Tennessee</option>
                    <option data-select2-id="33">Texas</option>
                    <option data-select2-id="34">Washington</option>
                  </select><span class="select2 select2-container select2-container--default select2-container--below" dir="ltr" data-select2-id="2" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-rvyp-container"><span class="select2-selection__rendered" id="select2-rvyp-container" role="textbox" aria-readonly="true" title="Alaska">Alaska</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <!-- /.form-group -->
                <div class="form-group">
                  <label>Disabled</label>
                  <select class="form-control select2 select2-hidden-accessible" disabled="" style="width: 100%;" data-select2-id="4" tabindex="-1" aria-hidden="true">
                    <option selected="selected" data-select2-id="6">Alabama</option>
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select><span class="select2 select2-container select2-container--default select2-container--disabled" dir="ltr" data-select2-id="5" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="true" aria-labelledby="select2-rpcc-container"><span class="select2-selection__rendered" id="select2-rpcc-container" role="textbox" aria-readonly="true" title="Alabama">Alabama</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <!-- /.form-group -->
              </div>
              <!-- /.col -->
              <div class="col-md-6">
                <div class="form-group">
                  <label>Multiple</label>
                  <select class="select2 select2-hidden-accessible" multiple="" data-placeholder="Select a State" style="width: 100%;" data-select2-id="7" tabindex="-1" aria-hidden="true">
                    <option>Alabama</option>
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="8" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false"><ul class="select2-selection__rendered"><li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" placeholder="Select a State" style="width: 458px;"></li></ul></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <!-- /.form-group -->
                <div class="form-group">
                  <label>Disabled Result</label>
                  <select class="form-control select2 select2-hidden-accessible" style="width: 100%;" data-select2-id="9" tabindex="-1" aria-hidden="true">
                    <option selected="selected" data-select2-id="11">Alabama</option>
                    <option>Alaska</option>
                    <option disabled="disabled">California (disabled)</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="10" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-1rmz-container"><span class="select2-selection__rendered" id="select2-1rmz-container" role="textbox" aria-readonly="true" title="Alabama">Alabama</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <!-- /.form-group -->
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->

            <h5>Custom Color Variants</h5>
            <div class="row">
              <div class="col-12 col-sm-6">
                <div class="form-group">
                  <label>Minimal (.select2-danger)</label>
                  <select class="form-control select2 select2-danger select2-hidden-accessible" data-dropdown-css-class="select2-danger" style="width: 100%;" data-select2-id="12" tabindex="-1" aria-hidden="true">
                    <option selected="selected" data-select2-id="14">Alabama</option>
                    <option>Alaska</option>
                    <option>California</option>
                    <option>Delaware</option>
                    <option>Tennessee</option>
                    <option>Texas</option>
                    <option>Washington</option>
                  </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="13" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--single" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="0" aria-disabled="false" aria-labelledby="select2-47ub-container"><span class="select2-selection__rendered" id="select2-47ub-container" role="textbox" aria-readonly="true" title="Alabama">Alabama</span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                </div>
                <!-- /.form-group -->
              </div>
              <!-- /.col -->
              <div class="col-12 col-sm-6">
                <div class="form-group">
                  <label>Multiple (.select2-purple)</label>
                  <div class="select2-purple">
                    <select class="select2 select2-hidden-accessible" multiple="" data-placeholder="Select a State" data-dropdown-css-class="select2-purple" style="width: 100%;" data-select2-id="15" tabindex="-1" aria-hidden="true">
                      <option>Alabama</option>
                      <option>Alaska</option>
                      <option>California</option>
                      <option>Delaware</option>
                      <option>Tennessee</option>
                      <option>Texas</option>
                      <option>Washington</option>
                    </select><span class="select2 select2-container select2-container--default" dir="ltr" data-select2-id="16" style="width: 100%;"><span class="selection"><span class="select2-selection select2-selection--multiple" role="combobox" aria-haspopup="true" aria-expanded="false" tabindex="-1" aria-disabled="false"><ul class="select2-selection__rendered"><li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="0" autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false" role="searchbox" aria-autocomplete="list" placeholder="Select a State" style="width: 458px;"></li></ul></span></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>
                  </div>
                </div>
                <!-- /.form-group -->
              </div>
              <!-- /.col -->
            </div>
            <!-- /.row -->
          </div>
          <!-- /.card-body -->
          <div class="card-footer">
            Visit <a href="https://select2.github.io/">Select2 documentation</a> for more examples and information about
            the plugin.
          </div>
        </div>
<?php
$gridColumns = [

    [
        'class'          => SerialColumn::class,
        'order'          => DynaGrid::ORDER_FIX_LEFT,
        'contentOptions' => ['class' => 'serial_number_td'],
        'headerOptions'  => ['class' => 'serial_number_th'],
    ],

    [
        'class'          => 'kartik\grid\CheckboxColumn',
        'order'          => DynaGrid::ORDER_FIX_LEFT,
        'name'           => 'order_goods_id',
        'contentOptions' => ['style' => 'min-width:40px;'],
        'headerOptions'  => ['style' => 'min-width:40px;'],

    ],
    [
        'contentOptions' => ['class' => 'img_column'],
        'order' => DynaGrid::ORDER_FIX_LEFT,
        'enableSorting' => false,
        'attribute' => 'image',
        'format' => 'raw',
        'value'  => function ($model) {
            if ($model->short_id) {
                return '<a target="_blank" href="/photos/show/' . $model->short_id . '">
                <img style="display: block;width:100%;" src="' . \common\helpers\ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $model->image, \common\enums\ThumbnailEnum::TINY) . '" alt="" class="">
                </a>';
            }

            return '';
        },
    ],

    [
        'enableSorting' => false,
        'attribute' => 'title',
    ],

    [
        'attribute'           => 'category',
        'enableSorting' => false,
        'value'               => function($model) use ($allCategory) {
            return $allCategory[$model->category] ?? '';
        }

    ],
    [
        'attribute' => 'take_date',
        'enableSorting' => false,
        'value'               => function($model) {
            return $model->take_date ?? '';
        },
    ],
    [
        'attribute' => 'take_place',
        'enableSorting' => false,
    ],
    [
        'attribute' => 'tags',
        'enableSorting' => false,
    ],
    [
        'attribute' => 'graph_resolve',
        'enableSorting' => false,
        'value'               => function($model) {
            return $model->graph_resolve ?? '';
        },
    ],
    [
        'attribute' => 'graph_position',
        'enableSorting' => false,
         'value'               => function($model) {
            return $model->graph_position ?? '';
        },
    ],

    [
        'headerOptions' => ['style' => 'min-width:120px'],
        'enableSorting' => false,
        'attribute'    => 'creator',
        'value'               => function($model) {
            return \common\models\User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        }
    ],
];

DynaGrid::begin([
    'options'            => ['id' => 'dynagrid-photos'],
    'columns'            => $gridColumns,
    // 'theme'              => 'panel-info',
    'showPersonalize' => true,
    // 'storage' => 'db',
    'allowThemeSetting'  => false,
    'allowFilterSetting' => false,
    'allowSortSetting'   => false,
    'gridOptions'        => [
        'dataProvider'            => $dataProvider,
        // 'filterModel'             => $searchModel,
        'containerOptions'        => [
            // 'style' => "height:450px;"
        ],
        'layout' => "{items}<div class=\"pagination-container\">\n{summary}\n{pager}</div>",
        'tableOptions' => array('class' => ' table table-hover text-nowrap'),
        'perfectScrollbar'        => true,
        'perfectScrollbarOptions' => [
            'wheelPropagation' => true,
        ],
        'floatHeader'             => true,
        'responsiveWrap'          => true,
        'pager'                   => [
            'maxButtonCount' => 8,
            'firstPageLabel' => '首页',
            'lastPageLabel'  => '尾页',
        ],
        'panelHeadingTemplate'    => '{heading}',
        'panelFooterTemplate'     => '<div class="clearfix"></div>',
        'showPageSummary'         => false,
        'pjax'                    => false,
        'pjaxSettings'            => [
            'options' => [
                'linkSelector' => '.a[data-toggle!="tooltip"]',
            ]
        ],
        'panel'                   => false,
        'toolbar'                 => [

        ]

    ]
]);
DynaGrid::end();

?>

<script type="text/javascript">
     $(function () {
    //Initialize Select2 Elements
    $('.select2').select2()

    //Initialize Select2 Elements
    $('.select2bs4').select2({
      theme: 'bootstrap4'
    })
});
</script>











