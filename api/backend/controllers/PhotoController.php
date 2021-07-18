<?php
namespace backend\controllers;

use Yii;
use common\models\Photo;
use common\models\PhotoCategory;
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
        if ($queryParams['is_recommend'] == '1') {
            $this->title = '精选图片';
        }
        // echo "<pre>";
        // print_r($queryParams);exit;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);

        // photo category
        $allCategory = PhotoCategory::find()->asArray()->all();
        $allCategory = \yii\helpers\ArrayHelper::map($allCategory, 'category_name', 'category_title');

        return $this->render('index', [
            'searchModel'  => $searchModel,
            'dataProvider' => $dataProvider,
            'queryParams'  => $queryParams,
            'allCategory'  => $allCategory,
        ]);
    }

    public function actionTogglePremium($photo_id)
    {
        $sql = 'update photo set is_recommend=(case is_recommend when 1 then 0 else 1 end) where id=' . (int)$photo_id;
        Photo::getDb()->createCommand($sql)->execute();
        return $this->jsonSuccess();
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
