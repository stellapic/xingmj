<?php

use kartik\grid\SerialColumn;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\dynagrid\DynaGrid;

use common\models\Photo;
use common\models\User;

?>

<?php \backend\assets\AppAsset::register($this); ?>

<!-- grid
<div class="card card-default">
    <div class="card-body">
    <div class="row">
        <div class="col-12"> -->
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
        'name'           => 'id',
        'contentOptions' => ['style' => 'min-width:40px;'],
        'headerOptions'  => ['style' => 'min-width:40px;'],

    ],

    [
        'attribute' => 'id',
        'enableSorting' => false,
    ],
    [
        'header' => '图片标题',
        'attribute' => 'photo_id',
        'value'  => function ($model) {
            return Photo::find()->select('title')->where(['id' => $model->photo_id])->scalar();
        },
    ],
    [
        'contentOptions' => ['style' => 'min-width:200px;'],
        'headerOptions'  => ['style' => 'min-width:200px;'],
        'attribute' => 'content',
        'enableSorting' => false,
    ],
    [
        'attribute' => 'user_id',
        'enableSorting' => false,
        'value'  => function ($model) {
            return User::find()->limit(1)->select('username')->where(['id' => $model->user_id])->scalar();
        },
    ],
    [
        'attribute' => 'created_at',
        'enableSorting' => false,
    ],
];

DynaGrid::begin([
    'options'            => ['id' => 'dynagrid-photos-comment'],
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
       <!--  </div>
    </div>
    </div>
</div> -->







