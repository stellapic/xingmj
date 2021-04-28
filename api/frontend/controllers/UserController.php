<?php
namespace frontend\controllers;

use Yii;
use Firebase\JWT\JWT;

class UserController extends BaseController
{
    public $modelClass = 'common\models\User';

    public function actionInfo()
    {
        $headers = Yii::$app->request->headers;
        $token = $headers->get('era_tkn');
        if($token)
        {
            $valid_data = JWT::decode($token, Yii::$app->params['JWTKey'], array('HS512'));
            $valid_data = $valid_data->data;
        }
        return $valid_data;
    }
}
