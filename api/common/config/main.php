<?php
return [
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'vendorPath' => dirname(dirname(__DIR__)) . '/vendor',
    'bootstrap' => [
        'queue', // 把这个组件注册到控制台
    ],
    'components' => [
        'redis' => [
            'class' => \yii\redis\Connection::class,
            // ...
        ],
        'queue' => [
            'class' => \yii\queue\redis\Queue::class,
            'as log' => \yii\queue\LogBehavior::class,//错误日志 默认为 console/runtime/logs/app.log
            'redis' => 'redis', // 连接组件或它的配置
            'channel' => 'queue', // Queue channel key
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'debris' => [
            'class' => 'common\components\Debris',
        ],
    ],
];
