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
        if (Yii::$app->request->isPost) {
            $post = Yii::$app->request->post();
            RuntimeVariables::setValue('home_slides', json_encode($post['slide']));
            return $this->jsonSuccess($post['slide']);
        }

        $slides = RuntimeVariables::getJson('home_slides', true);

        return $this->render($this->action->id, [
            'slides'  => $slides,
        ]);
    }

}
