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
        'user' => [
            'class' => 'frontend\modules\user\Module',
        ],
        'page' => [
            'class' => 'frontend\modules\page\Module',
        ],
    ],
    'components' => [
        'request' => [
            'csrfParam' => '_csrf-frontend',
            'enableCsrfValidation' => false,
            'enableCsrfCookie' => false,
            'enableCookieValidation' => false,
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ],
        ],
        'response' => [
            'format' => \yii\web\Response::FORMAT_JSON,
            'charset' => 'UTF-8',
            'formatters' => [
                \yii\web\Response::FORMAT_JSON => [
                    'class' => 'yii\web\JsonResponseFormatter',
                    'prettyPrint' => YII_DEBUG, // use "pretty" output in debug mode
                    'encodeOptions' => JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE,
                    // ...
                ],
            ],
            'on beforeSend' => function ($event) {
                if (\Yii::$app->request->isOptions) {
                    \Yii::$app->response->content = '';
                    return;
                }
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
            'identityClass' => 'frontend\models\User',
            'enableSession' => false,
            'loginUrl' => null,
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
            'class' => 'yii\web\UrlManager',
            'enablePrettyUrl' => true,
            // 'enableStrictParsing' => true,
            'showScriptName' => false,
            'rules' => [
                // general api
                '/uploads/photo' => '/uploads/photo',
                // common user api
                '/user/login' => '/user-common/login',
                '/user/signup' => '/user-common/signup',
                '/user/info/<username:(.)+>' => '/user-common/info',
                '/user/info' => '/user-common/info',
                '/user/profile/<username:(.)+>' => '/user-common/profile',
                '/user/profile' => '/user-common/profile',
                // photos
                '/photos/new' => '/photo/new',
                '/photos/mine' => '/photo/mine',
                '/photos/show/<shortid:(.)+>/comments' => '/photo/comments',
                '/photos/show/<shortid:(.)+>' => '/photo/show',
                '/photos/u/<username:(.)+>' => '/photo/user-works',
                '/photos' => '/photo/list',
                // pages
                '/page/photo-detail/<shortid:(.)+>' => '/page/photo-detail'
                // [
                //     'class' => 'yii\rest\UrlRule',
                //     'controller' => ['user', 'photo', 'news'],
                // ],
            ],
        ],
    ],
    'params' => $params,
];
