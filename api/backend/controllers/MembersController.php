<?php
namespace backend\controllers;

use Yii;
use backend\models\search\MemberSearch;

class MembersController extends BaseController
{

    public $title = '网站用户管理';

    /**
     * Lists all photo models.
     * @return mixed
     */
    public function actionIndex()
    {

        $queryParams = Yii::$app->request->queryParams;
        // echo "<pre>";
        // print_r($queryParams);exit;
        $searchModel = new MemberSearch();
        $dataProvider = $searchModel->search($queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'queryParams'  => $queryParams,
        ]);
    }

}
