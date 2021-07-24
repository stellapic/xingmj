<?php
namespace frontend\modules\page\controllers;

use frontend\models\search\PhotoSearch;
use common\models\PhotoCategory;
use Yii;

class PhotosController extends BasePageController
{

    public function actionIndex()
    {
        $queryParams = Yii::$app->request->queryParams;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);
        return [
            'category' => PhotoCategory::find()->select('category_name, category_title')->asArray()->all(),
            'list' => $this->pageQuery($dataProvider->query),
        ];
    }

}
