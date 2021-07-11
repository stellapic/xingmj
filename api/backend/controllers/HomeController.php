<?php
namespace backend\controllers;

use Yii;
use common\models\RuntimeVariables;

class HomeController extends BaseController
{

    public $title = '首页轮播图管理';

    /**
     * Lists all photo models.
     * @return mixed
     */
    public function actionSlides()
    {

        $slides = RuntimeVariables::getJson('home_slides', true);

        return $this->render($this->action->id, [
            'slides'  => $slides,
        ]);
    }

}
