<?php
namespace frontend\modules\page\controllers;

use frontend\models\search\PhotoSearch;
use common\models\PhotoCategory;
use frontend\models\PhotoDetail;
use Yii;

class PhotoDetailController extends BasePageController
{

    public function actionIndex($shortid)
    {
        if (!$shortid) {
            throw new \yii\base\UserException('parameter required.');
        }
        $photo = PhotoDetail::findOne([
            'short_id' => $shortid,
            'deleted' => 0,
        ]);
        if (!$photo) {
            throw new \yii\web\NotFoundHttpException('photo not found.');
        }
        $commentsQuery = \frontend\serviceProviders\PhotoCommentProvider::list($shortid);
        return [
            'photo' => $photo,
            'comments' => $this->pageQuery($commentsQuery, true),
        ];
    }
}
