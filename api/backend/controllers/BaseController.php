<?php
namespace backend\controllers;

use Yii;
use yii\web\Controller;

/**
 * Base controller
 */
class BaseController extends Controller
{

    public $title = '';

    public function init()
    {
        parent::init();

        // 验证是否登录且验证是否超级管理员
        if (Yii::$app->user->isGuest || !Yii::$app->user->getIdentity()->isManager) {
            return $this->redirect('/site/login');
        }

    }


    public function render($template, $data=[])
    {
        return parent::render($template, array_merge($data, ['title' => $this->title]));
    }

}
