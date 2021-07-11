<?php

use kartik\grid\SerialColumn;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\dynagrid\DynaGrid;

?>

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
        // 'headerOptions' => ['style' => 'min-width:120px'],
        'enableSorting' => false,
        'attribute'    => 'creator',
        'value'               => function($model) {
            return \common\models\User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        }
    ],
    [
        'headerOptions' => ['style' => 'min-width:120px'],
        'enableSorting' => false,
        'attribute'    => 'create_at',
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
       <!--  </div>
    </div>
    </div>
</div> -->






