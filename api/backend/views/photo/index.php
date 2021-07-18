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

    // [
    //     'class'          => 'kartik\grid\CheckboxColumn',
    //     'order'          => DynaGrid::ORDER_FIX_LEFT,
    //     'name'           => 'id',
    //     'contentOptions' => ['style' => 'min-width:40px;'],
    //     'headerOptions'  => ['style' => 'min-width:40px;'],

    // ],
    [
        //操作
        'class' => 'kartik\grid\ActionColumn',
        'order' => DynaGrid::ORDER_FIX_LEFT,
        'header' => '操作',
        'contentOptions' => ['class' => 'operation_td'],
        'headerOptions'  => ['class' => 'operation_th'],
        'template' => '{mark} {preview}',
        'buttons' => [
            // 前台查看
            'preview' => function ($url, $model, $key) {
                return Html::a(
                        '<i class="fa fa-eye"></i>', 
                        $model->getPreviewUrl(), 
                        [
                            'title' => '前台查看',
                            'target' => '_blank',
                            'class' => 'tooltips',
                        ]
                    );
            },
            // 设为精选
            'mark' => function ($url, $model, $key) {
                $options = [
                    'title' => '设为精选',
                    'class' => 'tooltips',
                    'onclick' => 'togglePremium('.$model->id.', this)',
                ];
                if ($model->is_recommend) {
                    $options['title'] = '取消精选';
                    $options['class'] = 'tooltips disabled';
                }
                return Html::a('<i class="fa fa-star"></i>', 'javascript:void(0)', $options);
            },
        ],
    ],
    [
        'contentOptions' => ['class' => 'img_column'],
        'order' => DynaGrid::ORDER_FIX_LEFT,
        'enableSorting' => false,
        'attribute' => 'image',
        'format' => 'raw',
        'value'  => function ($model) {
            if (!$model->image || $model->image == 'null') {
                return '';
            }

            if ($model->short_id) {
                return '<a target="_blank" href="/photos/show/' . $model->short_id . '">
                <img style="display: block;width:120px;" src="' . \common\helpers\ImageHelper::convertToThumbnailPath(\Yii::$app->params['fileServer'] . $model->image, \common\enums\ThumbnailEnum::TINY) . '" alt="" class="">
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
        'format' => 'raw',
        'value'  => function($model) {
            if ($model->annotatedImage) {
                return '<img style="display: block;width:110px;" src="' . $model->annotatedImage . '" alt="" class="">';
            }
            return '';
        },
    ],
    [
        'attribute' => 'graph_position',
        'enableSorting' => false,
        'format' => 'raw',
        'value'  => function($model) {
            if ($model->zoomImage) {
                return '<img style="display: block;width:110px;" src="' . $model->zoomImage . '" alt="" class="">';
            }
            return '';
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

<script type="text/javascript">
    function togglePremium(id, obj) {
        var url = '/photo/toggle-premium?photo_id=' + id;
        asyncProcess(url, {}, function (json) {
            $(obj).toggleClass('disabled');
            if ($(obj).attr('data-original-title') == '取消精选') {
                $(obj).attr('data-original-title', '设为精选');
                tipSuccess('操作成功', '取消精选成功');
            } else {
                $(obj).attr('data-original-title', '取消精选');
                tipSuccess('操作成功', '图片已设为精选');
            }

        });
    }
</script>




