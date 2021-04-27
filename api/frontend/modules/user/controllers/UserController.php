<?php
namespace frontend\modules\user\controllers;

use frontend\controllers\BaseRestActiveController;

class UserController extends BaseRestActiveController
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
