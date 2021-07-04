<?php

use kartik\grid\SerialColumn;
use yii\helpers\Html;
use kartik\grid\GridView;
use kartik\dynagrid\DynaGrid;



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
        // 'header' => Yii::t('app/order', 'order_edit_goods_image'),
        'order' => DynaGrid::ORDER_FIX_LEFT,
        'mergeHeader' => true,
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
        'mergeHeader' => true,
        'attribute' => 'title',
    ],

    [
        // 'header'              => Yii::t('app/product', 'brand_name'),
        'attribute'           => 'category',
        'filterType'          => GridView::FILTER_SELECT2,
        'filter'              => $groupCategory,
        'filterWidgetOptions' => ['pluginOptions' => ['allowClear' => true], 'hideSearch' => false],
        'filterInputOptions'  => ['placeholder' => Yii::t('app', 'please_select')],
        'value'               => function($model) {
            return \common\models\PhotoCategory::find()->select('category_title')->limit(1)->where(['category_name' => $model->category])->scalar();
        }

    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'take_date',
        'mergeHeader' => true,
    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'take_place',
        'mergeHeader' => true,
    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'tags',
        'mergeHeader' => true,
    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'graph_resolve',
        'mergeHeader' => true,
    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'graph_position',
        'mergeHeader' => true,
    ],
    [
        // 'header' => Yii::t('app/order', 'num_in_packing'),
        'attribute' => 'thumbs_count',
        'mergeHeader' => true,
    ],

    [
        'headerOptions' => ['style' => 'min-width:120px'],
        'mergeHeader' => true,
        'attribute'    => 'creator',
        'value'               => function($model) {
            return \common\models\User::find()->limit(1)->select('username')->where(['id' => $model->creator])->scalar();
        }
    ],
];

DynaGrid::begin([
    'options'            => ['id' => 'dynagrid-photos'],
    'columns'            => $gridColumns,
    'theme'              => 'panel-info',
    'showPersonalize' => true,
    // 'storage' => 'db',
    'allowThemeSetting'  => false,
    'allowFilterSetting' => false,
    'allowSortSetting'   => false,
    'gridOptions'        => [
        'dataProvider'            => $dataProvider,
        'filterModel'             => $searchModel,
        'containerOptions'        => [
            'style' => "height:450px;"
        ],
        'perfectScrollbar'        => true,
        'perfectScrollbarOptions' => [
            'wheelPropagation' => true,
        ],
        'floatHeader'             => true,
        'responsiveWrap'          => false,
        'pager'                   => [
            'maxButtonCount' => 5,
            'firstPageLabel' => Yii::t('app', 'first_page'),
            'lastPageLabel'  => Yii::t('app', 'last_page'),
        ],
        'panelHeadingTemplate'    => '{heading}',
        'panelFooterTemplate'     => '<div class="clearfix"><div class="pull-left">{summary}</div><div class="pull-right">{pager}</div></div>',
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

