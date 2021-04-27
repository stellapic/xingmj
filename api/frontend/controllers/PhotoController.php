<?php
namespace frontend\controllers;


class PhotoController extends BaseController
{
    public $modelClass = 'common\models\User';

    public function init()
    {
        echo 'init';exit;
    }

    public function actionTest()
    {
        echo 'test';
        exit;
    }
}
