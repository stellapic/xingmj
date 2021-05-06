<?php
namespace frontend\controllers;

use Yii;
use Firebase\JWT\JWT;

class UserController extends BaseController
{

    public function actionInfo()
    {
        try {
            $headers = Yii::$app->request->headers;
            $token = $headers->get('era_tkn');
            if ($token) {
                $valid_data = JWT::decode($token, Yii::$app->params['JWTKey'], array('HS512'));
                $valid_data = $valid_data->data;
            }
            return $valid_data ?? [];
        } catch (\Exception $e) {
            throw new \yii\base\UserException('invalid token.');
        }
    }
}
