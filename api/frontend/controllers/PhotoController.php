<?php
namespace frontend\controllers;

use common\models\Photo;
use common\models\search\PhotoSearch;
use Yii;

class PhotoController extends BaseJwtController
{
    public $modelClass = 'common\models\Photo';

    public $noAuthActions = ['list'];

    public function actionNew()
    {
        // Photo::findAll()
    }

    public function actionMine()
    {
        
    }

    public function actionList()
    {
        $queryParams = Yii::$app->request->queryParams;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);
        return $dataProvider;
    }
}
