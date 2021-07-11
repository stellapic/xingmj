<?php
namespace backend\controllers;

use Yii;
use common\models\Photo;
use common\models\PhotoComment;
use backend\models\search\PhotoCommentSearch;

class PhotoCommentController extends BaseController
{

    public $title = '图片评论管理';

    /**
     * Lists all photo models.
     * @return mixed
     */
    public function actionIndex()
    {

        $queryParams = Yii::$app->request->queryParams;
        // echo "<pre>";
        // print_r($queryParams);exit;
        $searchModel = new PhotoCommentSearch();
        $dataProvider = $searchModel->search($queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'queryParams'  => $queryParams,
        ]);
    }

}
