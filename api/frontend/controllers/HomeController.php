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
        $slides = RuntimeVariables::getJson('home_slides', true);
        usort($slides, function($a, $b)
        {
            if ($a['sort'] == $b['sort']) {
                return 0;
            }
            return ($a['sort'] < $b['sort']) ? -1 : 1;
        });
        return $slides;
    }

}
