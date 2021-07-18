<?php

use kartik\grid\SerialColumn;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\dynagrid\DynaGrid;

?>

<style type="text/css">
    .table td, .table th {
        vertical-align: middle;
    }
    .table-bordered td, .table-bordered th {
        border: 1px solid #dee2e6;
    }
</style>

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
        'attribute' => 'username',
        'enableSorting' => false,
        // 'value'               => function($model) {
        //     return $model->category_name ?? '';
        // },
    ],
    [
        'attribute' => 'email',
        'enableSorting' => false,
    ],
    [
        'attribute' => 'avatar',
        'enableSorting' => false,
        'format' => 'raw',
        'value' => function($model) {
            return '<img src="' . $model->getAvatarUrl() . '" style="width:60px;border-radius: 30px;" />';
        },
    ],
    [
        'attribute' => 'created_at',
        'enableSorting' => false,
        'value' => function($model) {
            return date('Y-m-d H:i:s', $model->created_at);
        },
    ],
    [
        'attribute' => 'status',
        'enableSorting' => false,
        'value' => function($model) {
            return \common\enums\UserEnum::statusMap()[$model->status] ?? '';
        },
    ],
];

DynaGrid::begin([
    'options'            => ['id' => 'dynagrid-managers'],
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







