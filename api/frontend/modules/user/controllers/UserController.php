<?php
namespace frontend\modules\user\controllers;


class UserController extends \frontend\controllers\BaseController
{
    public $modelClass = 'common\models\User';

    public function init()
    {
        echo 'here';exit;
    }

    public function actionTest()
    {
        echo 'test';
        exit;
    }
}
