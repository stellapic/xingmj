<?php

namespace frontend\controllers;

use Firebase\JWT\JWT;
use Yii;

class BaseJwtController extends BaseController
{

    public $noAuthActions = []; // 不需要登录验证的方法放这里

    public function init()
    {
        parent::init();
    }

    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }
        if (in_array(Yii::$app->controller->action->id, $this->noAuthActions)) {
            return true;
        }
        $this->checkJwt();
        return true;
    }

    protected function checkJwt()
    {
        try {
            $headers = Yii::$app->request->headers;
            $token = $headers->get('era_tkn') ?? $headers->get('Era-Tkn');
            if (!$token) {
                throw new \yii\base\UserException('invalid token.');
            }
            $valid_data = JWT::decode($token, Yii::$app->params['JWTKey'], array('HS512'));
            $valid_data = $valid_data->data;
            $frontUser = \frontend\models\User::findOne($valid_data->id);
            // TODO: 应当做jwt的crc32验证，与model的{jwt_value}进行比较。
            Yii::$app->user->switchIdentity($frontUser);
            return $valid_data;
        } catch (\Exception $e) {
            throw new \yii\base\UserException('invalid token.', 403);
        }
    }

}
