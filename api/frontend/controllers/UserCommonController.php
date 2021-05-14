<?php
namespace frontend\controllers;

use Yii;
use Firebase\JWT\JWT;

class UserCommonController extends BaseJwtController
{

    public function actionInfo($username='')
    {
        if ($username) {
            return $this->getRequestedUser($username);
        }
        return Yii::$app->user->identity;
    }

    public function actionProfile($username='')
    {
        if ($username) {
            $user = $this->getRequestedUser($username);
        } else {
            $user = Yii::$app->user->identity;
        }

        $attrs = [
            'avatar' => Yii::$app->request->post('avatar'),
            'intro' => Yii::$app->request->post('intro'),
        ];
        $u = new \frontend\models\User;
        $u->updateAttributes($attrs);
        $user->save();
    }
}
