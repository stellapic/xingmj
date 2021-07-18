<?php
namespace frontend\controllers;

use common\models\PhotoCategory;
use common\models\PhotoComment;
use frontend\models\Photo;
use frontend\models\search\PhotoSearch;
use Yii;

class PhotoCategoryController extends BaseController
{

    public function actionIndex()
    {
        return PhotoCategory::find()->select('category_name, category_title')->asArray()->all();
    }

}