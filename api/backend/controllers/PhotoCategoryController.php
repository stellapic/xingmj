<?php
namespace backend\controllers;

use Yii;
use common\models\Photo;
use common\models\PhotoCategory;
use backend\models\search\PhotoCategorySearch;

class PhotoCategoryController extends BaseController
{

    public $title = '类别管理';

    /**
     * Lists all photo models.
     * @return mixed
     */
    public function actionIndex()
    {

        if (Yii::$app->request->post('hasEditable')) {
            return $this->editRow();
        }

        $queryParams = Yii::$app->request->queryParams;
        // echo "<pre>";
        // print_r($queryParams);exit;
        $searchModel = new PhotoCategorySearch();
        $dataProvider = $searchModel->search($queryParams);

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'queryParams'  => $queryParams,
        ]);
    }

    private function editRow()
    {
        $id = Yii::$app->request->post('editableKey');
        $model = PhotoCategory::findOne(['id' => $id]);
        if (!$model) {
            throw new NotFoundHttpException('PhotoCategory does not exist.');
        }
        // update some fields
        // ..
        $model->id = $id;
        $model->save();

        $out = Json::encode(['output'=>'new value text', 'message'=>'']);

        return $out;
    }

}
