<?php

namespace frontend\controllers;

use common\models\RuntimeVariables;
use Yii;

/**
 * 首页部件单独拎出来
 */
class HomeController extends BaseController
{

    public function actionSlides()
    {
        return RuntimeVariables::getHomeSlides();
    }

}
