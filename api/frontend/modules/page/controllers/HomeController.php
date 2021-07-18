<?php
namespace frontend\modules\page\controllers;

use frontend\models\Photo;
use common\models\RuntimeVariables;

class HomeController extends BasePageController
{
    public function actionIndex()
    {
        return [
            'slides' => RuntimeVariables::getJson('home_slides', true),
            'photos' => Photo::getRecommendList(),
        ];
    }
}
