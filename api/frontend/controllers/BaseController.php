<?php

namespace frontend\controllers;

class BaseController extends \yii\rest\ActiveController
{
    // public function behaviors()
    // {
    //     $behaviors = parent::behaviors();

    //     // remove authentication filter
    //     $auth = $behaviors['authenticator'];
    //     unset($behaviors['authenticator']);

    //     // add CORS filter
    //     $behaviors['corsFilter'] = [
    //         'class' => \yii\filters\Cors::class,
    //     ];

    //     // re-add authentication filter
    //     $behaviors['authenticator'] = $auth;
    //     // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
    //     $behaviors['authenticator']['except'] = ['options'];

    //     return $behaviors;
    // }

    public function init()
    {
        parent::init();
        if ($this->modelClass === null) {
            throw new \yii\base\InvalidConfigException('The "modelClass" property must be set.');
        }
    }

}
