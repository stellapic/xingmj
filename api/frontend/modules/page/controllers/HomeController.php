<?php
namespace frontend\modules\page\controllers;

use frontend\models\Photo;
use common\models\RuntimeVariables;

class HomeController extends BasePageController
{
    public function actionIndex()
    {
        return [
            'slides' => RuntimeVariables::getHomeSlides(),
            'photos' => Photo::getRecommendList(),
        ];
    }
}
