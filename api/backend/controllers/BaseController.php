<?php
namespace backend\controllers;

use Yii;
use yii\web\Controller;

/**
 * Base controller
 */
class BaseController extends Controller
{
    public function init()
    {
        parent::init();

        // 验证是否登录且验证是否超级管理员
        if (Yii::$app->user->isGuest || !Yii::$app->user->isManager) {
            return $this->redirect('/site/login');
        }

    }
}
