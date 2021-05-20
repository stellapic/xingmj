<?php

namespace frontend\controllers;

use common\filters\CorsCommon;
use Yii;

class BaseController extends \yii\rest\Controller
{
    public $enableCsrfValidation = false;

    public $modelClass = 'frontend\models\User'; // 

    public function behaviors()
    {
        $behaviors = parent::behaviors();

        // remove authentication filter
        $auth = $behaviors['authenticator'];
        unset($behaviors['authenticator']);

        // add CORS filter
        $behaviors['corsFilter'] = [
            // 'class' => \yii\filters\Cors::class,
            'class' => CorsCommon::class,
        ];

        // re-add authentication filter
        $behaviors['authenticator'] = $auth;
        // avoid authentication on CORS-pre-flight requests (HTTP OPTIONS method)
        $behaviors['authenticator']['except'] = ['options'];

        return $behaviors;
    }

    public function actions()
    {
        $actions = parent::actions();

        // 禁用 "delete" 和 "create" 动作
        unset($actions['delete'], $actions['create']);
        // 禁用其他动作
        unset($actions['index'], $actions['view'], $actions['update']);

        // 使用 "prepareDataProvider()" 方法自定义数据 provider 
        // $actions['index']['prepareDataProvider'] = [$this, 'prepareDataProvider'];

        return $actions;
    }

    /**
     * @param string $username username
     * @return  \frontend\models\User
     */
    protected function getRequestedUser($username='')
    {
        if (!$username) {
            $username = Yii::$app->request->get('user');
        }
        $frontUser = \frontend\models\User::findOne(['username' => $username]);
        if (!$frontUser) {
            throw new \yii\base\UserException('user not exists.');
        }
    }

}
