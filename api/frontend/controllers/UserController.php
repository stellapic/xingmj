<?php
namespace frontend\controllers;

use Yii;
use Firebase\JWT\JWT;

class UserController extends BaseJwtController
{

    public function actionInfo()
    {
        return Yii::$app->user->identity;
    }

    public function actionProfile()
    {
        \frontend\models\User::updateAll([
            'avatar' => Yii::$app->request->post('avatar'),
            'intro' => Yii::$app->request->post('intro'),
        ], [
            'id' => Yii::$app->user->id,
        ]);
    }
}
