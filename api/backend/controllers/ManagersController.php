<?php
namespace backend\controllers;

use Yii;
use backend\models\search\ManagerSearch;

class ManagersController extends BaseController
{

    public $title = '管理员管理';

    /**
     * Lists all photo models.
     * @return mixed
     */
    public function actionIndex()
    {

        $queryParams = Yii::$app->request->queryParams;
        // echo "<pre>";
        // print_r($queryParams);exit;
        $searchModel = new ManagerSearch();
        $dataProvider = $searchModel->search($queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'queryParams'  => $queryParams,
        ]);
    }

}
