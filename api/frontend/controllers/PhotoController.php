<?php
namespace frontend\controllers;

use common\models\PhotoCategory;
use common\models\PhotoComment;
use frontend\models\Photo;
use frontend\models\search\PhotoSearch;
use Yii;

class PhotoController extends BaseJwtController
{
    public $modelClass = 'frontend\models\Photo';

    public $noAuthActions = [
        'list',
        'show',
        'user-works',
        'comments',
    ];

    public function actionNew()
    {
        $post = Yii::$app->request->post();
        $tags = [];
        foreach ($post['tags'] as $tag) {
            $tags[$tag] = 1;
        }
        // 验证类别是否正确
        if (!PhotoCategory::find()->where(['category_name' => $post['category']])->exists()) {
            throw new \yii\base\UserException('category invalid.');
        }
        $photo = new Photo();
        $photo->setAttributes($post);
        $photo->tags = $tags;
        if (!$photo->save()) {
            throw new \yii\base\UserException(Yii::$app->debris->analyErr($photo->getFirstErrors()));
        }
        // auto resize
        Yii::$app->queue->push(new \common\queues\ThumbnailJob([
            'photo_id' => $photo->id,
            'photo_path' => $photo->image,
        ]));
        // put into solver queue
        $message = [
            'id' => $photo->id,
            'url' => Yii::$app->params['fileServer'] . $photo->image,
        ];
        Yii::$app->redis->lpush(Yii::$app->params['queueName']['solver_pending'], json_encode($message));
        return [
            'shortid' => $photo->short_id,
        ];
    }

    public function actionShow($shortid)
    {
        if (!$shortid) {
            throw new \yii\base\UserException('parameter required.');
        }
        $photo = Photo::findOne(['short_id' => $shortid]);
        if (!$photo) {
            throw new \yii\web\NotFoundHttpException('not found.');
        }
        return $photo;
    }

    public function actionComments($shortid)
    {
        $offset = Yii::$app->request->get('offset');
        $photo = Photo::findOne(['short_id' => $shortid]);
        if (!$photo) {
            throw new \yii\base\UserException('shortid invalid.');
        }
        $query = PhotoComment::find()->alias('c');
        $query->innerJoin('user as u', 'c.user_id=u.id');
        $query->select('c.id as comment_id, c.content, c.created_at, u.username, u.avatar');
        $query->limit($this->pageSize);
        if ($offset > 0) {
            $query->offset($offset);
        }
        return $query->asArray()->all();
    }

    public function actionMine()
    {
        $queryParams = Yii::$app->request->queryParams;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);
        $dataProvider->query->andWhere(['creator' => Yii::$app->user->id]);
        return $dataProvider;
    }

    public function actionList()
    {
        $queryParams = Yii::$app->request->queryParams;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);
        return $dataProvider;
    }


    /**
     * 用户作品列表
     * @param string $username 用户名
     */
    public function actionUserWorks($username)
    {
        $user = $this->getRequestedUser($username);
        $queryParams = Yii::$app->request->queryParams;
        $searchModel = new PhotoSearch();
        $dataProvider = $searchModel->search($queryParams);
        $dataProvider->query->andWhere(['creator' => $user->id]);
        return $dataProvider;
    }


}
