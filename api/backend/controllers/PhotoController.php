<?php
namespace backend\controllers;

use Yii;
use yii\web\Controller;
use yii\filters\VerbFilter;
use yii\filters\AccessControl;
use common\models\LoginForm;
use common\models\Photo;
use backend\models\search\PhotoSearch;

/**
 * Photo controller
 */
class PhotoController extends BaseController
{

    public $title = '图片管理';

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
        $searchModel = new PhotoSearch();
        // $groupOrders = $searchModel->groupByOrderNo();
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
        $model = Photo::findOne(['id' => $id]);
        if (!$model) {
            throw new NotFoundHttpException('photo id does not exist.');
        }
        // update some fields
        // ..
        $model->id = $id;
        $model->save();

        $out = Json::encode(['output'=>'new value text', 'message'=>'']);

        return $out;
    }

}
