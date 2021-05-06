<?php
$params = array_merge(
    require __DIR__ . '/../../common/config/params.php',
    require __DIR__ . '/../../common/config/params-local.php',
    require __DIR__ . '/params.php',
    require __DIR__ . '/params-local.php'
);

return [
    'id' => 'app-frontend',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'controllerNamespace' => 'frontend\controllers',
    'timezone' => 'Asia/Shanghai',
    'modules' => [
        // 'user' => [
        //     'class' => 'frontend\modules\user\Module',
        // ],
    ],
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-frontend',
            'enableCsrfValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'response' => [
            'format' => \yii\web\Response::FORMAT_JSON,
            'formatters' => [
                \yii\web\Response::FORMAT_JSON => [
                    'class' => 'yii\web\JsonResponseFormatter',
                    'prettyPrint' => YII_DEBUG, // use "pretty" output in debug mode
                    'encodeOptions' => JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
                    // ...
                ],
            ],
            'on beforeSend' => function ($event) {
                /* @var $response Response */
                $response = $event->sender;
                $response->data = [
                    'code' => $response->statusCode,
                    'message' => $response->statusText,
                    'data' => $response->data,
                ];
                $response->statusCode = 200; // always return 200
                $response->format = \yii\web\Response::FORMAT_JSON;
            },
        ],
        'user' => [
            'identityClass' => 'common\models\User',
            'enableAutoLogin' => true,
            'identityCookie' => ['name' => '_identity-frontend', 'httpOnly' => true],
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'errorHandler' => [
            'class' => 'common\components\RestErrorHandler',
        ],
        'urlManager' => [
            'enablePrettyUrl' => true,
            'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                '/user/login' => '/site/login',
                '/user/signup' => '/site/signup',
                '/user/info' => '/user/info',
                '/uploads/photo' => '/uploads/photo',
                [
                    'class' => 'yii\rest\UrlRule',
                    'controller' => ['user', 'photo', 'news'],
                ],
            ],
        ],
    ],
    'params' => $params,
];
