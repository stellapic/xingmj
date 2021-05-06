<?php

namespace frontend\controllers;

use Firebase\JWT\JWT;
use Yii;

class BaseJwtController extends BaseController
{
    public function init()
    {
        parent::init();
        $this->checkJwt();
    }

    protected function checkJwt()
    {
        try {
            $headers = Yii::$app->request->headers;
            $token = $headers->get('era_tkn');
            if (!$token) {
                throw new \yii\base\UserException('invalid token.');
            }
            $valid_data = JWT::decode($token, Yii::$app->params['JWTKey'], array('HS512'));
            $valid_data = $valid_data->data;
            $frontUser = new \frontend\models\User($valid_data);
            Yii::$app->user->switchIdentity($frontUser);
            return $valid_data;
        } catch (\Exception $e) {
            throw new \yii\base\UserException('invalid token.', 403);
        }
    }

}
