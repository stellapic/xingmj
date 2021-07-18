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
        $this->view->params['title'] = $this->title;
        return parent::render($template, $data);
    }

    public function jsonSuccess($data=[])
    {
        return $this->asJson([
            'code' => 200,
            'message' => 'success',
            'data' => $data,
        ]);
    }

    public function jsonFailure($message='', $data=[])
    {
        return $this->asJson([
            'code' => 500,
            'message' => $message,
            'data' => $data,
        ]);
    }

    public function flashSuccess($message)
    {
        \Yii::$app->session->addFlash('success', $message);
    }
























}
