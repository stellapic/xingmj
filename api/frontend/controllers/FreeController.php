<?php

namespace frontend\controllers;

use common\helpers\CaptchaHelper;

/**
 * 验证码
 */
class FreeController extends BaseController
{
    public function actionCaptcha()
    {
        \Yii::$app->response->off('beforeSend');
        \Yii::$app->response->format = \Yii::$app->response::FORMAT_RAW;
        CaptchaHelper::draw();
    }

}
